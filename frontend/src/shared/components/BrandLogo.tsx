import React from "react";
import { UniImage } from "@/shared/components/UniComponents";
import type { ImageStyle, StyleProp } from "react-native";

type BrandLogoProps = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export default function BrandLogo({
  size = 40,
  style,
}: BrandLogoProps) {
  return (
    <UniImage
      source={require("../../../assets/splash-icon.png")}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
