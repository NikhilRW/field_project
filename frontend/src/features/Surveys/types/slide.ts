import type { ReactNode } from "react";

export interface SurveySlide {
  id: number;
  icon: ReactNode;
  accentColor: string;
  bgTint: string;
  title: string;
  body: string;
}
