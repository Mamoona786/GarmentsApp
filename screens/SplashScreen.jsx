import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  Easing,
  interpolate,
  withSequence,
  withRepeat,
} from "react-native-reanimated";
import colors from "../theme/colors";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const shimmerX = useSharedValue(0);
  const barProgress = useSharedValue(0);
  const particlesOpacity = useSharedValue(0);
  const backgroundZoom = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Background zoom effect
    backgroundZoom.value = withTiming(1.05, { duration: 8000, easing: Easing.out(Easing.quad) });

    // Logo animation sequence
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    logoScale.value = withSequence(
      withTiming(0.8, { duration: 400, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(1, { duration: 300 })
    );
    logoRotate.value = withSequence(
      withDelay(200, withTiming(-5, { duration: 200 })),
      withDelay(400, withTiming(5, { duration: 200 })),
      withDelay(600, withTiming(0, { duration: 200 }))
    );

    // Glow effect
    glowOpacity.value = withDelay(
      800,
      withRepeat(
        withSequence(withTiming(1, { duration: 1200 }), withTiming(0.6, { duration: 1200 })),
        -1,
        true
      )
    );

    // Title animation
    titleOpacity.value = withDelay(350, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(350, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    // Shimmer effect
    shimmerX.value = withDelay(
      600,
      withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }), -1, true)
    );

    // Progress bar
    barProgress.value = withDelay(500, withTiming(1, { duration: 7000 }));

    // Floating particles
    particlesOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // Button animation
    buttonOpacity.value = withDelay(6500, withTiming(1, { duration: 1000 }));
    buttonScale.value = withDelay(6500, withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.2)) }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerX.value, [0, 1], [-80, width - 24]);
    return {
      transform: [{ translateX }],
      opacity: interpolate(shimmerX.value, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
    };
  });

  const barStyle = useAnimatedStyle(() => ({
    width: `${barProgress.value * 100}%`,
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backgroundZoom.value }],
  }));

  const particlesStyle = useAnimatedStyle(() => ({
    opacity: particlesOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  // Create floating particles using theme colors (olive / moss / khaki)
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 16; i++) {
      const size = Math.random() * 8 + 2;
      const left = Math.random() * width;
      const top = Math.random() * (height / 2) + 50;

      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              width: size,
              height: size,
              left,
              top,
              backgroundColor: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.primaryLight : colors.accent,
            },
            particlesStyle,
          ]}
        />
      );
    }
    return particles;
  };

  return (
    <View style={styles.root}>
      {/* Animated background gradient */}
      <Animated.View style={[StyleSheet.absoluteFill, backgroundStyle]}>
        {/* Use olive→brown gradient for background tint */}
        <LinearGradient
          colors={["rgba(85,107,47,0.85)", "rgba(123,63,0,0.92)", "rgba(85,107,47,0.95)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Background image */}
        <Image
          source={{ uri: "https://i.pinimg.com/1200x/b2/27/c6/b227c622f2531e490903bf40d940f096.jpg" }}
          style={styles.backgroundImage}
          blurRadius={1}
        />

        {/* Subtle overlay (kept simple for RN compatibility) */}
        <View style={styles.patternOverlay} />
      </Animated.View>

      {/* Floating particles */}
      {renderParticles()}

      {/* Circular logo container */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        {/* Outer glow */}
        <Animated.View style={[styles.logoGlow, glowStyle]} />

        {/* Logo background gradient — explicit Olive ↔ Brown contrast */}
        <LinearGradient
          colors={[colors.primary, colors.accent, colors.primaryDark]}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Logo image with circular mask */}
        <View style={styles.logoImageContainer}>
          <Image
            source={{ uri: "https://i.pinimg.com/736x/aa/50/92/aa50927881d5dadb41650ee7b8a91bdf.jpg" }}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        {/* Logo border */}
        <View style={styles.logoBorder} />
      </Animated.View>

      {/* brand wordmark */}
      <Animated.View style={[styles.titleWrap, titleStyle]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Garments Store</Text>
        </View>
        <Text style={styles.tagline}>Crafting Timeless Elegance</Text>
      </Animated.View>

      {/* progress bar with pulse effect */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, barStyle]}>
            <View style={styles.progressGlow} />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>Loading our collection...</Text>
      </View>

      {/* Enter button */}
      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={() => navigation.replace("Main")}
          activeOpacity={0.8}
        >
          {/* Button gradient — Olive → Brown for clear contrast */}
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Explore Collection</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const LOGO_SIZE = 140;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background, // Sand
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.4,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 0.05,
  },
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    position: "relative",
  },
  logoGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: LOGO_SIZE / 2,
  },
  logoImageContainer: {
    width: LOGO_SIZE - 16,
    height: LOGO_SIZE - 16,
    borderRadius: (LOGO_SIZE - 16) / 2,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  logoBorder: {
    position: "absolute",
    width: LOGO_SIZE + 4,
    height: LOGO_SIZE + 4,
    borderRadius: (LOGO_SIZE + 4) / 2,
    borderWidth: 2,
    borderColor: "rgba(215, 204, 200, 0.3)",
  },
  logoGlow: {
    position: "absolute",
    width: LOGO_SIZE + 40,
    height: LOGO_SIZE + 40,
    borderRadius: (LOGO_SIZE + 40) / 2,
    backgroundColor: "rgba(215, 204, 200, 0.15)",
    shadowColor: colors.background,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  titleWrap: {
    alignItems: "center",
    marginTop: 10,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 2.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: "serif",
  },
  tagline: {
    color: colors.white,
    opacity: 0.9,
    marginTop: 12,
    fontSize: 16,
    letterSpacing: 3,
    fontWeight: "300",
    textTransform: "uppercase",
  },
  shimmerTrack: {
    height: 2,
    marginTop: 15,
    backgroundColor: "rgba(215,204,200,0.2)",
    borderRadius: 3,
    overflow: "hidden",
    width: "80%",
  },
  shimmerDot: {
    width: 80,
    height: 2,
    backgroundColor: colors.background,
    borderRadius: 3,
  },
  progressContainer: {
    position: "absolute",
    bottom: 100,
    left: 48,
    right: 48,
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 5,
    backgroundColor: "rgba(247,241,236,0.2)",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary, // Olive for strong contrast
    borderRadius: 5,
    position: "relative",
  },
  progressGlow: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: 25,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  loadingText: {
    color: colors.white,
    fontSize: 13,
    opacity: 0.8,
    letterSpacing: 1.2,
    fontWeight: "500",
  },
  particle: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.7,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    width: "100%",
  },
  enterButton: {
    width: 240,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 17,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
