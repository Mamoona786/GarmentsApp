import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Pressable, ScrollView, Image, TextInput } from "react-native";
import colors from "../theme/colors";
import Screen from "../components/Screen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const heroImage = "https://i.pinimg.com/736x/31/ea/76/31ea76db35980d2288aadd8560ed7305.jpg";

export default function HomeScreen({ navigation }) {
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const { addToCart, count } = useCart();
  const { toggleWishlist, isInWishlist, count: wishlistCount } = useWishlist();

  const filtered = useMemo(() => {
    const byCat = activeCat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCat);
    if (!query.trim()) return byCat;
    const q = query.trim().toLowerCase();
    return byCat.filter(p =>
      p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [activeCat, query]);

  return (
    <Screen background={colors.background}>
      {/* Header (BROWN) */}
      <View style={styles.headerWrap}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.iconBtn}>
          <Ionicons name="menu" size={22} color={colors.primaryDark} />
        </Pressable>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.text} style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search products or categories"
            placeholderTextColor="rgba(46,46,46,0.55)"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
              <Ionicons name="close" size={16} color={colors.text} />
            </Pressable>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {/* Wishlist */}
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate("Wishlist")}>
            <Ionicons name="heart-outline" size={20} color={colors.primaryDark} />
            {wishlistCount > 0 && (
              <View style={styles.badgeDot}>
                <Text style={styles.badgeText}>{wishlistCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Cart */}
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="cart-outline" size={20} color={colors.primaryDark} />
            {count > 0 && (
              <View style={styles.badgeDot}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <ImageBackground source={{ uri: heroImage }} style={styles.hero} imageStyle={{ borderRadius: 16 }}>
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>new season styles</Text>
              <Text style={styles.heroSubtitle}>elegant. earthy. timeless</Text>
              <Pressable style={styles.cta} onPress={() => {}}>
                <Text style={styles.ctaText}>shop now</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>

        {/* Categories */}
        <View style={styles.catBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {[{ key: "all", label: "All", icon: "grid" }, ...CATEGORIES].map(c => {
              const isActive = c.key === activeCat;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setActiveCat(c.key)}
                  style={[styles.catChip, isActive && styles.catChipActive]}
                >
                  <MaterialCommunityIcons
                    name={c.icon}
                    size={18}
                    color={isActive ? colors.white : colors.text}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.catText, isActive && styles.catTextActive]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <View style={styles.grid}>
            {filtered.map(p => {
              const fav = isInWishlist(p.id);
              return (
                <View key={p.id} style={styles.card}>
                  <View>
                    <Image source={{ uri: p.image }} style={styles.cardThumb} />
                    <Pressable
                      onPress={() => toggleWishlist(p)}
                      style={styles.wishBtn}
                      hitSlop={8}
                      accessibilityLabel={fav ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Ionicons
                        name={fav ? "heart" : "heart-outline"}
                        size={18}
                        color={fav ? "#e63946" : colors.text}
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.cardTitle}>{p.title}</Text>
                  <Text style={styles.cardPrice}>${p.price}</Text>

                  <Pressable style={styles.cardBtn} onPress={() => addToCart(p, 1)}>
                    <Text style={styles.cardBtnText}>add to cart</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  /* header: BROWN with light controls */
  headerWrap: {
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: colors.primaryDark, // Warm Brown
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border, // Brown edge
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 8,
    fontSize: 14,
  },
  clearBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.white,     // light chip on brown header
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeDot: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: colors.primary,   // Olive accent on brown
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: "700" },

  /* hero */
  heroWrap: { paddingHorizontal: 16, paddingTop: 8 },
  hero: { height: 200, justifyContent: "flex-end" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accent, // khaki warmth
    opacity: 0.35,
    borderRadius: 16,
  },
  heroContent: { padding: 16 },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: "800", textTransform: "capitalize" },
  heroSubtitle: { color: colors.white, opacity: 0.9, marginTop: 4 },
  cta: {
    marginTop: 12,
    backgroundColor: colors.primary,   // Olive CTA on khaki overlay
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  ctaText: { color: colors.white, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },

  /* categories */
  catBar: {
    marginTop: 16,
    backgroundColor: colors.background, // Sand
    paddingVertical: 10,
  },
  catRow: { paddingHorizontal: 12, gap: 8 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary, // Olive outline (subtle)
  },
  catChipActive: {
    backgroundColor: colors.primaryDark, // Active = Brown (reduces green)
    borderColor: colors.primaryDark,
  },
  catText: { color: colors.text, fontWeight: "700", textTransform: "capitalize" },
  catTextActive: { color: colors.white },

  /* grid */
  section: { marginTop: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 12,
  },
  card: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border, // Brown border
  },
  cardThumb: {
    height: 120,
    backgroundColor: colors.background, // Sand placeholder
    borderRadius: 12,
    marginBottom: 8,
  },
  wishBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontWeight: "700", marginTop: 2, textTransform: "capitalize" },
  cardPrice: { color: colors.text, marginTop: 2 },
  cardBtn: {
    marginTop: 8,
    backgroundColor: colors.primaryDark, // Brown action button (balances header)
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  cardBtnText: { color: colors.white, fontWeight: "700", textTransform: "uppercase", fontSize: 12 },
});
