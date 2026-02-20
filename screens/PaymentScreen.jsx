// PaymentScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import colors from "../theme/colors";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TAX_RATE = 0.08;
const FLAT_SHIPPING = 5.99;

// shared card icon for option and input
const CARD_ICON = "credit-card-outline";

function onlyDigits(s) {
  return s.replace(/\D/g, "");
}

function formatCardNumber(s) {
  // exactly 16 digits formatted as xxxx xxxx xxxx xxxx
  const d = onlyDigits(s).slice(0, 16);
  const parts = d.match(/.{1,4}/g) || [];
  return parts.join(" ");
}

function validExpiryFuture(v) {
  // must be strictly after current month
  const m = v.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mm = parseInt(m[1], 10);
  const yy = parseInt(m[2], 10);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;
  if (yy < curYY) return false;
  if (yy === curYY && mm <= curMM) return false; // strictly future
  return true;
}

// accepts number or numeric string like "123.45" or "$123.45"
function parseMoneyLike(v) {
  if (v == null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const cleaned = String(v).replace(/[^\d.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { items, subtotal, removeFromCart } = useCart();

  // from CheckoutScreen
  const shippingInfo = route?.params?.shippingInfo || null;
  const rawTotalParam = route?.params?.total ?? route?.params?.amounts?.total;
  const totalFromParams = useMemo(() => parseMoneyLike(rawTotalParam), [rawTotalParam]);

  // local fallback
  const computedShipping = items.length ? FLAT_SHIPPING : 0;
  const computedTax = subtotal * TAX_RATE;
  const computedTotal = subtotal + computedShipping + computedTax;

  // prefer Checkout total
  const total = useMemo(
    () => (totalFromParams != null ? totalFromParams : computedTotal),
    [totalFromParams, computedTotal]
  );

  const [method, setMethod] = useState("cod");
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const cardDigits = onlyDigits(card);

  const isCardOk = cardDigits.length === 16;
  const isExpiryOk = validExpiryFuture(expiry);
  const isCvcOk = /^\d{3}$/.test(cvc);

  const canPayByCard = isCardOk && isExpiryOk && isCvcOk;
  const canPlaceCod = items.length > 0;
  const canPay = method === "card" ? canPayByCard : canPlaceCod;

  // Progress step 2 active
  const steps = ["Checkout", "Payment", "Confirmation"];
  const activeStep = 1;
  const fillPct = (activeStep / (steps.length - 1)) * 100;

  const onPay = () => {
    if (!canPay) {
      Alert.alert("Check your details", "Please fill all required fields.");
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      const snapshot = items.map(it => ({
        id: it.id,
        title: it.title,
        qty: it.qty,
        price: it.price,
        image: it.image,
      }));
      const orderId = "ORD" + Date.now().toString().slice(-6);
      const payload = {
        orderId,
        items: snapshot,
        amounts: {
          subtotal,
          shipping: computedShipping,
          tax: computedTax,
          total, // keeps Checkout total when provided
        },
        shippingInfo,
        payment:
          method === "card"
            ? { method: "card", name, last4: cardDigits.slice(-4), cardBrand: CARD_ICON }
            : { method: "cod" },
      };
      items.forEach(it => removeFromCart(it.id));
      setIsPaying(false);
      navigation.navigate("OrderConfirmation", payload);
    }, 800);
  };

  const onExpiryChange = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) setExpiry(d);
    else setExpiry(d.slice(0, 2) + "/" + d.slice(2));
  };

  return (
    <Screen background={colors.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.header}>Payment</Text>

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
                    <View style={[s.dot, isDone && s.dotDone, isActive && s.dotActive]}>
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

          {/* Shipping details */}
          <View style={s.cardWrap}>
            <Text style={s.sectionTitle}>Shipping Details</Text>
            {shippingInfo ? (
              <View style={{ gap: 4 }}>
                <Text style={s.shipLine}>{shippingInfo.name}</Text>
                <Text style={s.shipLine}>{shippingInfo.address}</Text>
                <Text style={s.shipLine}>
                  {shippingInfo.city}{shippingInfo.postal ? `, ${shippingInfo.postal}` : ""}
                </Text>
              </View>
            ) : (
              <Text style={s.muted}>No shipping details found.</Text>
            )}
          </View>

          {/* Payment method */}
          <View style={s.cardWrap}>
            <Text style={s.sectionTitle}>Payment method</Text>

            <View style={s.methodCol}>
              <Pressable
                onPress={() => setMethod("cod")}
                style={[s.methodBtn, method === "cod" && s.methodBtnActive]}
              >
                <MaterialCommunityIcons
                  name="cash"
                  size={20}
                  color={colors.text}
                  style={{ marginRight: 8 }}
                />
                <Text style={s.methodText}>Cash on delivery</Text>
                {method === "cod" && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </Pressable>

              <Pressable
                onPress={() => setMethod("card")}
                style={[s.methodBtn, method === "card" && s.methodBtnActive]}
              >
                <MaterialCommunityIcons
                  name={CARD_ICON}
                  size={20}
                  color={colors.text}
                  style={{ marginRight: 8 }}
                />
                <Text style={s.methodText}>Card</Text>
                {method === "card" && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color={colors.primary}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </Pressable>
            </View>

            {method === "cod" && (
              <Text style={[s.muted, { marginTop: 10 }]}>
                Pay in cash when your order arrives. No extra fees at the door.
              </Text>
            )}
          </View>

          {/* Card details */}
          {method === "card" && (
            <View style={s.cardWrap}>
              <Text style={s.sectionTitle}>Card details</Text>

              <Text style={s.label}>Name on card</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="John Smith"
                placeholderTextColor={colors.textLight}
                style={s.input}
                autoCapitalize="words"
              />

              <Text style={s.label}>Card number</Text>
              <View style={s.rowInput}>
                {/* same icon as the card option */}
                <MaterialCommunityIcons name={CARD_ICON} size={22} color={colors.text} />
                <TextInput
                  value={card}
                  onChangeText={(t) => setCard(formatCardNumber(t))}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.textLight}
                  style={[s.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Expiry</Text>
                  <TextInput
                    value={expiry}
                    onChangeText={onExpiryChange}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textLight}
                    style={s.input}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                <View style={{ width: 120 }}>
                  <Text style={s.label}>CVC</Text>
                  <TextInput
                    value={cvc}
                    onChangeText={(t) => setCvc(onlyDigits(t).slice(0, 3))}
                    placeholder="123"
                    placeholderTextColor={colors.textLight}
                    style={s.input}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={s.summary}>
            <Text style={s.summaryLabel}>Amount to pay</Text>
            <Text style={s.summaryValue}>${total.toFixed(2)}</Text>
          </View>

          <Pressable
            style={[s.cta, { opacity: canPay && !isPaying ? 1 : 0.6 }]}
            disabled={!canPay || isPaying}
            onPress={onPay}
          >
            {isPaying ? <ActivityIndicator /> : <Text style={s.ctaText}>Place order</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 },

  // Progress
  progressWrap: { marginTop: 0, marginBottom: 16 },
  barTrack: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border, // warm brown track
    opacity: 0.35,
  },
  barFill: {
    position: "absolute",
    left: 16,
    top: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary, // olive fill
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

  sectionTitle: { color: colors.text, fontWeight: "700", marginBottom: 10 },

  // Cards / containers
  cardWrap: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },

  // Method buttons
  methodBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  methodBtnActive: {
    borderColor: colors.primary, // olive accent on active
  },
  methodText: { color: colors.text, fontWeight: "700" },
  methodCol: { gap: 10 },

  muted: { color: colors.text, opacity: 0.7 },
  label: { color: colors.text, marginBottom: 6, fontWeight: "700" },

  // Inputs
  input: {
    backgroundColor: colors.white,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },

  // Summary
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  summaryLabel: { color: colors.text, fontWeight: "700" },
  summaryValue: { color: colors.text, fontWeight: "800" },

  // CTA
  cta: {
    backgroundColor: colors.primaryDark, // Warm Brown primary action
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 60,
  },
  ctaText: { color: colors.white, fontWeight: "800" },

  // shipping preview
  shipLine: { color: colors.text, fontWeight: "700" },
});
