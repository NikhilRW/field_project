import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { UniImage } from "@/shared/components/UniComponents";
import { onboardingStyles as styles } from "../styles/onboardingStyles";
import { useOnboardingCarousel } from "../hooks/useOnboardingCarousel";
import { useAuthStore } from "@/shared/stores/authStore";

export default function OnboardingScreen() {
  const {
    currentIndex,
    slides,
    slide,
    animateToSlide,
    illustrationAnimatedStyle,
  } = useOnboardingCarousel();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/activities" as any);
    }
  }, [isAuthenticated]);

  if (!slide) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      animateToSlide(currentIndex + 1);
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <Animated.View
        style={[
          styles.imageContainer,
          illustrationAnimatedStyle,
        ]}
      >
        <UniImage
          source={slide.image}
          style={styles.image}
          contentFit="contain"
        />

      </Animated.View>

      <View style={styles.bottomSection}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && [
                  styles.dotActive,
                  { backgroundColor: slide.accentColor },
                ],
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: slide.accentColor }]}
          onPress={handleNext}
          activeOpacity={0.8}
          testID="next-btn"
        >
          <Text style={styles.nextBtnText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
          <ArrowRight size={16} color="#fff" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}