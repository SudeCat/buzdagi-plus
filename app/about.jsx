import { Linking, ScrollView, Text, View, Pressable } from "react-native";

const InfoCard = ({ title, value, icon, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      borderRadius: 12,
      padding: 16,
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4, fontWeight: "500" }}>
          {title}
        </Text>
        <Text style={{ fontSize: 15, color: "#111827", fontWeight: "600" }}>
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
      borderRadius: 12,
      padding: 18,
      backgroundColor: "#111827",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginRight: 12 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: "#d1d5db" }}>
          {subtitle}
        </Text>
      </View>
      <Text style={{ fontSize: 20, color: "#ffffff" }}>→</Text>
    </View>
  </Pressable>
);

export default function AboutScreen() {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      style={{ backgroundColor: "#f9fafb" }}
    >
      {/* Header Section */}
      <View
        style={{
          borderRadius: 12,
          padding: 24,
          backgroundColor: "#ffffff",
          borderWidth: 1,
          borderColor: "#e5e7eb",
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 12 }}>
          İletişim
        </Text>
        <Text style={{ fontSize: 15, color: "#6b7280", lineHeight: 22 }}>
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
