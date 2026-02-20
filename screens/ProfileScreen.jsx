// screens/ProfileScreen.jsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
} from "react-native";
import colors from "../theme/colors";
// 🔽 add these
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // 🔽 new local auth snapshot
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // in ProfileScreen
  const goSignIn = () => navigation.getParent()?.navigate("Login");
  const goCreateAccount = () => navigation.navigate("Register");

  // 🔽 load when screen is focused
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const load = async () => {
        try {
          const [flag, profile] = await Promise.all([
            AsyncStorage.getItem("isLoggedIn"),
            AsyncStorage.getItem("userProfile"),
          ]);
          if (!mounted) return;
          setIsLoggedIn(flag === "true");
          setUserProfile(profile ? JSON.parse(profile) : null);
        } catch (e) {
          // keep defaults
        }
      };
      load();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const firstLetter = (userProfile?.name || "Guest").trim().charAt(0).toUpperCase();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
        </View>

        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>
            {isLoggedIn && userProfile?.name ? userProfile.name : "Guest"}
          </Text>
          <Text style={styles.subtitle}>
            {isLoggedIn
              ? "You are signed in for checkout."
              : "You are browsing without an account."}
          </Text>
        </View>
      </View>

      {/* Auth callouts. hide when logged in */}
      {!isLoggedIn && (
        <View style={styles.ctaRow}>
          <Pressable
            onPress={goSignIn}
            android_ripple={{ color: colors.accent }}
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnPrimaryText}>Sign in</Text>
          </Pressable>

          <Pressable
            onPress={goCreateAccount}
            android_ripple={{ color: colors.accent }}
            style={({ pressed }) => [styles.btnOutline, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnOutlineText}>Create account</Text>
          </Pressable>
        </View>
      )}

      {/* Profile details when logged in */}
      {isLoggedIn && userProfile && (
        <Card title="Saved details">
          <Benefit text={`Name. ${userProfile.name}`} />
          <Benefit text={`Address. ${userProfile.address}`} />
          <Benefit text={`City. ${userProfile.city}`} />
          <Benefit text={`Postal code. ${userProfile.postal}`} />
        </Card>
      )}

      {isLoggedIn && (
        <Card title="Account">
          <Row
            left="🔑"
            label="Change password"
            onPress={() => navigation.navigate("ChangePassword")}
          />
        </Card>
      )}

      {/* Benefits still visible for guests */}
      {!isLoggedIn && (
        <Card title="Why create an account">
          <Benefit text="Faster checkout and saved details." />
          <Benefit text="Track orders and returns in one place." />
          <Benefit text="Wishlists and recently viewed items." />
          <Benefit text="Personalized recommendations." />
        </Card>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

/* Reusable UI */
function Card({ title, children }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      <View style={{ marginTop: 8 }}>{children}</View>
    </View>
  );
}

function Row({ left, label, right, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: colors.accent }}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
        disabled && { opacity: 0.6 },
      ]}
    >
      <Text style={styles.rowIcon}>{left}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      {right ? <Text style={styles.rowRight}>{right}</Text> : null}
    </Pressable>
  );
}

function RowSwitch({ left, label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{left}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e9e1d3", true: colors.primary }}
        thumbColor={value ? colors.primaryDark : colors.white}
      />
    </View>
  );
}

function Benefit({ text }) {
  return (
    <View style={styles.benefit}>
      <Text style={styles.benefitIcon}>✓</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

/* Styles */
const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },

  header: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: { marginRight: 12 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 64,
    backgroundColor: colors.accent,     // khaki chip
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border,         // warm brown ring
  },
  avatarText: { fontSize: 26, fontWeight: "700", color: colors.primary }, // olive text
  headerTextWrap: { flex: 1 },
  title: { fontSize: 20, color: colors.text, fontWeight: "700" },
  subtitle: { marginTop: 4, fontSize: 14, color: colors.textLight },

  ctaRow: { flexDirection: "row", gap: 12 },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.primaryDark,   // warm brown primary
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  btnPrimaryText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  btnOutline: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnOutlineText: {
    color: colors.primary, // olive
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  btnPressed: { opacity: Platform.OS === "ios" ? 0.7 : 1 },

  card: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.text },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  rowPressed: { opacity: Platform.OS === "ios" ? 0.7 : 1 },
  rowIcon: { width: 28, textAlign: "center", fontSize: 18, marginRight: 10 },
  rowLabel: { flex: 1, fontSize: 15, color: colors.text },
  rowRight: { fontSize: 13, color: colors.textLight },

  benefit: { flexDirection: "row", alignItems: "flex-start", marginTop: 6 },
  benefitIcon: { marginRight: 8, fontSize: 14, color: colors.primaryDark, lineHeight: 20 },
  benefitText: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 },

  versionWrap: { marginTop: 8, alignItems: "flex-start" },
  versionText: { fontSize: 12, color: colors.textLight },
});
