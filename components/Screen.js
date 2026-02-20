import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Screen({ children, background = colors.bg }) {
  return <View style={[styles.root, { backgroundColor: background }]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
