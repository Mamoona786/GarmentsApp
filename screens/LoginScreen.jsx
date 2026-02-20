// screens/LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../theme/colors";
import { CommonActions } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Enter your email and password");
      return;
    }
    try {
      setBusy(true);
      // TODO connect to your auth API here
      await new Promise((r) => setTimeout(r, 700));
      // On success, replace to Main so back does not return to Login
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("Sign in failed", "Check your details and try again");
    } finally {
      setBusy(false);
    }
  };

  // in LoginScreen.jsx
  const goSignUp = () => navigation.navigate("Register");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }} // Sand
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.wrap}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to access your profile and orders</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.textLight}
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Your password"
            placeholderTextColor={colors.textLight}
            style={styles.input}
          />

          <TouchableOpacity onPress={() => Alert.alert("Forgot password", "Hook up reset flow")}>
            <Text style={styles.forgot}>Forgot password</Text>
          </TouchableOpacity>

          <Pressable
            onPress={onSignIn}
            disabled={busy}
            android_ripple={{ color: colors.accent }}
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed, busy && { opacity: 0.7 }]}
          >
            <Text style={styles.btnPrimaryText}>{busy ? "Signing in..." : "Sign in"}</Text>
          </Pressable>

          <Pressable
            onPress={goSignUp}
            android_ripple={{ color: colors.accent }}
            style={({ pressed }) => [styles.btnOutline, pressed && styles.pressed]}
          >
            <Text style={styles.btnOutlineText}>Create account</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: { marginTop: 6, fontSize: 14, color: colors.accent, textAlign: "center" }, // khaki warmth
  card: {
    marginTop: 16,
    backgroundColor: colors.white,              // surface -> white
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,                 // warm brown edge
    padding: 16,
  },
  label: { color: colors.text, fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: colors.white,              // inputs on white
    borderWidth: 1,
    borderColor: colors.border,                 // brown border
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
  },
  forgot: { color: colors.primary, marginTop: 8, textAlign: "right", fontWeight: "600" }, // subtle olive link
  btnPrimary: {
    marginTop: 14,
    backgroundColor: colors.primaryDark,        // primary action = Warm Brown
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
  btnPrimaryText: { color: colors.white, fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },
  btnOutline: {
    marginTop: 10,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnOutlineText: { color: colors.primary, fontWeight: "800", fontSize: 16, letterSpacing: 0.3 }, // olive accent
  guest: { color: colors.primary, fontWeight: "700" },
  pressed: { opacity: Platform.OS === "ios" ? 0.7 : 1 },
});
