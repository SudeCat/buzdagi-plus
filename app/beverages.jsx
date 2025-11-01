import { Image, FlatList, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as XLSX from "xlsx";
import { getImageSource } from "../utils/imageLoader";
import { useSearch } from "../contexts/SearchContext";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { searchProducts } from "../utils/searchHelper";

const { width } = Dimensions.get("window");
const isMobile = width < 768;
const isSmallMobile = width < 400;
// Responsive item width: 2 columns on desktop, 2 columns on tablet, 1 column on very small mobile
const numColumns = isSmallMobile ? 1 : 2;
const itemWidth = isSmallMobile ? width - 32 : (width - (isMobile ? 40 : 56)) / numColumns;

const ItemCard = ({ item }) => {
  if (!item || !item.id) return null;
  
  return (
    <View
      style={{
        width: itemWidth,
        margin: 6,
      }}
    >
      <View
        style={{
          width: "100%",
          height: isMobile ? (isSmallMobile ? 140 : 150) : 160,
          borderRadius: isMobile ? 20 : 24,
          overflow: "hidden",
          backgroundColor: "#f1f5f9",
          position: "relative",
          marginBottom: isMobile ? 10 : 12,
        }}
      >
        <Image
          source={getImageSource(item?.image)}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            top: isMobile ? 8 : 12,
            right: isMobile ? 8 : 12,
            backgroundColor: "#0f172a",
            paddingHorizontal: isMobile ? (isSmallMobile ? 8 : 10) : 12,
            paddingVertical: isMobile ? 4 : 6,
            borderRadius: isMobile ? 16 : 20,
          }}
        >
          <Text style={{ 
            color: "#fff", 
            fontSize: isMobile ? (isSmallMobile ? 9 : 10) : 11, 
            fontWeight: "800", 
            letterSpacing: 1 
          }}>
            İÇECEK
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontWeight: "700",
          fontSize: isMobile ? (isSmallMobile ? 13 : 14) : 15,
          color: "#0f172a",
          lineHeight: isMobile ? 20 : 22,
          letterSpacing: -0.3,
          paddingHorizontal: 4,
        }}
        numberOfLines={2}
      >
        {item?.name || "Ürün Adı"}
      </Text>
    </View>
  );
};

