import React from "react";
import { HandCoins, Calendar, BarChart3 } from "lucide-react-native";
import type { OnboardingSlide } from "../types/slide";

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    icon: <HandCoins size={24} color="#0D5C91" strokeWidth={1.4} />,
    image: require("../../../../assets/jpegs/showcase1.jpeg"),
    accentColor: "#0D5C91",
    bgTint: "#E8F1F8",
    title: "Manage All\nDonations",
    body: "Record money and item donations — books, clothes, groceries, and more. Track verification and handover status in one place.",
  },
  {
    id: 2,
    icon: <Calendar size={24} color="#1D9E54" strokeWidth={1.4} />,
    image: require("../../../../assets/jpegs/showcase2.jpeg"),
    accentColor: "#1D9E54",
    bgTint: "#E4F5EC",
    title: "Track NGO\nActivities",
    body: "Schedule, update, and notify users about activities in real time. From study drives to health camps, stay organised.",
  },
  {
    id: 3,
    icon: <BarChart3 size={24} color="#E8880C" strokeWidth={1.4} />,
    image: require("../../../../assets/jpegs/showcase3.jpeg"),
    accentColor: "#E8880C",
    bgTint: "#FDF3E3",
    title: "Data-Driven\nImpact",
    body: "Visualise donation trends, beneficiary reach, and activity metrics with interactive charts and filters.",
  },
];
