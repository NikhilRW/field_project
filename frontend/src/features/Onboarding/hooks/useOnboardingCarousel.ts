import { useState } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { onboardingSlides } from "../constants/slides";
import type { OnboardingSlide } from "../types/slide";
import { scheduleOnRN } from "react-native-worklets";

export const useOnboardingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useSharedValue(1);
  const slideAnim = useSharedValue(0);

  const illustrationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const animateToSlide = (nextIndex: number) => {
    fadeAnim.value = withTiming(0, { duration: 180 }, (finished) => {
      if (finished) {
        scheduleOnRN(() => setCurrentIndex(nextIndex));
        slideAnim.value = 20;
        fadeAnim.value = withTiming(1, { duration: 220 });
        slideAnim.value = withTiming(0, { duration: 220 });
      }
    });
    slideAnim.value = withTiming(-20, { duration: 180 });
  };

  const slide: OnboardingSlide | undefined = onboardingSlides[currentIndex];

  return {
    currentIndex,
    slides: onboardingSlides,
    slide,
    fadeAnim,
    slideAnim,
    illustrationAnimatedStyle,
    contentAnimatedStyle,
    animateToSlide,
  };
};
