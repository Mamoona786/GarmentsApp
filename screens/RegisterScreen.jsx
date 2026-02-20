// screens/RegisterScreen.jsx
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
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { CommonActions } from "@react-navigation/native";

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  const onRegister = async () => {
    if (!firstName.trim() || !email.trim() || !password) {
      Alert.alert("Missing info", "Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Use at least 6 characters");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Passwords do not match", "Check and try again");
      return;
    }
    if (!accepted) {
      Alert.alert("Terms not accepted", "Please accept the terms to continue");
      return;
    }

    try {
      setBusy(true);
      // TODO: connect to your sign up API here
      await new Promise((r) => setTimeout(r, 800));
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("Sign up failed", "Please try again");
    } finally {
      setBusy(false);
    }
  };

  // RegisterScreen.jsx
  const goLogin = () => navigation.navigate("Login");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }} // Sand
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.wrap}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>It only takes a minute</Text>

        <View style={styles.card}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
            placeholderTextColor={colors.textLight}
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
            placeholderTextColor={colors.textLight}
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
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
          <View style={styles.inputWithIcon}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPwd}
              placeholder="Minimum 6 characters"
              placeholderTextColor={colors.textLight}
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TouchableOpacity onPress={() => setShowPwd((v) => !v)}>
              <Ionicons
                name={showPwd ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.primaryDark} // warm brown icon
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Confirm password</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showConfirm}
              placeholder="Re enter password"
              placeholderTextColor={colors.textLight}
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.primaryDark}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setAccepted((v) => !v)}
            style={styles.termsRow}
            activeOpacity={0.8}
          >
            <Ionicons
              name={accepted ? "checkbox-outline" : "square-outline"}
              size={22}
              color={accepted ? colors.primary : colors.primaryDark} // olive when checked
            />
            <Text style={styles.termsText}>
              I agree to the Terms of use and Privacy policy
            </Text>
          </TouchableOpacity>

          <Pressable
            onPress={onRegister}
            disabled={busy}
            android_ripple={{ color: colors.accent }}
            style={({ pressed }) => [
              styles.btnPrimary,
              pressed && styles.pressed,
              busy && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.btnPrimaryText}>
              {busy ? "Creating account..." : "Create account"}
            </Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={{ color: colors.textLight }}>Already have an account</Text>
            <Pressable
              onPress={goLogin}
              android_ripple={{ color: colors.accent }}
              hitSlop={8}
              accessibilityRole="button"
              style={({ pressed }) => [{ paddingHorizontal: 4, borderRadius: 6 }, pressed && styles.pressed]}
            >
              <Text style={styles.link}>Sign in</Text>
            </Pressable>
          </View>
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
    borderColor: colors.border,                 // warm brown outline
    padding: 16,
  },
  label: { color: colors.text, fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  termsText: {
    marginLeft: 8,
    color: colors.text,
    flex: 1,
  },
  btnPrimary: {
    marginTop: 16,
    backgroundColor: colors.primaryDark,        // Warm Brown primary action
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
  footerRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  link: { color: colors.primary, fontWeight: "800", marginLeft: 6 }, // olive link
  pressed: { opacity: Platform.OS === "ios" ? 0.7 : 1 },
});
