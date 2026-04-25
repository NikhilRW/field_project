import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {AnimatedMeshGradient} from "@/shared/components/mesh-gradient";
import type { IMeshGradientColor } from "@/shared/components/mesh-gradient/types";

const meshColors: IMeshGradientColor[] = [
  { r: 0.92, g: 0.94, b: 1.0 },
  { r: 0.98, g: 0.92, b: 1.0 },
  { r: 0.9, g: 0.98, b: 1.0 },
  { r: 0.96, g: 0.94, b: 1.0 },
];

interface MeshGradientBackgroundProps {
  children?: React.ReactNode;
}

export default function MeshGradientBackground({ children }: MeshGradientBackgroundProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AnimatedMeshGradient
        colors={meshColors}
        speed={0.8}
        noise={0.2}
        blur={0.1}
        contrast={1.1}
        animated={true}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