export default function BeveragesScreen() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();
  const router = useRouter();
  
  useGlobalSearch();

  useEffect(() => {
    const xlsxPaths = [
      "/data/products.xlsx",
      "/assets/data/products.xlsx",
      "data/products.xlsx",
    ];

    const normalizeCategory = (value) => {
      if (!value) return "";
      const v = String(value).trim().toLowerCase();
      if (v === "water" || v === "su" || v === "woda") return "water";
      if (v.includes("beverage") || v.includes("içecek") || v.includes("icecek") || 
          v === "drink" || v === "drinks" || v === "içki" || v === "iceki") {
        return "beverages";
      }
      return v;
    };

    const tryLoadXLSX = (pathIndex) => {
      if (pathIndex >= xlsxPaths.length) {
        console.warn("Could not load XLSX from any path, using empty array");
        setAllItems([]);
        setLoading(false);
        return;
      }

      fetch(xlsxPaths[pathIndex])
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          const mapped = jsonData.map((row) => {
            const categoryRaw = row.category ?? row.Category ?? row.type ?? row.Type ?? row.kategori ?? row.Kategori;
            return {
              id: String(row.id ?? row.ID ?? row.Id ?? "").trim(),
              name: String(row.name ?? row.Name ?? row["product name"] ?? row["ürün adı"] ?? row["Urun Adi"] ?? "").trim(),
              image: String(row.image ?? row.Image ?? row["image path"] ?? "").trim(),
              category: normalizeCategory(categoryRaw),
            };
          });

          const beverageItems = mapped.filter((r) => {
            const cat = r.category;
            return cat === "beverages" || 
                   (cat && (cat.includes("beverage") || cat.includes("içecek") || cat.includes("icecek") || cat === "drink" || cat === "drinks"));
          });
          
          if (beverageItems.length === 0) {
            const fallbackItems = jsonData.filter((row) => {
              const rawCategory = String(row.category ?? row.Category ?? "").toLowerCase().trim();
              return rawCategory === "beverage" || rawCategory === "beverages" || rawCategory.includes("beverage");
            }).map((row) => {
              return {
                id: String(row.id ?? row.ID ?? row.Id ?? "").trim(),
                name: String(row.name ?? row.Name ?? row["product name"] ?? row["ürün adı"] ?? row["Urun Adi"] ?? "").trim(),
                image: String(row.image ?? row.Image ?? row["image path"] ?? "").trim(),
                category: normalizeCategory(row.category ?? row.Category ?? ""),
              };
            });
            if (fallbackItems.length > 0) {
              setAllItems(fallbackItems);
              setLoading(false);
              return;
            }
          }

          setAllItems(beverageItems);
          setLoading(false);
        })
        .catch((error) => {
          console.error(`Failed to load XLSX from ${xlsxPaths[pathIndex]}:`, error);
          if (pathIndex === xlsxPaths.length - 1) {
            console.error("All paths failed. Make sure products.xlsx exists in data/ folder");
          }
          tryLoadXLSX(pathIndex + 1);
        });
    };
    
    tryLoadXLSX(0);
  }, []);

  // Smart search filtering
  const filteredItems = searchQuery && searchQuery.trim().length > 0
    ? searchProducts(allItems, searchQuery)
    : allItems;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" }}>
        <ActivityIndicator size={isMobile ? "small" : "large"} color="#111827" />
        <Text style={{ 
          marginTop: isMobile ? 12 : 16, 
          color: "#6b7280", 
          fontSize: isMobile ? (isSmallMobile ? 12 : 13) : 14 
        }}>
          Yükleniyor...
        </Text>
      </View>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        padding: isMobile ? (isSmallMobile ? 16 : 18) : 20, 
        backgroundColor: "#f9fafb" 
      }}>
        {searchQuery ? (
          <>
            <Text style={{ 
              fontSize: isMobile ? (isSmallMobile ? 18 : 19) : 20, 
              fontWeight: "600", 
              marginBottom: isMobile ? 10 : 12, 
              textAlign: "center", 
              color: "#111827" 
            }}>
              Aradığınız ürün bulunamadı
            </Text>
            <Text style={{ 
              fontSize: isMobile ? (isSmallMobile ? 13 : 14) : 15, 
              color: "#6b7280", 
              textAlign: "center", 
              lineHeight: isMobile ? 20 : 22 
            }}>
              "{searchQuery}" için sonuç bulunamadı. Farklı bir arama terimi deneyebilirsiniz.
            </Text>
          </>
        ) : (
          <>
            <Text style={{ 
              fontSize: isMobile ? (isSmallMobile ? 18 : 19) : 20, 
              fontWeight: "600", 
              marginBottom: isMobile ? 6 : 8, 
              textAlign: "center", 
              color: "#111827" 
            }}>
              İçecek bulunamadı
            </Text>
            <Text style={{ 
              fontSize: isMobile ? (isSmallMobile ? 12 : 13) : 14, 
              color: "#6b7280", 
              textAlign: "center" 
            }}>
              products.xlsx dosyasında içecek kategorisi olan ürünler olmalı
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ 
        padding: isMobile ? (isSmallMobile ? 12 : 16) : 20, 
        paddingTop: isMobile ? 20 : 24, 
        paddingBottom: isMobile ? 12 : 16 
      }}>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 24 : 28) : 32, 
          fontWeight: "800", 
          color: "#0f172a", 
          marginBottom: isMobile ? 6 : 8, 
          letterSpacing: -1 
        }}>
          İçecekler
        </Text>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 13 : 14) : 15, 
          color: "#64748b", 
          fontWeight: "600" 
        }}>
          {searchQuery ? `${filteredItems.length} sonuç` : `${filteredItems.length} ürün`}
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{ 
          padding: isMobile ? (isSmallMobile ? 8 : 10) : 14, 
          paddingTop: 0, 
          paddingBottom: isMobile ? 20 : 24 
        }}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => <ItemCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
