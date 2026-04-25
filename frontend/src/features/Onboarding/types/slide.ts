import type { ReactNode } from "react";

export interface OnboardingSlide {
  id: number;
  icon: ReactNode;
  accentColor: string;
  bgTint: string;
  title: string;
  body: string;
}
