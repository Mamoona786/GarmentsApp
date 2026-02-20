// navigation/RootNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import MainDrawer from "./MainDrawer";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import colors from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }, // Sand scene background
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Main" component={MainDrawer} />

      {/* Auth screens use Brown headers with White text; thin Olive bottom border for contrast */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: "Sign In",
          headerStyle: {
            backgroundColor: colors.primaryDark, // Warm Brown
          },
          headerTitleStyle: { color: colors.white, fontWeight: "800" },
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: "Create Account",
          headerStyle: {
            backgroundColor: colors.primaryDark, // Warm Brown
          },
          headerTitleStyle: { color: colors.white, fontWeight: "800" },
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          title: "Change Password",
          headerStyle: {
            backgroundColor: colors.primaryDark, // Warm Brown
          },
          headerTitleStyle: { color: colors.white, fontWeight: "800" },
          headerTintColor: colors.white,
        }}
      />
    </Stack.Navigator>
  );
}
