import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "expo-router";
import { useSearch } from "../contexts/SearchContext";
import * as XLSX from "xlsx";
import { searchProducts } from "../utils/searchHelper";

export function useGlobalSearch() {
  const { searchQuery, shouldExecuteSearch } = useSearch();
  const router = useRouter();
  const pathname = usePathname();
  const navigationRef = useRef(false); // Prevent multiple navigations
  const isUserTypingRef = useRef(false); // Track if user is actively typing
  const routerReadyRef = useRef(false); // Track if router is ready
  
  // Mark router as ready after a delay on mount
  useEffect(() => {
    const readyTimeout = setTimeout(() => {
      routerReadyRef.current = true;
      console.log("✅ Router is ready");
    }, 500); // Wait 500ms after mount
    
    return () => clearTimeout(readyTimeout);
  }, []);

  useEffect(() => {
    console.log("🔄 useGlobalSearch triggered - searchQuery:", searchQuery, "| pathname:", pathname);
    
    // Track typing timeout cleanup
    let typingTimeoutCleanup = null;
    
    // Mark user as typing when search query changes
    if (searchQuery && searchQuery.length > 0) {
      isUserTypingRef.current = true;
      // Set timeout to clear typing flag after 2 seconds (matches SearchBar timeout)
      const typingTimeout = setTimeout(() => {
        isUserTypingRef.current = false;
        console.log("✅ User stopped typing for 2 seconds - search can proceed");
      }, 2000);
      typingTimeoutCleanup = () => clearTimeout(typingTimeout);
    } else {
      isUserTypingRef.current = false;
    }
    
    // Handle empty search query
    if (!searchQuery || searchQuery.trim().length === 0) {
      navigationRef.current = false;
      // Only redirect to home if search was previously set and then cleared
      // Don't redirect on initial page load when navigating from category cards
      const wasSearching = typeof window !== 'undefined' && 
                          window.sessionStorage?.getItem('hadSearchQuery') === 'true';
      
      if (wasSearching && pathname && (pathname.includes('/water') || pathname.includes('/beverages'))) {
        console.log("🔙 Search cleared after being set, returning to home");
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('hadSearchQuery');
          window.history.pushState({ route: '/' }, '', '/');
        }
        
        // Wait for router to be ready before navigating
        const navigateHome = () => {
          if (!routerReadyRef.current) {
            setTimeout(navigateHome, 100);
            return;
          }
          
          try {
            router.replace('/');
          } catch (e) {
            console.warn("⚠️ Router replace failed, trying later:", e);
            setTimeout(() => {
              try {
                router.replace('/');
              } catch (e2) {
                console.error("❌ Router replace failed after retry:", e2);
              }
            }, 500);
          }
        };
        
        setTimeout(navigateHome, 300);
        return;
      }
      
      // Clear the flag if search is empty
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem('hadSearchQuery');
      }
      console.log("⏸️ Search empty, exiting early");
      return; // Exit early if no search query
    }
    
    // We have a search query - process it
    const query = searchQuery.trim();
    if (query.length === 0) {
      console.log("⏸️ Query empty after trim, exiting");
      return;
    }
    
    console.log("✅ Processing search query:", query);
    
    // Mark that we had a search query
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('hadSearchQuery', 'true');
    }

    const normalizedQuery = query.toLowerCase();
    console.log("🔍 Normalized query:", normalizedQuery);
    
    // Check if we're on the home/main page FIRST
    const isHomePage = !pathname || 
                     pathname === "/" || 
                     pathname === "/index" || 
                     pathname === "" ||
                     pathname === null ||
                     (!pathname.includes("water") && !pathname.includes("beverages") && !pathname.includes("about"));
    
    console.log("🔍 SEARCH:", normalizedQuery, "| Pathname:", pathname, "| IsHomePage:", isHomePage);
    
    const xlsxPaths = [
      "/data/products.xlsx",
      "/assets/data/products.xlsx",
      "data/products.xlsx",
    ];
    
    // Fetch and navigate immediately
    const searchAndNavigate = async () => {
      try {
        // Try all paths
        let arrayBuffer = null;
        let workingPath = null;
        
        for (const path of xlsxPaths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              // Check if it's actually an Excel file (not HTML error page)
              const contentType = response.headers.get('content-type') || '';
              const isExcel = contentType.includes('excel') || 
                            contentType.includes('spreadsheet') ||
                            contentType.includes('vnd.openxmlformats') ||
                            path.endsWith('.xlsx');
              
              // Also check first bytes to verify it's not HTML
              const buffer = await response.arrayBuffer();
              if (buffer.byteLength > 0) {
                // Check if it's HTML (starts with <)
                const firstBytes = new Uint8Array(buffer.slice(0, 10));
                const firstChar = String.fromCharCode(firstBytes[0]);
                if (firstChar === '<') {
                  console.warn(`⚠️ Path ${path} returned HTML instead of Excel file`);
                  continue; // Skip this path, it's HTML
                }
                
                arrayBuffer = buffer;
                workingPath = path;
                break;
              }
            }
          } catch (e) {
            console.warn(`⚠️ Failed to fetch ${path}:`, e.message);
            continue;
          }
        }

        if (!arrayBuffer || !workingPath) {
          console.error("❌ Could not load products.xlsx from any path");
          console.error("   Tried paths:", xlsxPaths);
          console.error("   Make sure products.xlsx exists in the data/ folder");
          // Don't throw error, just silently fail - search won't work but app won't crash
          return;
        }

        console.log("✅ Loaded products.xlsx from:", workingPath, "| Size:", arrayBuffer.byteLength, "bytes");
        
        // Verify it's a valid Excel file before parsing
        try {
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const normalizeCategory = (value) => {
          if (!value) return "";
          const v = String(value).trim().toLowerCase();
          if (v === "water" || v === "su") return "water";
          if (v.includes("beverage") || v.includes("içecek") || v.includes("icecek")) return "beverages";
          return v;
        };

        const products = jsonData.map((row) => {
          const categoryRaw = row.category ?? row.Category ?? "";
          return {
            id: String(row.id ?? row.ID ?? row.Id ?? "").trim(),
            name: String(row.name ?? row.Name ?? row["product name"] ?? row["ürün adı"] ?? "").trim(),
            category: normalizeCategory(categoryRaw),
          };
        });

        // Find matching products
        const matchedProducts = searchProducts(products, normalizedQuery);
        const matches = matchedProducts.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category
        }));

        console.log("📦 Products:", products.length, "| Matches:", matches.length);
        console.log("📋 Matched:", matches.map(m => `${m.name} (${m.category})`).slice(0, 5));

        if (matches.length === 0) {
          return;
        }

        const waterMatches = matches.filter(m => m.category === "water");
        const beverageMatches = matches.filter(m => m.category === "beverages");

        console.log("💧 Water:", waterMatches.length, "| 🥤 Beverages:", beverageMatches.length);

        // If on home page AND we have matches, navigate
        if (isHomePage && matches.length > 0) {
          if (navigationRef.current) {
            console.log("⚠️ Navigation already in progress, skipping");
            return;
          }
          
          // Only check typing flag if Enter was NOT pressed
          // If Enter was pressed (shouldExecuteSearch), always navigate
          if (!shouldExecuteSearch && isUserTypingRef.current) {
            console.log("⏸️ User still typing and Enter not pressed, skipping navigation");
            return;
          }
          
          navigationRef.current = true; // Prevent duplicate navigations
          
          let targetRoute = null;
          if (waterMatches.length > 0 && beverageMatches.length > 0) {
            targetRoute = "/water"; // Prioritize water
          } else if (waterMatches.length > 0) {
            targetRoute = "/water";
          } else if (beverageMatches.length > 0) {
            targetRoute = "/beverages";
          }

          if (targetRoute) {
            console.log("🚀 NAVIGATING TO:", targetRoute, "from home page");
            // Mark navigation in sessionStorage for refresh detection
            if (typeof window !== 'undefined' && window.sessionStorage) {
              sessionStorage.setItem('navigatedFromSearch', 'true');
            }
            
            // Wait for router to be ready before navigating
            // Use a longer delay to ensure router is mounted
            setTimeout(() => {
              try {
                // For web, use window.history to properly add to browser history
                if (typeof window !== 'undefined') {
                  // Use window.history.pushState to add to browser history
                  // This ensures back button works
                  window.history.pushState({ route: targetRoute, from: 'search' }, '', targetRoute);
                  // Then update router to match (with additional delay for safety)
                  setTimeout(() => {
                    try {
                      router.push(targetRoute);
                    } catch (e) {
                      console.warn("⚠️ Router push failed, trying replace:", e);
                      router.replace(targetRoute);
                    }
                  }, 100);
                } else {
                  router.push(targetRoute);
                }
              } catch (e) {
                console.warn("⚠️ Navigation error:", e);
              }
            }, 200); // Wait 200ms for router to be ready
          } else {
            console.log("⚠️ No target route determined");
          }
        } 
        // If on water page but matches are beverages, navigate
        else if ((pathname?.includes("water")) && waterMatches.length === 0 && beverageMatches.length > 0) {
          console.log("🚀 NAVIGATING TO /beverages (from water page)");
          navigationRef.current = true;
          
          const navigateToBeverages = () => {
            if (!routerReadyRef.current) {
              setTimeout(navigateToBeverages, 100);
              return;
            }
            
            try {
              router.push("/beverages");
            } catch (e) {
              console.warn("⚠️ Router push failed, retrying:", e);
              setTimeout(() => {
                try {
                  if (routerReadyRef.current) {
                    router.push("/beverages");
                  }
                } catch (e2) {
                  console.error("❌ Router push failed after retry:", e2);
                }
              }, 500);
            }
          };
          
          setTimeout(navigateToBeverages, 300);
        }
        // If on beverages page but matches are water, navigate
        else if ((pathname?.includes("beverages")) && beverageMatches.length === 0 && waterMatches.length > 0) {
          console.log("🚀 NAVIGATING TO /water (from beverages page)");
          navigationRef.current = true;
          
          const navigateToWater = () => {
            if (!routerReadyRef.current) {
              setTimeout(navigateToWater, 100);
              return;
            }
            
            try {
              router.push("/water");
            } catch (e) {
              console.warn("⚠️ Router push failed, retrying:", e);
              setTimeout(() => {
                try {
                  if (routerReadyRef.current) {
                    router.push("/water");
                  }
                } catch (e2) {
                  console.error("❌ Router push failed after retry:", e2);
                }
              }, 500);
            }
          };
          
          setTimeout(navigateToWater, 300);
        }
        else {
          console.log("📍 Staying on current page, filtering results");
        }
        } catch (parseError) {
          console.error("❌ Error parsing Excel file:", parseError);
          return;
        }
      } catch (error) {
        console.error("❌ Search error:", error);
      }
    };

    // Search logic: Only execute if Enter was pressed OR after user stops typing for 2 seconds
    // This prevents search from interrupting typing but allows it to work properly
    if (searchQuery && searchQuery.trim().length > 0) {
      // Check if Enter was pressed (shouldExecuteSearch flag) - execute immediately
      if (shouldExecuteSearch) {
        console.log("🔍 Enter was pressed - executing search immediately");
        isUserTypingRef.current = false; // Clear typing flag
        
        const executeSearch = () => {
          if (!routerReadyRef.current) {
            setTimeout(executeSearch, 100);
            return;
          }
          
          try {
            searchAndNavigate();
          } catch (e) {
            console.warn("⚠️ Search navigation error, retrying:", e);
            setTimeout(() => {
              try {
                if (routerReadyRef.current) {
                  searchAndNavigate();
                }
              } catch (e2) {
                console.error("❌ Search navigation failed after retry:", e2);
              }
            }, 500);
          }
        };
        
        setTimeout(executeSearch, 300);
        return; // Exit early - search executed on Enter
      }
      
      // Fallback: Wait 2 seconds after user stops typing
      // This allows search to work even if user doesn't press Enter
      const searchTimeout = setTimeout(() => {
        if (!isUserTypingRef.current) {
          console.log("✅ User stopped typing for 2 seconds, executing search (fallback)");
          
          const executeSearch = () => {
            if (!routerReadyRef.current) {
              setTimeout(executeSearch, 100);
              return;
            }
            
            try {
              searchAndNavigate();
            } catch (e) {
              console.warn("⚠️ Search navigation error:", e);
            }
          };
          
          setTimeout(executeSearch, 300);
        } else {
          console.log("⏸️ User still typing, search cancelled");
        }
      }, 2000); // Wait 2 seconds after last keystroke

      return () => {
        clearTimeout(searchTimeout);
        if (typingTimeoutCleanup) typingTimeoutCleanup();
      };
    }
    
    // Cleanup typing timeout if no search query
    return () => {
      if (typingTimeoutCleanup) typingTimeoutCleanup();
    };
  }, [searchQuery, shouldExecuteSearch, router, pathname]);
}
