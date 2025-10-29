import { Linking, ScrollView, Text, View, Pressable } from "react-native";

const InfoCard = ({ title, value, icon, onPress, style }) => (
  <Pressable
    onPress={onPress}
    style={{
      borderRadius: 20,
      padding: 18,
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: style?.border || "#e5e7eb",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 28, marginRight: 12 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: "600" }}>
          {title}
        </Text>
        <Text style={{ fontSize: 16, color: "#1e293b", fontWeight: "700" }}>
          {value}
        </Text>
      </View>
    </View>
  </Pressable>
);

const ActionButton = ({ icon, title, subtitle, onPress, color }) => (
  <Pressable
    onPress={onPress}
    style={{
      borderRadius: 20,
      padding: 20,
      backgroundColor: color.bg,
      borderWidth: 2,
      borderColor: color.border,
      marginBottom: 16,
      shadowColor: color.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 32, marginRight: 16 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: color.text,
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: color.subtext, opacity: 0.9 }}>
          {subtitle}
        </Text>
      </View>
      <Text style={{ fontSize: 24, color: color.text }}>→</Text>
    </View>
  </Pressable>
);

export default function AboutScreen() {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Hero Section */}
      <View
        style={{
          borderRadius: 24,
          padding: 24,
          backgroundColor: "#fff",
          borderWidth: 2,
          borderColor: "#e0f2fe",
          marginBottom: 24,
          shadowColor: "#22c55e",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "900", color: "#1e40af", marginBottom: 8 }}>
          İletişim
        </Text>
        <Text style={{ fontSize: 16, color: "#64748b", lineHeight: 24 }}>
          Su ve içecek siparişleriniz için bize ulaşın. Hızlı teslimat ve güvenilir hizmet sunuyoruz.
        </Text>
      </View>

      {/* Action Buttons */}
      <ActionButton
        icon="💬"
        title="WhatsApp ile Sipariş"
        subtitle="Hemen sipariş verin, hızlı yanıt alın"
        onPress={() => Linking.openURL("https://wa.me/900000000000")}
        color={{
          bg: "#dcfce7",
          border: "#86efac",
          text: "#166534",
          subtext: "#15803d",
          shadow: "#22c55e",
        }}
      />

      <ActionButton
        icon="📞"
        title="Telefon ile Ara"
        subtitle="Direkt görüşme için bizi arayın"
        onPress={() => Linking.openURL("tel:+900000000000")}
        color={{
          bg: "#dbeafe",
          border: "#93c5fd",
          text: "#1e40af",
          subtext: "#1e3a8a",
          shadow: "#3b82f6",
        }}
      />

      {/* Info Cards */}
      <View style={{ marginTop: 8 }}>
        <InfoCard
          icon="📍"
          title="ADRES"
          value="Örnek Mah., Örnek Cad. No:123, Şehir / Ülke"
          style={{ border: "#fef3c7" }}
        />

        <InfoCard
          icon="🕐"
          title="ÇALIŞMA SAATLERİ"
          value="Pazartesi - Cumartesi: 09:00 - 20:00\nPazar: 10:00 - 18:00"
          style={{ border: "#fce7f3" }}
        />

        <InfoCard
          icon="📧"
          title="E-POSTA"
          value="destek@buzdagi.plus"
          onPress={() => Linking.openURL("mailto:destek@buzdagi.plus")}
          style={{ border: "#e0f2fe" }}
        />

        <InfoCard
          icon="📱"
          title="SOSYAL MEDYA"
          value="Instagram"
          onPress={() => Linking.openURL("https://instagram.com/")}
          style={{ border: "#f5d0fe" }}
        />
      </View>
    </ScrollView>
  );
}
