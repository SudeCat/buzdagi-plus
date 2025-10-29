import { Image, FlatList, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { getImageSource } from "../utils/imageLoader";

const { width } = Dimensions.get("window");
const itemWidth = (width - 52) / 2; // Updated spacing

const ItemCard = ({ item }) => {
  if (!item || !item.id) return null;
  
  return (
    <View
      style={{
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#fff",
        margin: 10,
        width: itemWidth,
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 2,
        borderColor: "#e0f2fe",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 140,
          backgroundColor: "#dbeafe",
          position: "relative",
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
            top: 8,
            right: 8,
            backgroundColor: "rgba(59,130,246,0.9)",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            SU
          </Text>
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 14,
            color: "#1e40af",
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {item?.name || "Ürün Adı"}
        </Text>
      </View>
    </View>
  );
};

export default function WaterScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const xlsxPaths = [
      "/data/products.xlsx",
      "/assets/data/products.xlsx",
      "data/products.xlsx",
    ];

    const normalizeCategory = (value) => {
      if (!value) return "";
      const v = String(value).trim().toLowerCase();
      if (v === "water" || v === "su") return "water";
      if (v === "beverages" || v === "beverage" || v === "içecek" || v === "icecek") return "beverages";
      return v;
    };

    const tryLoadXLSX = (pathIndex) => {
      if (pathIndex >= xlsxPaths.length) {
        console.warn("Could not load XLSX from any path, using empty array");
        setItems([]);
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

          const waterItems = mapped.filter((r) => r.category === "water");
          setItems(waterItems);
          setLoading(false);
        })
        .catch((error) => {
          console.warn(`Failed to load XLSX from ${xlsxPaths[pathIndex]}:`, error);
          tryLoadXLSX(pathIndex + 1);
        });
    };
    
    tryLoadXLSX(0);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 16, color: "#64748b", fontSize: 14 }}>Yükleniyor...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f8fafc" }}>
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8, textAlign: "center", color: "#1e293b" }}>
          Su ürünü bulunamadı
        </Text>
        <Text style={{ fontSize: 14, color: "#64748b", textAlign: "center" }}>
          products.xlsx dosyasında su kategorisi olan ürünler olmalı
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View style={{ padding: 16, backgroundColor: "#fff", borderBottomWidth: 2, borderBottomColor: "#e0f2fe" }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1e40af" }}>
          Su Ürünleri ({items.length})
        </Text>
        <Text style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
          Taze ve kaliteli su seçenekleri
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
}
