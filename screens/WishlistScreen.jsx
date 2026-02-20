// screens/WishlistScreen.jsx
import React from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function WishlistScreen({ navigation }) {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const totalItems = items.length;

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.thumb} />
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          <Pressable style={styles.addBtn} onPress={() => addToCart(item, 1)}>
            <Text style={styles.addBtnText}>add to cart</Text>
          </Pressable>
          <Pressable
            style={styles.removeBtn}
            onPress={() => removeFromWishlist(item.id)}
            accessibilityLabel="Remove from wishlist"
          >
            <Ionicons name="trash-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (totalItems === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Ionicons name="heart-outline" size={48} color={colors.text} />
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.emptySubtitle}>Save items you love and find them here</Text>
        <Pressable style={styles.shopBtn} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.shopBtnText}>shop now</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <Pressable onPress={clearWishlist} style={styles.clearAllBtn}>
          <Ionicons name="trash-outline" size={16} color={colors.white} />
          <Text style={styles.clearAllText}>clear all</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 12 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 14,
    paddingBottom: 6,
  },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryDark, // Warm Brown
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  clearAllText: { color: colors.white, fontWeight: "700", textTransform: "capitalize", fontSize: 12 },

  row: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border, // Warm Brown outline
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: colors.background, // Sand placeholder
    marginRight: 10,
  },
  title: { color: colors.text, fontWeight: "700", textTransform: "capitalize" },
  price: { color: colors.text, marginTop: 2 },

  addBtn: {
    backgroundColor: colors.primaryDark, // primary action = Warm Brown
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addBtnText: { color: colors.white, fontWeight: "700", textTransform: "uppercase", fontSize: 12 },

  removeBtn: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  sep: { height: 12 },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  emptyTitle: { marginTop: 12, color: colors.text, fontWeight: "800", fontSize: 18 },
  emptySubtitle: { color: colors.text, opacity: 0.7, marginTop: 4, textAlign: "center" },
  shopBtn: {
    marginTop: 16,
    backgroundColor: colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  shopBtnText: { color: colors.white, fontWeight: "700", textTransform: "uppercase", fontSize: 12 },
});
