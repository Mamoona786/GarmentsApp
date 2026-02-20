import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./navigation/RootNavigator";
import colors from "./theme/colors";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background, // Sand
    card: colors.white,            // White card surfaces
    border: colors.border,         // Warm Brown border
    text: colors.text,             // Deep brown text
    primary: colors.primary,       // Olive Green accent
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        style="dark"
        backgroundColor={colors.background} // ensures consistent status bar color
      />
      <WishlistProvider>
        <CartProvider>
          <RootNavigator />
        </CartProvider>
      </WishlistProvider>
    </NavigationContainer>
  );
}
