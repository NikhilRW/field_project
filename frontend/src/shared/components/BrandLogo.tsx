import React from "react";
import { Image } from "react-native";
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
    <Image
      source={require("../../../assets/splash-icon.png")}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}
