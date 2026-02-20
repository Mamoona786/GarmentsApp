// screens/SettingsScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";

// helper to navigate safely whether the target is in this stack or a parent
function navigateTo(navigation, name) {
  const state = navigation.getState?.();
  if (state?.routeNames?.includes?.(name)) {
    navigation.navigate(name);
    return;
  }
  const parent = navigation.getParent?.();
  if (parent?.getState?.()?.routeNames?.includes?.(name)) {
    parent.navigate(name);
    return;
  }
  // fallback
  navigation.navigate(name);
}

export default function SettingsScreen({ navigation }) {
  // replace with your real settings and user state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {
      Alert.alert("Could not open link", "Please try again");
    }
  };

  const signOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => navigation.replace("Login") },
    ]);
  };

  const deleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This action cannot be undone. Type DELETE to confirm",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "DELETE",
          style: "destructive",
          onPress: () => Alert.alert("Request queued", "We will handle this shortly"),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Account */}
      <Card title="Account">
        <Row
          icon="person-circle-outline"
          label="Profile"
          right="Edit"
          onPress={() => navigateTo(navigation, "Profile")}
        />
        <Row
          icon="location-outline"
          label="Addresses"
          right="Manage"
          onPress={() => navigateTo(navigation, "Addresses")}
        />
        <Row
          icon="card-outline"
          label="Payment methods"
          right="Manage"
          onPress={() => navigateTo(navigation, "Payments")}
        />
      </Card>

      {/* Notifications */}
      <Card title="Notifications">
        <RowSwitch
          icon="notifications-outline"
          label="Push notifications"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <RowSwitch
          icon="mail-outline"
          label="Order updates by email"
          value={emailUpdatesEnabled}
          onValueChange={setEmailUpdatesEnabled}
        />
      </Card>

      {/* Preferences */}
      <Card title="Preferences">
        <RowSwitch
          icon="moon-outline"
          label="Dark mode"
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
        />
        <Row
          icon="globe-outline"
          label="Language"
          right="English"
          onPress={() => Alert.alert("Language", "Hook this to your language picker")}
        />
        <RowSwitch
          icon="trending-up-outline"
          label="Share analytics and crash reports"
          value={analyticsEnabled}
          onValueChange={setAnalyticsEnabled}
        />
      </Card>

      {/* Support and legal */}
      <Card title="Support">
        <Row
          icon="help-circle-outline"
          label="Help center"
          onPress={() => openLink("https://example.com/help")}
        />
        <Row
          icon="chatbubbles-outline"
          label="Contact support"
          onPress={() => openLink("mailto:support@example.com")}
        />
      </Card>

      <Card title="Legal">
        <Row
          icon="document-text-outline"
          label="Terms of use"
          onPress={() => openLink("https://example.com/terms")}
        />
        <Row
          icon="shield-checkmark-outline"
          label="Privacy policy"
          onPress={() => openLink("https://example.com/privacy")}
        />
      </Card>

      {/* Danger/Account actions */}
      <View style={styles.ctaRow}>
        <Pressable
          onPress={signOut}
          android_ripple={{ color: colors.accent }}
          style={({ pressed }) => [styles.btnOutline, pressed && styles.pressed]}
        >
          <Text style={styles.btnOutlineText}>Sign out</Text>
        </Pressable>

        <Pressable
          onPress={deleteAccount}
          android_ripple={{ color: "#ffd7d7" }}
          style={({ pressed }) => [styles.btnDanger, pressed && styles.pressed]}
        >
          <Text style={styles.btnDangerText}>Delete account</Text>
        </Pressable>
      </View>

      <View style={styles.versionWrap}>
        <Text style={styles.versionText}>App v1.0.0</Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

/* Reusable UI */
function Card({ title, children }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      <View style={{ marginTop: title ? 8 : 0 }}>{children}</View>
    </View>
  );
}

function Row({ icon, label, right, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: colors.accent }}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed, disabled && { opacity: 0.6 }]}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={20} color={colors.primaryDark} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      {right ? <Text style={styles.rowRight}>{right}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.primary} />
    </Pressable>
  );
}

function RowSwitch({ icon, label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.primaryDark} style={styles.rowIcon} />
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

/* Styles */
const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },

  card: {
    backgroundColor: colors.white,
    borderRadius: CARD_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border, // warm brown outline
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowPressed: { opacity: Platform.OS === "ios" ? 0.7 : 1 },
  rowIcon: { width: 28, textAlign: "center", marginRight: 10 },
  rowLabel: { flex: 1, fontSize: 15, color: colors.text },
  rowRight: { fontSize: 13, color: colors.textLight, marginRight: 6 },

  ctaRow: { flexDirection: "row", gap: 12, marginTop: 12 },

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
  btnOutlineText: { color: colors.primary, fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },

  btnDanger: {
    flex: 1,
    backgroundColor: "#fde9ea", // soft red fill
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f6c8cd",
  },
  btnDangerText: { color: colors.danger, fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },

  pressed: { opacity: Platform.OS === "ios" ? 0.7 : 1 },

  versionWrap: { alignItems: "flex-start", marginTop: 8 },
  versionText: { fontSize: 12, color: colors.textLight },
});
