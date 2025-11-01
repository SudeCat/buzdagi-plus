import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable, TextInput, Dimensions } from "react-native";
import { useState } from "react";
import React from "react";
import { SearchProvider, useSearch } from "../contexts/SearchContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isMobile = SCREEN_WIDTH < 768;
const isSmallMobile = SCREEN_WIDTH < 400;

function BrandTitle() {
  const router = useRouter();
  const pathname = usePathname();
  const { setSearchQuery } = useSearch();
  const isHome = !pathname || pathname === "/" || pathname === "/index";
  
  return (
    <Pressable
      onPress={() => {
        if (!isHome) {
          // Clear search query
          setSearchQuery("");
          // Navigate to home
          if (typeof window !== 'undefined') {
            window.history.pushState({ route: '/' }, '', '/');
          }
          router.replace("/");
        }
      }}
      style={{ flex: 1, alignItems: "center" }}
    >
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 18 : 20) : 22, 
          fontWeight: "700", 
          color: "#111827", 
          letterSpacing: -0.5 
        }}>
          Buzdağı Plus
        </Text>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 9 : 10) : 11, 
          color: "#6b7280", 
          marginTop: 2, 
          letterSpacing: 0.5 
        }}>
          SU & İÇECEK TESLİMATI
        </Text>
      </View>
    </Pressable>
  );
}

function HeaderActions() {
  const router = useRouter();
  
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Pressable
        onPress={() => router.push("/about")}
        style={{
          paddingVertical: isMobile ? 6 : 8,
          paddingHorizontal: isMobile ? (isSmallMobile ? 10 : 12) : 14,
          borderRadius: 8,
          backgroundColor: "#111827",
        }}
      >
        <Text style={{ 
          color: "#fff", 
          fontWeight: "600", 
          fontSize: isMobile ? (isSmallMobile ? 11 : 12) : 13 
        }}>
          İletişim
        </Text>
      </Pressable>
    </View>
  );
}

