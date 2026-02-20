// CartScreen.js
import React from "react";
import { View, Text, Image, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import colors from "../theme/colors";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CartScreen() {
  const navigation = useNavigation();
  const { items, inc, dec, removeFromCart, subtotal } = useCart();

  const renderItem = ({ item }) => (
    <View style={s.row}>
      <Image source={{ uri: item.image }} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.price}>${item.price}</Text>
        <View style={s.qtyRow}>
          <Pressable onPress={() => dec(item.id)} style={s.qtyBtn}>
            <MaterialCommunityIcons name="minus" size={18} color={colors.primaryDark} />
          </Pressable>
          <Text style={s.qtyText}>{item.qty}</Text>
          <Pressable onPress={() => inc(item.id)} style={s.qtyBtn}>
            <MaterialCommunityIcons name="plus" size={18} color={colors.primaryDark} />
          </Pressable>
        </View>
      </View>
      <Pressable onPress={() => removeFromCart(item.id)} style={s.trashBtn}>
        <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.text} />
      </Pressable>
    </View>
  );

  return (
    <Screen background={colors.background}>
      <View style={{ flex: 1 }}>
        {items.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(x) => x.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          />
        )}
        <View style={s.footer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={s.subLabel}>Subtotal</Text>
            <Text style={s.subValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <Pressable
            style={[s.cta, { opacity: items.length ? 1 : 0.5 }]}
            disabled={items.length === 0}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={s.ctaText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,         // warm brown edge
    alignItems: "center",
    gap: 12,
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: colors.background, // sand placeholder
  },
  title: { color: colors.text, fontWeight: "700" },
  price: { color: colors.text, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,         // subtle olive/brown cue
  },
  qtyText: { marginHorizontal: 10, color: colors.text, fontWeight: "700" },
  trashBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.text },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 40,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.border,         // warm brown top rule
    padding: 16,
  },
  subLabel: { color: colors.text },
  subValue: { color: colors.text, fontWeight: "800" },
  cta: {
    backgroundColor: colors.primaryDark, // PRIMARY ACTION = Warm Brown
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: colors.white, fontWeight: "800" },
});
