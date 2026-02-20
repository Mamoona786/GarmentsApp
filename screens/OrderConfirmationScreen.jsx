// OrderConfirmationScreen.js
import React, { useMemo } from "react";
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import colors from "../theme/colors";

export default function OrderConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId = "ORD000000" } = route.params || {};

  const etaText = useMemo(() => {
    const d = new Date();
    const eta = new Date(d);
    eta.setDate(d.getDate() + 5);
    return eta.toLocaleDateString();
  }, []);

  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <Screen background={colors.background}>
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {/* Hero */}
        <View style={s.hero}>
          <View style={s.iconWrap}>
            <MaterialCommunityIcons name="check-decagram" size={40} color={colors.white} />
          </View>
          <Text style={s.heroTitle}>Order confirmed</Text>
          <View style={s.orderTag}>
            <Text style={s.orderTagText}>Order {orderId}</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={s.infoCard}>
          <Text style={s.thanksText}>Thank you for your order</Text>

          <View style={s.etaRow}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={18} color={colors.primary} />
            <Text style={s.etaText}>Estimated delivery {etaText}</Text>
          </View>

          <Image
            source={require("../assets/delivery-rider.jpg")}
            style={s.image}
            resizeMode="cover"
          />
        </View>

        <Pressable style={s.cta} onPress={goToHome}>
          <Text style={s.ctaText}>Continue shopping</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const cardShadow = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

const s = StyleSheet.create({
  hero: { alignItems: "center", marginBottom: 18 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryDark, // Warm Brown
    alignItems: "center",
    justifyContent: "center",
    ...cardShadow,
  },
  heroTitle: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 22,
    marginTop: 10,
  },
  orderTag: {
    marginTop: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  orderTagText: { color: colors.text, fontWeight: "800", opacity: 0.9 },

  infoCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    ...cardShadow,
  },
  thanksText: { color: colors.text, fontWeight: "900", fontSize: 18, textAlign: "center" },
  etaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.accentLight, // light olive tone for contrast
    borderWidth: 1,
    borderColor: colors.accent,
  },
  etaText: { color: colors.text, fontWeight: "700", opacity: 0.9 },

  image: {
    width: "100%",
    height: 320,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: colors.background,
  },

  cta: {
    backgroundColor: colors.primaryDark, // Warm Brown CTA
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    ...cardShadow,
    marginBottom: 40,
  },
  ctaText: { color: colors.white, fontWeight: "900", fontSize: 16, letterSpacing: 0.3 },
});
