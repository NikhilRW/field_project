import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { surveysStyles as styles } from "../styles/surveysStyles";
import { useSurveysCarousel } from "../hooks/useSurveysCarousel";

export default function SurveysScreen() {
  const {
    currentIndex,
    slides,
    slide,
    animateToSlide,
    illustrationAnimatedStyle,
    contentAnimatedStyle,
  } = useSurveysCarousel();

  if (!slide) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      animateToSlide(currentIndex + 1);
    } else {
      router.replace("/(auth)/login" as any);
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/login" as any);
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <View style={styles.topBar}>
        <Text style={styles.stepText}>
          {currentIndex + 1} of {slides.length}
        </Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.illustrationArea,
          { backgroundColor: slide.bgTint },
          illustrationAnimatedStyle,
        ]}
      >
        <View style={styles.iconCircle}>{slide.icon}</View>
      </Animated.View>

      <View style={styles.contentArea}>
        <Animated.View style={contentAnimatedStyle}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
        </Animated.View>

        <View style={styles.bottomArea}>
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
    </View>
  );
}
