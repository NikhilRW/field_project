import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GOOGLE_IMAGE_SOURCE } from "../constants/common";
import { loginStyles as styles } from "../styles/loginStyles";
import { GoogleAuthButtonProps } from "../types/props";

export default function GoogleAuthButton({
  disabled,
  isLoading,
  onPress,
  testID,
}: GoogleAuthButtonProps) {
  return (
    <TouchableOpacity
      style={styles.googleBtn}
      onPress={onPress}
      activeOpacity={0.8}
      testID={testID}
      disabled={disabled}
    >
      <LinearGradient
        colors={["#4285F430", "#34A85330", "#FBBC0530", "#EA433530"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        locations={[0, 0.38, 0.68, 1]}
      >
        <View style={styles.googleBtnContentContainer}>
          <View style={styles.googleMark}>
            <Image
              source={GOOGLE_IMAGE_SOURCE}
              resizeMethod="resize"
              style={styles.googleImage}
            />
          </View>
          <Text style={styles.googleBtnText}>
            {isLoading ? "Continuing..." : "Continue with Google"}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
