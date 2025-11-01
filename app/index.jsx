import { Link } from "expo-router";
import { Image, ScrollView, Text, View, Pressable } from "react-native";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { getImageSource } from "../utils/imageLoader";

// Store image with multiple fallback paths
const getStoreImageSource = () => {
  // Try require first (works in React Native)
  try {
    const required = require("../assets/images/store.jpg");
    if (required && required.uri) return required;
    if (required && required.default) return { uri: required.default };
  } catch (e) {
    // require failed, use URI paths
  }
  
  // For web, try multiple possible paths (public folder first)
  const paths = [
    "/assets/images/store.jpg",  // Public folder path
    "/images/store.jpg",
    "assets/images/store.jpg",
    "./assets/images/store.jpg"
  ];
  
  // Return first path, Image component will handle errors
  return { uri: paths[0] };
};

const storeImageSource = getStoreImageSource();

// Water image source - try multiple methods
const getWaterImageSource = () => {
  // Method 1: Try require (works if Metro serves it)
  try {
    const required = require("../assets/images/water-5245722_1280.jpg");
    console.log("✅ Water image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/water-5245722_1280.jpg",
    "assets/images/water-5245722_1280.jpg",
    "./assets/images/water-5245722_1280.jpg",
    "http://localhost:8081/assets/images/water-5245722_1280.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const waterImageSource = getWaterImageSource();

// Beverage image source - try multiple methods
const getBeverageImageSource = () => {
  // Method 1: Try require (works if Metro serves it)
  try {
    const required = require("../assets/images/beverages-3105631_1280.jpg");
    console.log("✅ Beverage image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/beverages-3105631_1280.jpg",
    "assets/images/beverages-3105631_1280.jpg",
    "./assets/images/beverages-3105631_1280.jpg",
    "http://localhost:8081/assets/images/beverages-3105631_1280.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const beverageImageSource = getBeverageImageSource();

// Telephone/Contact image source - try multiple methods
const getTelephoneImageSource = () => {
  // Method 1: Try require (works if Metro serves it)
  try {
    const required = require("../assets/images/telephone-612061_1280.jpg");
    console.log("✅ Telephone image loaded via require:", required);
    return required;
  } catch (e) {
    console.log("⚠️ Require failed, trying URI paths:", e.message);
  }
  
  // Method 2: Try multiple URI paths for web
  const paths = [
    "/assets/images/telephone-612061_1280.jpg",
    "assets/images/telephone-612061_1280.jpg",
    "./assets/images/telephone-612061_1280.jpg",
    "http://localhost:8081/assets/images/telephone-612061_1280.jpg"
  ];
  
  console.log("🌐 Trying URI path:", paths[0]);
  return { uri: paths[0] };
};

const telephoneImageSource = getTelephoneImageSource();

const CategoryCard = ({ title, subtitle, href, image }) => {
  // Handle both string paths and image source objects
  const imageSource = typeof image === 'object' && image !== null 
    ? image 
    : getImageSource(image);
    
  return (
    <Link href={href} asChild>
      <Pressable style={{ marginBottom: 24 }}>
        <View style={{ position: "relative", borderRadius: 28, overflow: "hidden", height: 220 }}>
          <Image
            source={imageSource}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            onError={(error) => {
              console.error("Failed to load category image:", image, error);
              console.log("Image source was:", imageSource);
            }}
            onLoad={() => {
              console.log("Category image loaded successfully:", image);
            }}
          />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 24,
            backgroundColor: "rgba(15,23,42,0.5)",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 6,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#e2e8f0",
              lineHeight: 20,
              fontWeight: "500",
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  </Link>
  );
};

export default function HomeScreen() {
  useGlobalSearch();

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      style={{ backgroundColor: "#f9fafb" }}
    >
      {/* Hero Section - Store Image */}
      <View style={{ position: "relative", borderRadius: 32, overflow: "hidden", marginBottom: 32, height: 320, backgroundColor: "#1e293b" }}>
        <Image
          source={storeImageSource}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={(error) => {
            console.error("Failed to load store image:", error.nativeEvent.error);
            console.log("Tried path:", storeImageSource);
          }}
          onLoad={() => {
            console.log("Store image loaded successfully!");
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 32,
            backgroundColor: "rgba(15,23,42,0.5)",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#ffffff",
              marginBottom: 12,
              letterSpacing: -1,
            }}
          >
            Saf Su, Ferahlatan İçecekler
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#cbd5e1",
              lineHeight: 24,
              fontWeight: "500",
            }}
          >
            İhtiyacınız olan su ve içecekleri kolayca keşfedin. Uygun fiyat, hızlı teslimat ve güler yüzlü hizmet.
          </Text>
        </View>
      </View>

      {/* Category Cards - Minimal Design */}
      <CategoryCard
        title="Su Ürünleri"
        subtitle="Damacana, şişe ve maden suyu seçenekleri"
        href="/water"
        image={waterImageSource}
      />

      <CategoryCard
        title="İçecekler"
        subtitle="Gazoz, meyve suyu, soğuk çay ve daha fazlası"
        href="/beverages"
        image={beverageImageSource}
      />

      <CategoryCard
        title="İletişim"
        subtitle="Adres, çalışma saatleri ve iletişim bilgileri"
        href="/about"
        image={telephoneImageSource}
      />

      {/* Feature Cards - Side by Side */}
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f8fafc", borderRadius: 20, marginRight: 6 }}>
          <Text style={{ fontSize: 28, marginBottom: 12 }}>🚚</Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 8, letterSpacing: -0.3 }}>
            Teslimat Bilgileri
          </Text>
          <Text style={{ fontSize: 14, color: "#475569", lineHeight: 20, fontWeight: "500" }}>
            Aynı gün teslimat • Min. 150 TL • Şehir merkezi
          </Text>
        </View>
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f8fafc", borderRadius: 20, marginLeft: 6 }}>
          <Text style={{ fontSize: 28, marginBottom: 12 }}>⭐</Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 8, letterSpacing: -0.3 }}>
            Neden Buzdağı Plus?
          </Text>
          <Text style={{ fontSize: 14, color: "#475569", lineHeight: 20, fontWeight: "500" }}>
            Hızlı teslimat • Geniş ürün yelpazesi • Güvenilir hizmet
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
