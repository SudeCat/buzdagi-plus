import { Image, FlatList, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as XLSX from "xlsx";
import { getImageSource } from "../utils/imageLoader";
import { useSearch } from "../contexts/SearchContext";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { searchProducts } from "../utils/searchHelper";

const { width } = Dimensions.get("window");
const itemWidth = (width - 56) / 2; // Better spacing

// Get image source for Buzdağı Bardak Su - similar to category images in index.jsx
const getBuzdagiBardakImageSource = () => {
  // Try require first (works if Metro serves it)
  try {
    const required = require("../assets/images/water/buzdagi_bardak_su.jpg");
    console.log("✅ Buzdağı Bardak image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/water/buzdagi_bardak_su.jpg",
    "assets/images/water/buzdagi_bardak_su.jpg",
    "./assets/images/water/buzdagi_bardak_su.jpg",
    "http://localhost:8081/assets/images/water/buzdagi_bardak_su.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const buzdagiBardakImageSource = getBuzdagiBardakImageSource();

// Get image source for Buzdağı Su 19L - similar to category images in index.jsx
const getBuzdagi19LImageSource = () => {
  // Try require first (works if Metro serves it)
  try {
    const required = require("../assets/images/water/buzdagi_19_L.jpg");
    console.log("✅ Buzdağı 19L image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/water/buzdagi_19_L.jpg",
    "assets/images/water/buzdagi_19_L.jpg",
    "./assets/images/water/buzdagi_19_L.jpg",
    "http://localhost:8081/assets/images/water/buzdagi_19_L.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const buzdagi19LImageSource = getBuzdagi19LImageSource();

// Get image source for Buzdağı Su 5L - similar to category images in index.jsx
const getBuzdagi5LImageSource = () => {
  // Try require first (works if Metro serves it)
  try {
    const required = require("../assets/images/water/buzdagi_5_L.jpg");
    console.log("✅ Buzdağı 5L image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/water/buzdagi_5_L.jpg",
    "assets/images/water/buzdagi_5_L.jpg",
    "./assets/images/water/buzdagi_5_L.jpg",
    "http://localhost:8081/assets/images/water/buzdagi_5_L.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const buzdagi5LImageSource = getBuzdagi5LImageSource();

// Get image source for Buzdağı Su 1.5L - similar to category images in index.jsx
const getBuzdagi1_5LImageSource = () => {
  // Try require first (works if Metro serves it)
  try {
    const required = require("../assets/images/water/buzdagi_1_5_L.jpg");
    console.log("✅ Buzdağı 1.5L image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/water/buzdagi_1_5_L.jpg",
    "assets/images/water/buzdagi_1_5_L.jpg",
    "./assets/images/water/buzdagi_1_5_L.jpg",
    "http://localhost:8081/assets/images/water/buzdagi_1_5_L.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const buzdagi1_5LImageSource = getBuzdagi1_5LImageSource();

// Get image source for Buzdağı Su 0.5L - similar to category images in index.jsx
const getBuzdagi0_5LImageSource = () => {
  // Try require first (works if Metro serves it)
  try {
    const required = require("../assets/images/water/buzdagi_0_5_L.jpg");
    console.log("✅ Buzdağı 0.5L image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/water/buzdagi_0_5_L.jpg",
    "assets/images/water/buzdagi_0_5_L.jpg",
    "./assets/images/water/buzdagi_0_5_L.jpg",
    "http://localhost:8081/assets/images/water/buzdagi_0_5_L.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const buzdagi0_5LImageSource = getBuzdagi0_5LImageSource();

const ItemCard = ({ item }) => {
  if (!item || !item.id) return null;
  
  // Check if this is Buzdağı Bardak Su product and use specific image
  const isBuzdagiBardak = item?.name?.toLowerCase().includes("buzdağı bardak") || 
                         item?.name?.toLowerCase().includes("buzdagi bardak");
  
  // Check if this is Buzdağı Su 19L product and use specific image
  const isBuzdagi19L = item?.name?.toLowerCase().includes("buzdağı su 19l") || 
                      item?.name?.toLowerCase().includes("buzdagi su 19l") ||
                      item?.name?.toLowerCase().includes("buzdağı su 19 l") ||
                      item?.name?.toLowerCase().includes("buzdagi su 19 l");
  
  // Check if this is Buzdağı Su 5L product and use specific image
  const isBuzdagi5L = item?.name?.toLowerCase().includes("buzdağı su 5l") || 
                     item?.name?.toLowerCase().includes("buzdagi su 5l") ||
                     item?.name?.toLowerCase().includes("buzdağı su 5 l") ||
                     item?.name?.toLowerCase().includes("buzdagi su 5 l");
  
  // Check if this is Buzdağı Su 1.5L product and use specific image
  const isBuzdagi1_5L = item?.name?.toLowerCase().includes("buzdağı su 1.5l") || 
                        item?.name?.toLowerCase().includes("buzdagi su 1.5l") ||
                        item?.name?.toLowerCase().includes("buzdağı su 1,5l") ||
                        item?.name?.toLowerCase().includes("buzdagi su 1,5l") ||
                        item?.name?.toLowerCase().includes("buzdağı su 1.5 l") ||
                        item?.name?.toLowerCase().includes("buzdagi su 1.5 l") ||
                        item?.name?.toLowerCase().includes("buzdağı su 1,5 l") ||
                        item?.name?.toLowerCase().includes("buzdagi su 1,5 l");
  
  // Check if this is Buzdağı Su 0.5L product and use specific image
  const productNameLower = item?.name?.toLowerCase() || "";
  const isBuzdagi0_5L = productNameLower.includes("buzdağı su 0.5l") || 
                        productNameLower.includes("buzdagi su 0.5l") ||
                        productNameLower.includes("buzdağı su 0,5l") ||
                        productNameLower.includes("buzdagi su 0,5l") ||
                        productNameLower.includes("buzdağı su 0.5 l") ||
                        productNameLower.includes("buzdagi su 0.5 l") ||
                        productNameLower.includes("buzdağı su 0,5 l") ||
                        productNameLower.includes("buzdagi su 0,5 l") ||
                        // Also check for "0.5ml", "0,5ml", "0.5 ml", "0,5 ml" variations
                        (productNameLower.includes("0.5ml") && productNameLower.includes("buzdağı")) ||
                        (productNameLower.includes("0,5ml") && productNameLower.includes("buzdağı")) ||
                        (productNameLower.includes("0.5 ml") && productNameLower.includes("buzdağı")) ||
                        (productNameLower.includes("0,5 ml") && productNameLower.includes("buzdağı")) ||
                        (productNameLower.includes("0.5l") && productNameLower.includes("buzdağı")) ||
                        (productNameLower.includes("0,5l") && productNameLower.includes("buzdağı")) ||
                        (productNameLower.includes("0.5 l") && productNameLower.includes("buzdağı")) ||
                        (productNameLower.includes("0,5 l") && productNameLower.includes("buzdağı")) ||
                        // Check if product name contains "0,5" or "0.5" followed by "ml" or "l" anywhere
                        (productNameLower.match(/0[.,]5\s*(ml|l)/) && productNameLower.includes("buzdağı"));
  
  // Combine checks for special styling
  const isSpecialProduct = isBuzdagiBardak || isBuzdagi19L || isBuzdagi5L || isBuzdagi1_5L || isBuzdagi0_5L;
  
  // Get image source - use specific image for special products, otherwise use item.image
  let imageSource;
  if (isBuzdagiBardak) {
    imageSource = buzdagiBardakImageSource;
  } else if (isBuzdagi19L) {
    imageSource = buzdagi19LImageSource;
  } else if (isBuzdagi5L) {
    imageSource = buzdagi5LImageSource;
  } else if (isBuzdagi1_5L) {
    imageSource = buzdagi1_5LImageSource;
  } else if (isBuzdagi0_5L) {
    imageSource = buzdagi0_5LImageSource;
  } else {
    imageSource = getImageSource(item?.image);
  }
  
  // State to store image aspect ratio for special products
  const [aspectRatio, setAspectRatio] = useState(isSpecialProduct ? null : undefined);
  
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
          // For special products: use dynamic aspectRatio if available, otherwise use flex to let image determine size
          // For others: fixed height
          ...(isSpecialProduct 
            ? (aspectRatio ? { aspectRatio } : { minHeight: 140, maxHeight: 200 })
            : { height: 160 }
          ),
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: "#ffffff",
          position: "relative",
          marginBottom: 12,
          padding: isSpecialProduct ? 20 : 0, // Add padding to make image smaller inside container
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={imageSource}
          style={{ 
            width: isSpecialProduct ? "85%" : "100%", // Smaller width for special products
            ...(isSpecialProduct && !aspectRatio 
              ? { height: undefined, aspectRatio: 1 } // Let image determine height initially
              : { height: "100%" }
            ),
          }}
          resizeMode={isSpecialProduct ? "contain" : "cover"}
          onError={(error) => {
            console.error("❌ Failed to load product image:", item?.name, error);
            console.log("Image source was:", imageSource);
            console.log("Is special product:", isSpecialProduct);
            console.log("Is Buzdağı 0.5L:", isBuzdagi0_5L);
          }}
          onLoad={(event) => {
            console.log("✅ Product image loaded successfully:", item?.name);
            if (isBuzdagi0_5L) {
              console.log("🎯 Buzdağı 0.5L detected! Image source:", imageSource);
            }
            
            // For special products, get actual image dimensions and set aspect ratio
            if (isSpecialProduct && !aspectRatio) {
              const { width, height } = event.nativeEvent?.source || event.target || {};
              
              // Try to get dimensions from different sources (web vs native)
              let imgWidth, imgHeight;
              
              if (width && height) {
                imgWidth = width;
                imgHeight = height;
              } else if (event.target) {
                // For web, try getting naturalWidth/naturalHeight
                imgWidth = event.target.naturalWidth || event.target.width;
                imgHeight = event.target.naturalHeight || event.target.height;
              }
              
              if (imgWidth && imgHeight && imgHeight > 0) {
                const calculatedRatio = imgWidth / imgHeight;
                console.log("📐 Image dimensions:", imgWidth, "x", imgHeight, "| Aspect ratio:", calculatedRatio);
                setAspectRatio(calculatedRatio);
              } else {
                // Fallback aspect ratio if dimensions not available
                console.log("⚠️ Could not get image dimensions, using fallback");
                setAspectRatio(4/3);
              }
            }
          }}
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
            SU
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontWeight: "700",
          fontSize: isSpecialProduct ? 17 : 15, // Bigger font for special products
          color: "#0f172a",
          lineHeight: 24,
          letterSpacing: -0.3,
          paddingHorizontal: 4,
          textAlign: isSpecialProduct ? "center" : "left", // Center align for special products
          marginTop: isSpecialProduct ? 4 : 0,
        }}
        numberOfLines={2}
      >
        {item?.name || "Ürün Adı"}
      </Text>
    </View>
  );
};

export default function WaterScreen() {
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
      if (v === "water" || v === "su") return "water";
      if (v === "beverages" || v === "beverage" || v === "içecek" || v === "icecek") return "beverages";
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
            const productName = String(row.name ?? row.Name ?? row["product name"] ?? row["ürün adı"] ?? row["Urun Adi"] ?? "").trim();
            
            // Keep original image path from XLSX (or empty if none)
            // The ItemCard component will handle the specific image for Buzdağı Bardak products
            const imagePath = String(row.image ?? row.Image ?? row["image path"] ?? "").trim();
            
            return {
              id: String(row.id ?? row.ID ?? row.Id ?? "").trim(),
              name: productName,
              image: imagePath,
              category: normalizeCategory(categoryRaw),
            };
          });

          const waterItems = mapped.filter((r) => r.category === "water");
          setAllItems(waterItems);
          setLoading(false);
        })
        .catch((error) => {
          console.warn(`Failed to load XLSX from ${xlsxPaths[pathIndex]}:`, error);
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
              Su ürünü bulunamadı
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center" }}>
              products.xlsx dosyasında su kategorisi olan ürünler olmalı
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
          Su Ürünleri
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
