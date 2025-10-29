import { Link } from "expo-router";
import { Image, ScrollView, Text, View, Pressable } from "react-native";

const Card = ({ title, subtitle, href, image, gradient }) => (
  <Link href={href} asChild>
    <Pressable
      style={{
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <View
        style={{
          borderRadius: 24,
          overflow: "hidden",
          borderWidth: 2,
          borderColor: gradient.border || "#fff",
          backgroundColor: "#fff",
        }}
      >
        <View style={{ position: "relative", height: 200 }}>
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              backgroundColor: gradient.start,
              opacity: 0.9,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#fff",
                marginBottom: 6,
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#fff",
                opacity: 0.95,
                fontWeight: "500",
                textShadowColor: "rgba(0,0,0,0.2)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  </Link>
);

const FeatureCard = ({ icon, title, description, color }) => (
  <View
    style={{
      borderRadius: 20,
      padding: 20,
      backgroundColor: color.bg,
      borderWidth: 2,
      borderColor: color.border,
      marginBottom: 16,
      shadowColor: color.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}
  >
    <Text
      style={{
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 8,
        color: color.text,
      }}
    >
      {icon} {title}
    </Text>
    <Text style={{ fontSize: 14, color: color.desc, lineHeight: 20 }}>
      {description}
    </Text>
  </View>
);

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Hero Section with Gradient */}
      <View
        style={{
          borderRadius: 28,
          overflow: "hidden",
          marginBottom: 24,
          shadowColor: "#2563eb",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        <Image
          source={{
            uri:
              "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1600&auto=format&fit=crop",
          }}
          style={{ width: "100%", height: 280 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 24,
            backgroundColor: "rgba(37,99,235,0.9)",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "900",
              color: "#fff",
              marginBottom: 10,
              textShadowColor: "rgba(0,0,0,0.4)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 6,
            }}
          >
            Saf Su, Ferahlatan İçecekler
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#fff",
              opacity: 0.95,
              lineHeight: 22,
              textShadowColor: "rgba(0,0,0,0.3)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            İhtiyacınız olan su ve içecekleri kolayca keşfedin. Uygun fiyat, hızlı teslimat ve güler yüzlü hizmet.
          </Text>
        </View>
      </View>

      {/* Category Cards */}
      <Card
        title="Su"
        subtitle="Damacana, şişe ve maden suyu seçenekleri"
        href="/water"
        image="https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=1600&auto=format&fit=crop"
        gradient={{
          start: "rgba(59,130,246,0.95)",
          end: "rgba(37,99,235,0.8)",
          border: "#3b82f6",
        }}
      />

      <Card
        title="İçecekler"
        subtitle="Gazoz, meyve suyu, soğuk çay ve daha fazlası"
        href="/beverages"
        image="https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1600&auto=format&fit=crop"
        gradient={{
          start: "rgba(236,72,153,0.95)",
          end: "rgba(219,39,119,0.8)",
          border: "#ec4899",
        }}
      />

      <Card
        title="İletişim"
        subtitle="Adres, çalışma saatleri ve WhatsApp sipariş"
        href="/about"
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop"
        gradient={{
          start: "rgba(34,197,94,0.95)",
          end: "rgba(22,163,74,0.8)",
          border: "#22c55e",
        }}
      />

      {/* Feature Cards */}
      <FeatureCard
        icon="🚚"
        title="Teslimat Bilgileri"
        description="• Aynı gün teslimat (18:00'e kadar verilen siparişlerde)\n• Minimum sipariş tutarı: 150 TL\n• Bölge: Şehir merkezi ve yakın mahalleler"
        color={{
          bg: "#eff6ff",
          border: "#bfdbfe",
          text: "#1e40af",
          desc: "#1e3a8a",
          shadow: "#3b82f6",
        }}
      />

      <FeatureCard
        icon="⭐"
        title="Neden Buzdağı Plus?"
        description="• Hızlı teslimat • Geniş ürün yelpazesi • Güvenilir hizmet • Müşteri memnuniyeti odaklı yaklaşım"
        color={{
          bg: "#fef3c7",
          border: "#fde68a",
          text: "#92400e",
          desc: "#78350f",
          shadow: "#f59e0b",
        }}
      />
    </ScrollView>
  );
}
