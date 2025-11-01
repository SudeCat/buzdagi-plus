import { Image, FlatList, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as XLSX from "xlsx";
import { getImageSource } from "../utils/imageLoader";
import { useSearch } from "../contexts/SearchContext";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { searchProducts } from "../utils/searchHelper";

const { width } = Dimensions.get("window");
const itemWidth = (width - 56) / 2;

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
          height: 160,
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: "#f1f5f9",
          position: "relative",
          marginBottom: 12,
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
            top: 12,
            right: 12,
            backgroundColor: "#0f172a",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800", letterSpacing: 1 }}>
            İÇECEK
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontWeight: "700",
          fontSize: 15,
          color: "#0f172a",
          lineHeight: 22,
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
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 16, color: "#6b7280", fontSize: 14 }}>Yükleniyor...</Text>
      </View>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f9fafb" }}>
        {searchQuery ? (
          <>
            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12, textAlign: "center", color: "#111827" }}>
              Aradığınız ürün bulunamadı
            </Text>
            <Text style={{ fontSize: 15, color: "#6b7280", textAlign: "center", lineHeight: 22 }}>
              "{searchQuery}" için sonuç bulunamadı. Farklı bir arama terimi deneyebilirsiniz.
            </Text>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8, textAlign: "center", color: "#111827" }}>
              İçecek bulunamadı
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center" }}>
              products.xlsx dosyasında içecek kategorisi olan ürünler olmalı
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 20, paddingTop: 24, paddingBottom: 16 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", color: "#0f172a", marginBottom: 8, letterSpacing: -1 }}>
          İçecekler
        </Text>
        <Text style={{ fontSize: 15, color: "#64748b", fontWeight: "600" }}>
          {searchQuery ? `${filteredItems.length} sonuç` : `${filteredItems.length} ürün`}
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{ padding: 14, paddingTop: 0, paddingBottom: 24 }}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ItemCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
