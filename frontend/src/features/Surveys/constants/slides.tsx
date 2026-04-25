import React from "react";
import { Users, Calendar, HandHeart } from "lucide-react-native";
import type { SurveySlide } from "../types/slide";

export const surveySlides: SurveySlide[] = [
  {
    id: 1,
    icon: <Users size={44} color="#0D5C91" strokeWidth={1.4} />,
    accentColor: "#0D5C91",
    bgTint: "#E8F1F8",
    title: "Track Every\nBeneficiary",
    body: "Manage complete profiles — health status, service history, and needs, all in one place.",
  },
  {
    id: 2,
    icon: <Calendar size={44} color="#1D9E54" strokeWidth={1.4} />,
    accentColor: "#1D9E54",
    bgTint: "#E4F5EC",
    title: "Monitor All\nActivities",
    body: "Schedule, assign, and track every mission from study kit drives to health camps.",
  },
  {
    id: 3,
    icon: <HandHeart size={44} color="#E8880C" strokeWidth={1.4} />,
    accentColor: "#E8880C",
    bgTint: "#FDF3E3",
    title: "Build Donor\nTrust",
    body: "Transparent tracking and impact reporting that keeps every donor confident.",
  },
];
