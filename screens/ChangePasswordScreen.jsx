import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../theme/colors";

export default function ChangePasswordScreen({ navigation }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        if (isLoggedIn !== "true") {
          Alert.alert("Sign in required", "Please sign in to continue", [
            { text: "OK", onPress: () => navigation.getParent()?.navigate("Login") },
          ]);
        }
      };
      checkAuth();
    }, [navigation])
  );

  const validate = () => {
    if (!current.trim() || !next.trim() || !confirm.trim()) {
      Alert.alert("Missing info", "Fill in all fields");
      return false;
    }
    if (next.length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters");
      return false;
    }
    if (!/[A-Za-z]/.test(next) || !/[0-9]/.test(next)) {
      Alert.alert("Weak password", "Include letters and numbers");
      return false;
    }
    if (next !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match");
      return false;
    }
    if (current === next) {
      Alert.alert("No change", "New password must be different");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      // await api.changePassword({ current, next });
      Alert.alert("Success", "Your password has been updated", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not update password. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }} // Sand background
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.container}>
        <View style={s.card}>
          <Text style={s.title}>Change password</Text>
          <Text style={s.subtitle}>Enter your current password then set a new one</Text>

          <View style={s.inputRow}>
            <TextInput
              value={current}
              onChangeText={setCurrent}
              placeholder="Current password"
              placeholderTextColor={colors.textLight}
              secureTextEntry
              style={s.input}
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={s.inputRow}>
            <TextInput
              value={next}
              onChangeText={setNext}
              placeholder="New password"
              placeholderTextColor={colors.textLight}
              secureTextEntry
              style={s.input}
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={s.inputRow}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textLight}
              secureTextEntry
              style={s.input}
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          <Pressable disabled={loading} style={[s.cta, loading && { opacity: 0.6 }]} onPress={onSubmit}>
            <Text style={s.ctaText}>{loading ? "Saving..." : "Update password"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  // centers content vertically and horizontally, while remaining scrollable on small screens
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  // fixed max width for a clean centered card
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,        // warm brown border
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.text },
  subtitle: { marginTop: 6, color: colors.accent, marginBottom: 8 }, // warm khaki hint

  // comfortable spacing between fields
  inputRow: {
    marginTop: 14,
    backgroundColor: colors.white,     // inputs on white with brown border
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: { color: colors.text, paddingVertical: 0 },

  // roomy primary action
  cta: {
    marginTop: 20,
    backgroundColor: colors.primaryDark, // primary action = Warm Brown
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: { color: colors.white, fontWeight: "800" },
});
