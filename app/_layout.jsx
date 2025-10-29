import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable, Linking } from "react-native";

function BrandTitle() {
  return (
    <View style={{ flexDirection: "column" }}>
      <Text style={{ fontSize: 18, fontWeight: "900", color: "#0c6cf2" }}>Buzdağı Plus</Text>
      <Text style={{ fontSize: 11, color: "#64748b", marginTop: -2 }}>Su & İçecek Teslimatı</Text>
    </View>
  );
}

function HeaderActions() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Pressable
        onPress={() => Linking.openURL("https://wa.me/900000000000")}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 12,
          backgroundColor: "#22c55e",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>WhatsApp</Text>
      </Pressable>
      <Pressable
        onPress={() => Linking.openURL("tel:+900000000000")}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 12,
          backgroundColor: "#0c6cf2",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>Ara</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
            borderBottomColor: "#e5ecf6",
            borderBottomWidth: 2,
          },
          headerTitleStyle: { fontWeight: "700" },
          headerTintColor: "#0c6cf2",
          headerShadowVisible: false,
          headerTitle: () => <BrandTitle />,
          headerRight: () => <HeaderActions />,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Buzdağı Plus" }} />
        <Stack.Screen name="water" options={{ title: "Su" }} />
        <Stack.Screen name="beverages" options={{ title: "İçecekler" }} />
        <Stack.Screen name="about" options={{ title: "Hakkımızda" }} />
      </Stack>
    </View>
  );
}


