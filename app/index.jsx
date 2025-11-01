import { Link } from "expo-router";
import { Image, ScrollView, Text, View, Pressable, Animated, Dimensions } from "react-native";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { getImageSource } from "../utils/imageLoader";
import { useEffect, useRef } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isMobile = SCREEN_WIDTH < 768;
const isSmallMobile = SCREEN_WIDTH < 400;

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

// Infinite Scrolling Banner Component
const ScrollingBanner = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const bannerText = "KALİTELİ ÜRÜN * HIZLI SERVİS * GÜVENİLİR HİZMET";
  // Create longer repeated text to ensure seamless scroll and no ellipsis
  const repeatedText = `${bannerText} * ${bannerText} * ${bannerText} * ${bannerText} * ${bannerText} * ${bannerText} * ${bannerText} * ${bannerText} *`;

  useEffect(() => {
    // Create infinite scroll animation
    const startAnimation = () => {
      translateX.setValue(0);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH, // Move left by screen width (one banner copy)
          duration: 20000, // 20 seconds for smooth scroll
          useNativeDriver: true,
        }),
        { iterations: -1 } // Infinite loop
      ).start();
    };

    startAnimation();
  }, [translateX]);

  return (
    <View style={{ 
      position: "relative", 
      height: isMobile ? 40 : 50, 
      overflow: "hidden",
      backgroundColor: "#1e40af", // Blue color
      transform: [{ rotate: "-2deg" }], // Diagonal angle
      marginTop: isMobile ? 12 : 20, // Responsive margin
      marginBottom: isMobile ? 24 : 32, // Responsive margin
      marginHorizontal: isMobile ? -16 : -20, // Responsive margin
    }}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX }],
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          paddingVertical: isMobile ? 8 : 12,
        }}
      >
        {/* First copy - single line, no ellipsis */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: isMobile ? 16 : 20, minWidth: SCREEN_WIDTH }}>
          <Text
            style={{
              fontSize: isMobile ? (isSmallMobile ? 12 : 14) : 18,
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: isMobile ? 0.5 : 1,
            }}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {repeatedText}
          </Text>
        </View>
        {/* Second copy for seamless loop - single line, no ellipsis */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: isMobile ? 16 : 20, minWidth: SCREEN_WIDTH }}>
          <Text
            style={{
              fontSize: isMobile ? (isSmallMobile ? 12 : 14) : 18,
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: isMobile ? 0.5 : 1,
            }}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {repeatedText}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const CategoryCard = ({ title, subtitle, href, image }) => {
  // Handle both string paths and image source objects
  const imageSource = typeof image === 'object' && image !== null 
    ? image 
    : getImageSource(image);
    
  return (
    <Link href={href} asChild>
      <Pressable style={{ marginBottom: isMobile ? 20 : 24 }}>
        <View style={{ 
          position: "relative", 
          borderRadius: isMobile ? 20 : 28, 
          overflow: "hidden", 
          height: isMobile ? (isSmallMobile ? 160 : 180) : 220 
        }}>
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
            padding: isMobile ? (isSmallMobile ? 16 : 20) : 24,
            backgroundColor: "rgba(15,23,42,0.5)",
          }}
        >
          <Text
            style={{
              fontSize: isMobile ? (isSmallMobile ? 20 : 22) : 26,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: isMobile ? 4 : 6,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: isMobile ? (isSmallMobile ? 12 : 13) : 14,
              color: "#e2e8f0",
              lineHeight: isMobile ? 18 : 20,
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
      contentContainerStyle={{ padding: isMobile ? (isSmallMobile ? 12 : 16) : 20, paddingBottom: isMobile ? 32 : 40 }}
      style={{ backgroundColor: "#f9fafb" }}
    >
      {/* Infinite Scrolling Banner - Between search and hero section */}
      <ScrollingBanner />

      {/* Hero Section - Store Image */}
      <View style={{ 
        position: "relative", 
        borderRadius: isMobile ? 24 : 32, 
        overflow: "hidden", 
        marginBottom: isMobile ? 24 : 32, 
        marginTop: isMobile ? 4 : 8, 
        height: isMobile ? (isSmallMobile ? 220 : 260) : 320, 
        backgroundColor: "#1e293b" 
      }}>
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
            padding: isMobile ? (isSmallMobile ? 20 : 24) : 32,
            backgroundColor: "rgba(15,23,42,0.5)",
          }}
        >
          <Text
            style={{
              fontSize: isMobile ? (isSmallMobile ? 24 : 28) : 36,
              fontWeight: "900",
              color: "#ffffff",
              marginBottom: isMobile ? 8 : 12,
              letterSpacing: -1,
            }}
          >
            Saf Su, Ferahlatan İçecekler
          </Text>
          <Text
            style={{
              fontSize: isMobile ? (isSmallMobile ? 13 : 14) : 16,
              color: "#cbd5e1",
              lineHeight: isMobile ? 20 : 24,
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

      {/* Feature Cards - Side by Side on desktop, stacked on mobile */}
      <View style={{ 
        flexDirection: isMobile ? "column" : "row", 
        marginTop: isMobile ? 4 : 8,
        gap: isMobile ? 12 : 0,
      }}>
        <View style={{ 
          flex: 1, 
          padding: isMobile ? (isSmallMobile ? 16 : 18) : 20, 
          backgroundColor: "#f8fafc", 
          borderRadius: isMobile ? 16 : 20, 
          marginRight: isMobile ? 0 : 6,
          marginBottom: isMobile ? 0 : 0,
        }}>
          <Text style={{ fontSize: isMobile ? (isSmallMobile ? 24 : 26) : 28, marginBottom: isMobile ? 10 : 12 }}>🚚</Text>
          <Text style={{ 
            fontSize: isMobile ? (isSmallMobile ? 16 : 17) : 18, 
            fontWeight: "700", 
            color: "#0f172a", 
            marginBottom: isMobile ? 6 : 8, 
            letterSpacing: -0.3 
          }}>
            Teslimat Bilgileri
          </Text>
          <Text style={{ 
            fontSize: isMobile ? (isSmallMobile ? 12 : 13) : 14, 
            color: "#475569", 
            lineHeight: isMobile ? 18 : 20, 
            fontWeight: "500" 
          }}>
            Aynı gün teslimat • Min. 150 TL • Şehir merkezi
          </Text>
        </View>
        <View style={{ 
          flex: 1, 
          padding: isMobile ? (isSmallMobile ? 16 : 18) : 20, 
          backgroundColor: "#f8fafc", 
          borderRadius: isMobile ? 16 : 20, 
          marginLeft: isMobile ? 0 : 6 
        }}>
          <Text style={{ fontSize: isMobile ? (isSmallMobile ? 24 : 26) : 28, marginBottom: isMobile ? 10 : 12 }}>⭐</Text>
          <Text style={{ 
            fontSize: isMobile ? (isSmallMobile ? 16 : 17) : 18, 
            fontWeight: "700", 
            color: "#0f172a", 
            marginBottom: isMobile ? 6 : 8, 
            letterSpacing: -0.3 
          }}>
            Neden Buzdağı Plus?
          </Text>
          <Text style={{ 
            fontSize: isMobile ? (isSmallMobile ? 12 : 13) : 14, 
            color: "#475569", 
            lineHeight: isMobile ? 18 : 20, 
            fontWeight: "500" 
          }}>
            Hızlı teslimat • Geniş ürün yelpazesi • Güvenilir hizmet
          </Text>
        </View>
      </View>

    </ScrollView>
  );
}