function SearchBar() {
  const { searchQuery, setSearchQuery, setShouldExecuteSearch } = useSearch();
  const inputRef = React.useRef(null);
  const [localValue, setLocalValue] = React.useState(searchQuery || "");
  const isTypingRef = React.useRef(false);
  const typingTimeoutRef = React.useRef(null);
  
  // Sync local value with global search query (but don't override if user is typing)
  React.useEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(searchQuery || "");
    }
  }, [searchQuery]);
  
  // Track typing state - mark as typing when user types
  // But DON'T trigger search automatically - only on Enter or explicit action
  const handleTextChange = (text) => {
    console.log("⌨️ Text changed to:", text);
    isTypingRef.current = true;
    setLocalValue(text);
    // Update search query for display, but don't trigger search yet
    setSearchQuery(text);
    
    // Clear typing flag after user stops typing for 2 seconds
    // But still don't auto-search unless Enter is pressed
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      console.log("⏸️ User stopped typing (but search not triggered yet)");
    }, 2000);
  };
  
  // Execute search when Enter is pressed
  const handleSubmit = () => {
    console.log("🔍 Enter pressed - executing search");
    isTypingRef.current = false; // Mark as not typing immediately
    
    // Clear any pending typing timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Set flag to allow search execution FIRST
    setShouldExecuteSearch(true);
    
    // Then update the query to trigger search (this will see shouldExecuteSearch=true)
    setSearchQuery(localValue);
    
    // Reset flag after a longer delay to ensure search executes
    setTimeout(() => {
      setShouldExecuteSearch(false);
    }, 500); // Increased delay to ensure search completes
  };
  
  // Keep focus after navigation
  React.useEffect(() => {
    // Re-focus after a short delay if input exists and we're still on a page
    const focusTimeout = setTimeout(() => {
      if (inputRef.current && localValue && localValue.length > 0) {
        try {
          inputRef.current.focus();
          console.log("🔍 Re-focused search bar after navigation");
        } catch (e) {
          console.log("⚠️ Could not re-focus:", e);
        }
      }
    }, 100);
    
    return () => clearTimeout(focusTimeout);
  }, [localValue]);
  
  const handleClear = () => {
    console.log("🗑️ Clearing search");
    isTypingRef.current = false;
    setLocalValue("");
    setSearchQuery("");
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <View style={{ 
      paddingHorizontal: isMobile ? (isSmallMobile ? 12 : 16) : 20, 
      paddingVertical: isMobile ? 10 : 12, 
      backgroundColor: "#ffffff", 
      borderBottomWidth: 1, 
      borderBottomColor: "#e5e7eb",
      position: "relative",
      zIndex: 10, // Keep search bar above banner
    }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f9fafb",
          borderRadius: isMobile ? 10 : 12,
          paddingHorizontal: isMobile ? (isSmallMobile ? 12 : 14) : 16,
          paddingVertical: isMobile ? 10 : 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
        onTouchStart={() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 14 : 15) : 16, 
          marginRight: isMobile ? 8 : 10, 
          color: "#9ca3af" 
        }}>
          🔍
        </Text>
        <TextInput
          ref={inputRef}
          style={{ 
            flex: 1, 
            fontSize: isMobile ? (isSmallMobile ? 14 : 15) : 15, 
            color: "#111827", 
            caretColor: "#111827",
            outline: "none",
            padding: 0,
            margin: 0,
            minHeight: isMobile ? 20 : 24,
            borderWidth: 0,
            backgroundColor: "transparent",
          }}
          placeholder="Ürün ara..."
          placeholderTextColor="#9ca3af"
          value={localValue}
          onChangeText={handleTextChange}
          onChange={(e) => {
            const text = e?.nativeEvent?.text || e?.target?.value || "";
            console.log("📝 onChange - text:", text);
            if (text !== localValue) {
              handleTextChange(text);
            }
          }}
          onKeyPress={(e) => {
            console.log("⌨️ onKeyPress:", e.nativeEvent?.key);
            isTypingRef.current = true;
            // Clear typing flag after a delay
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              isTypingRef.current = false;
            }, 600);
          }}
          editable={true}
          autoCapitalize="none"
          autoCorrect={false}
          caretHidden={false}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          onFocus={() => {
            console.log("👁️ Search input focused");
          }}
          onBlur={() => {
            console.log("👁️ Search input blurred");
            // Only blur if user isn't actively typing
            if (!isTypingRef.current) {
              console.log("✅ Blur allowed - user not typing");
            } else {
              console.log("⚠️ Blur prevented - user is typing");
              // Re-focus if user is typing
              setTimeout(() => {
                if (inputRef.current && isTypingRef.current) {
                  inputRef.current.focus();
                }
              }, 10);
            }
          }}
        />
        {localValue && localValue.length > 0 && (
          <Pressable
            onPress={handleClear}
            style={{ marginLeft: 8, padding: 4 }}
          >
            <Text style={{ fontSize: 16, color: "#6b7280" }}>✕</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function CustomHeader() {
      return (
        <View>
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            paddingHorizontal: isMobile ? (isSmallMobile ? 12 : 16) : 20,
            paddingVertical: isMobile ? 12 : 16,
            backgroundColor: "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          }}>
            <BrandTitle />
            <HeaderActions />
          </View>
          <SearchBar />
        </View>
      );
    }

export default function RootLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldExecuteSearch, setShouldExecuteSearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Handle browser back/forward buttons and refresh
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Handle browser back/forward buttons
      const handlePopState = (event) => {
        const browserPath = window.location.pathname;
        console.log("🔙 Browser back/forward clicked, going to:", browserPath);
        
        // Clear search when navigating back
        setSearchQuery("");
        
        // Navigate router to match browser location
        if (browserPath === '/' || browserPath === '/index') {
          router.replace('/');
        } else {
          router.replace(browserPath);
        }
      };
      
      // Handle refresh - redirect to home if on category pages
      const handleBeforeUnload = () => {
        // Clear search on refresh
        if (window.sessionStorage) {
          sessionStorage.setItem('clearingSearch', 'true');
        }
      };
      
      // Only set up event listeners, don't do refresh checks on every render
      // Refresh check should only happen once on mount
      let mountTimeout;
      if (pathname === '/' || pathname === '/index' || !pathname) {
        // On home page, only check refresh once on initial mount
        mountTimeout = setTimeout(() => {
          const navType = window.performance?.navigation?.type;
          const isRefresh = navType === 1; // TYPE_RELOAD (actual refresh)
          if (isRefresh && window.sessionStorage) {
            // Clear search state on refresh
            window.sessionStorage.removeItem('hadSearchQuery');
            window.sessionStorage.removeItem('navigatedFromSearch');
          }
        }, 100);
      }
      
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        if (mountTimeout) clearTimeout(mountTimeout);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [router, pathname, setSearchQuery]);
  
  return (
    <SearchProvider value={{ searchQuery, setSearchQuery, shouldExecuteSearch, setShouldExecuteSearch }}>
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#ffffff",
              borderBottomWidth: 0,
            },
            headerShadowVisible: false,
            headerBackVisible: false, // Hide default back button, we use custom
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: "",
              header: () => <CustomHeader />,
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="water" 
            options={{ 
              title: "",
              header: () => <CustomHeader />,
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="beverages" 
            options={{ 
              title: "",
              header: () => <CustomHeader />,
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="about" 
            options={{ 
              title: "",
              header: () => <CustomHeader />,
              headerShown: true,
            }} 
          />
        </Stack>
      </View>
    </SearchProvider>
  );
}
