// CheckoutScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import colors from "../theme/colors";
import Screen from "../components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { items, subtotal } = useCart();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");

  const shipping = useMemo(() => (items.length ? 200.0 : 0), [items.length]);
  const taxRate = 0.08;

  const tax = useMemo(() => subtotal * taxRate, [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  const renderItem = ({ item }) => (
    <View style={s.row}>
      <Image source={{ uri: item.image }} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.title} numberOfLines={1}>{item.title}</Text>
        <Text style={s.muted}>Qty {item.qty}</Text>
      </View>
      <Text style={s.price}>${(item.price * item.qty).toFixed(2)}</Text>
    </View>
  );

  const goPayment = async () => {
    if (!items.length) {
      Alert.alert("Cart is empty", "Add some items first.");
      return;
    }
    if (!name.trim() || !address.trim() || !city.trim() || !postal.trim()) {
      Alert.alert("Missing info", "Fill in all fields.");
      return;
    }

    const shippingInfo = { name: name.trim(), address: address.trim(), city: city.trim(), postal: postal.trim() };
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(shippingInfo));
      await AsyncStorage.setItem("isLoggedIn", "true");
    } catch (e) {
      // silent persistence error; still navigate
    }

    navigation.navigate("Payment", {
      total,
      shippingInfo,
    });
  };

  // Progress setup
  const steps = ["Checkout", "Payment", "Confirmation"];
  const activeStep = 0;
  const fillPct = (activeStep / (steps.length - 1)) * 100;

  return (
    <Screen background={colors.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>


          {/* Progress line */}
          <View style={s.progressWrap}>
            <View style={s.barTrack} />
            <View style={[s.barFill, { width: `${fillPct}%` }]} />

            <View style={s.dotsRow}>
              {steps.map((label, idx) => {
                const isActive = idx === activeStep;
                const isDone = idx < activeStep;
                return (
                  <View key={label} style={s.dotWrap}>
                    <View
                      style={[
                        s.dot,
                        isDone && s.dotDone,
                        isActive && s.dotActive,
                      ]}
                    >
                      {isDone ? (
                        <MaterialCommunityIcons name="check" size={16} color={colors.white} />
                      ) : (
                        <Text style={[s.dotNum, isActive && { color: colors.white }]}>{idx + 1}</Text>
                      )}
                    </View>
                    <Text style={[s.dotLabel, isActive && { color: colors.text }]} numberOfLines={1}>
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Order summary */}
          <View style={s.card}>
            <Text style={s.sectionTitle}>Order Summary</Text>
            {items.length ? (
              <FlatList
                data={items}
                keyExtractor={(x) => x.id}
                renderItem={renderItem}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={
                  <View style={{ marginTop: 12 }}>
                    <View style={s.rowLine}>
                      <Text style={s.muted}>Subtotal</Text>
                      <Text style={s.value}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={s.rowLine}>
                      <Text style={s.muted}>Shipping</Text>
                      <Text style={s.value}>${shipping.toFixed(2)}</Text>
                    </View>
                    <View style={s.rowLine}>
                      <Text style={s.muted}>Tax</Text>
                      <Text style={s.value}>${tax.toFixed(2)}</Text>
                    </View>
                    <View style={[s.rowLine, { marginTop: 6 }]}>
                      <Text style={s.totalLabel}>Total</Text>
                      <Text style={s.totalValue}>${total.toFixed(2)}</Text>
                    </View>
                  </View>
                }
              />
            ) : (
              <Text style={s.muted}>Your cart is empty.</Text>
            )}
          </View>

          {/* Shipping info */}
          <View style={s.card}>
            <Text style={s.sectionTitle}>Shipping Information</Text>
            <View style={s.inputRow}>
              <MaterialCommunityIcons name="account-outline" size={18} color={colors.text} />
              <TextInput
                placeholder="Full name"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
                style={[s.input, s.inputFlex]}
              />
            </View>

            <View style={s.inputRow}>
              <MaterialCommunityIcons name="home-outline" size={18} color={colors.text} />
              <TextInput
                placeholder="Address"
                placeholderTextColor={colors.textLight}
                value={address}
                onChangeText={setAddress}
                style={[s.input, s.inputFlex]}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[s.inputRow, { flex: 1 }]}>
                <MaterialCommunityIcons name="city" size={18} color={colors.text} />
                <TextInput
                  placeholder="City"
                  placeholderTextColor={colors.textLight}
                  value={city}
                  onChangeText={setCity}
                  style={[s.input, s.inputFlex]}
                />
              </View>
              <View style={[s.inputRow, { width: 140 }]}>
                <MaterialCommunityIcons name="mailbox-outline" size={18} color={colors.text} />
                <TextInput
                  placeholder="Postal code"
                  placeholderTextColor={colors.textLight}
                  value={postal}
                  onChangeText={setPostal}
                  style={[s.input, s.inputFlex]}
                />
              </View>
            </View>
          </View>

          <Pressable
            style={[s.cta, { opacity: items.length ? 1 : 0.6 }]}
            disabled={!items.length}
            onPress={goPayment}
          >
            <Text style={s.ctaText}>Continue to Payment</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const cardShadow = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const s = StyleSheet.create({
  /* Local header bar (optional) */
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primaryDark, // Warm Brown
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: colors.white,
    fontWeight: "800",
    fontSize: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  header: { fontSize: 22, fontWeight: "800", color: colors.text },

  // Progress
  progressWrap: { marginTop: 10, marginBottom: 20 },
  barTrack: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border, // brown track
    opacity: 0.35,
  },
  barFill: {
    position: "absolute",
    left: 16,
    top: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary, // olive progress
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 8,
  },
  dotWrap: { alignItems: "center", width: "33.33%" },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  dotDone: { borderColor: colors.primary, backgroundColor: colors.primary },
  dotNum: { color: colors.text, fontWeight: "800", fontSize: 12 },
  dotLabel: { marginTop: 6, color: colors.text, opacity: 0.7, fontSize: 12, fontWeight: "700" },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
    ...cardShadow,
  },
  sectionTitle: { color: colors.text, fontWeight: "800", marginBottom: 10, fontSize: 16 },

  // Order rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
  },
  thumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: colors.background },
  title: { color: colors.text, fontWeight: "700" },
  muted: { color: colors.text, opacity: 0.7, marginTop: 2 },
  price: { color: colors.text, fontWeight: "700" },
  rowLine: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  value: { color: colors.text, fontWeight: "700" },
  totalLabel: { color: colors.text, fontWeight: "900" },
  totalValue: { color: colors.text, fontWeight: "900" },

  // Inputs
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  input: { color: colors.text, paddingVertical: 0 },
  inputFlex: { flex: 1 },

  // Buttons
  cta: {
    backgroundColor: colors.primaryDark, // primary action = Warm Brown
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    ...cardShadow,
  },
  ctaText: { color: colors.white, fontWeight: "800" },
  secondary: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  secondaryText: { color: colors.text, fontWeight: "700" },
});
