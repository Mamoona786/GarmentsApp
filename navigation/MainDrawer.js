// navigation/MainDrawer.js
import React from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WishlistScreen from "../screens/WishlistScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import PaymentScreen from "../screens/PaymentScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import colors from "../theme/colors";

const Drawer = createDrawerNavigator();

// Drawer background = Warm Brown
const DRAWER_BG = colors.primaryDark;

/* One centered row with fixed icon and label columns */
function CenterRow({ label, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.centerRow}>
      <View style={styles.rowInner}>
        <View style={styles.iconCol}>{icon}</View>
        <Text style={styles.labelCol} numberOfLines={1}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function BackBtn({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
      <Ionicons name="chevron-back" size={24} color={colors.white} />
    </TouchableOpacity>
  );
}

function AppDrawerContent(props) {
  const go = (name) => props.navigation.navigate(name);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: DRAWER_BG, paddingTop: 0 }}
      style={{ backgroundColor: DRAWER_BG }}
    >
      <View style={{ height: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0 }} />

      {/* Logo section */}
      <View style={{ height: 24 }} />
      <View style={styles.logoWrap}>
        <View style={styles.logoCircle}>
          <Image
            source={{ uri: "https://i.pinimg.com/1200x/66/93/26/6693262c490a6703429f8a67c0badd0f.jpg" }}
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.storeTitle}>Garments Store</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Menu with fixed columns */}
      <View style={styles.menuWrap}>
        <CenterRow
          label="Home"
          onPress={() => go("Home")}
          icon={<MaterialCommunityIcons name="home-variant-outline" size={26} color={colors.white} />}
        />
        <CenterRow
          label="My Profile"
          onPress={() => go("Profile")}
          icon={<Ionicons name="person-outline" size={26} color={colors.white} />}
        />
        <CenterRow
          label="Wishlist"
          onPress={() => go("Wishlist")}
          icon={<Ionicons name="heart-outline" size={26} color={colors.white} />}
        />
        <CenterRow
          label="Settings"
          onPress={() => go("Settings")}
          icon={<Ionicons name="settings-outline" size={26} color={colors.white} />}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Sign Out */}
      <View style={{ alignItems: "center", paddingVertical: 12, paddingBottom: 24 }}>
        <CenterRow
          label="Sign Out"
          onPress={() => {}}
          icon={<Ionicons name="log-out-outline" size={26} color={colors.white} />}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        // Header colors: Sand on Home, Brown elsewhere
        headerStyle: {
          backgroundColor: route.name === "Home" ? colors.background : colors.primaryDark,
        },
        headerTitleStyle: {
          color: route.name === "Home" ? colors.text : colors.white,
          fontWeight: "800",
          fontSize: route.name === "Home" ? 16 : 20,
          letterSpacing: 0.2,
        },
        headerTintColor: route.name === "Home" ? colors.text : colors.white,

        // Drawer surface background
        drawerStyle: { backgroundColor: DRAWER_BG, width: 300 },

        // Content area background = Sand (matches HomeScreen)
        sceneContainerStyle: { backgroundColor: colors.background },
        overlayColor: "rgba(0,0,0,0.35)",
      })}
      drawerContent={(props) => <AppDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, title: "Home" }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: "My Profile" }} />
      <Drawer.Screen name="Wishlist" component={WishlistScreen} options={{ title: "Wishlist" }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />

      {/* Hidden routes */}
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{ drawerItemStyle: { height: 0 }, title: "Cart" }}
      />
      <Drawer.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={({ navigation }) => ({
          drawerItemStyle: { height: 0 },
          title: "Checkout",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Cart")}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="Payment"
        component={PaymentScreen}
        options={({ navigation }) => ({
          drawerItemStyle: { height: 0 },
          title: "Payment",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Checkout")}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={({ navigation }) => ({
          drawerItemStyle: { height: 0 },
          title: "Order Confirmation",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Payment")}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  /* Header logo */
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  logoCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.primary, // Olive circle inside brown drawer
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoImage: {
    width: "92%",
    height: "92%",
    borderRadius: 60,
    resizeMode: "cover",
    backgroundColor: colors.white,
  },
  storeTitle: {
    marginTop: 12,
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    width: "78%",
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 12,
  },

  /* Menu area */
  menuWrap: {
    alignItems: "center",
    paddingVertical: 6,
  },

  /* Each row is centered overall, but uses a fixed width inner track */
  centerRow: {
    width: "78%",
    alignSelf: "center",
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginLeft: 90,
  },
  rowInner: {
    width: 220,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  iconCol: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  labelCol: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "left",
    marginLeft: 10,
  },
});
