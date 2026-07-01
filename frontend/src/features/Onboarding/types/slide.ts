import type { ReactNode } from "react";
import type { ImageSource } from "expo-image";

export interface OnboardingSlide {
  id: number;
  icon: ReactNode;
  image: ImageSource;
  accentColor: string;
  bgTint: string;
  title: string;
  body: string;
}
