import { Linking, ScrollView, Text, View, Pressable, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isMobile = width < 768;
const isSmallMobile = width < 400;

const InfoCard = ({ title, value, icon, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      borderRadius: isMobile ? 10 : 12,
      padding: isMobile ? (isSmallMobile ? 12 : 14) : 16,
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      marginBottom: isMobile ? 10 : 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ 
        fontSize: isMobile ? (isSmallMobile ? 18 : 19) : 20, 
        marginRight: isMobile ? 10 : 12 
      }}>
        {icon}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 11 : 11) : 12, 
          color: "#6b7280", 
          marginBottom: isMobile ? 3 : 4, 
          fontWeight: "500" 
        }}>
          {title}
        </Text>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 13 : 14) : 15, 
          color: "#111827", 
          fontWeight: "600" 
        }}>
          {value}
        </Text>
      </View>
    </View>
  </Pressable>
);

const ActionButton = ({ icon, title, subtitle, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      borderRadius: isMobile ? 10 : 12,
      padding: isMobile ? (isSmallMobile ? 14 : 16) : 18,
      backgroundColor: "#111827",
      marginBottom: isMobile ? 10 : 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ 
        fontSize: isMobile ? (isSmallMobile ? 20 : 22) : 24, 
        marginRight: isMobile ? 10 : 12 
      }}>
        {icon}
      </Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: isMobile ? (isSmallMobile ? 14 : 15) : 16,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: isMobile ? 3 : 4,
          }}
        >
          {title}
        </Text>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 11 : 12) : 13, 
          color: "#d1d5db" 
        }}>
          {subtitle}
        </Text>
      </View>
      <Text style={{ 
        fontSize: isMobile ? (isSmallMobile ? 18 : 19) : 20, 
        color: "#ffffff" 
      }}>
        →
      </Text>
    </View>
  </Pressable>
);

export default function AboutScreen() {
  return (
    <ScrollView
      contentContainerStyle={{ 
        padding: isMobile ? (isSmallMobile ? 12 : 16) : 20, 
        paddingBottom: isMobile ? 32 : 40 
      }}
      style={{ backgroundColor: "#f9fafb" }}
    >
      {/* Header Section */}
      <View
        style={{
          borderRadius: isMobile ? 10 : 12,
          padding: isMobile ? (isSmallMobile ? 18 : 20) : 24,
          backgroundColor: "#ffffff",
          borderWidth: 1,
          borderColor: "#e5e7eb",
          marginBottom: isMobile ? 20 : 24,
        }}
      >
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 20 : 22) : 24, 
          fontWeight: "700", 
          color: "#111827", 
          marginBottom: isMobile ? 10 : 12 
        }}>
          İletişim
        </Text>
        <Text style={{ 
          fontSize: isMobile ? (isSmallMobile ? 13 : 14) : 15, 
          color: "#6b7280", 
          lineHeight: isMobile ? 20 : 22 
        }}>
          Su ve içecek siparişleriniz için bize ulaşın. Hızlı teslimat ve güvenilir hizmet sunuyoruz.
        </Text>
      </View>

      {/* Action Buttons */}
      <ActionButton
        icon="💬"
        title="WhatsApp ile Sipariş"
        subtitle="Hemen sipariş verin, hızlı yanıt alın"
        onPress={() => Linking.openURL("https://wa.me/900000000000")}
      />

      <ActionButton
        icon="📞"
        title="Telefon ile Ara"
        subtitle="Direkt görüşme için bizi arayın"
        onPress={() => Linking.openURL("tel:+900000000000")}
      />

      {/* Info Cards */}
      <View style={{ marginTop: 8 }}>
        <InfoCard
          icon="📍"
          title="ADRES"
          value="Örnek Mah., Örnek Cad. No:123, Şehir / Ülke"
        />

        <InfoCard
          icon="🕐"
          title="ÇALIŞMA SAATLERİ"
          value="Pazartesi - Cumartesi: 09:00 - 20:00\nPazar: 10:00 - 18:00"
        />

        <InfoCard
          icon="📧"
          title="E-POSTA"
          value="destek@buzdagi.plus"
          onPress={() => Linking.openURL("mailto:destek@buzdagi.plus")}
        />

        <InfoCard
          icon="📱"
          title="SOSYAL MEDYA"
          value="Instagram"
          onPress={() => Linking.openURL("https://instagram.com/")}
        />
      </View>
    </ScrollView>
  );
}
