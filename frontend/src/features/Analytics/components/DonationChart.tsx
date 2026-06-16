import React, { useState, useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import {
  Circle,
  Group,
  Shadow,
  Text as SkiaText,
  useFont,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import {
  LineGraph,
  type GraphPoint,
  type SelectionDotProps,
} from "react-native-graph";
import { Colors } from "@/shared/constants/color";
import {
  CIRCLE_RADIUS,
  HORIZONTAL_PADDING,
} from "../constants/common";
import type { DonationChartProps } from "../types/props";
import { styles } from "../styles/donationChartStyles";

// TODO: what is this actually can not use ref directly.
const tooltipTextRef: { current: string } = { current: "" };

function StaticSelectionDot({ color, circleX, circleY, isActive }: SelectionDotProps) {
  const font = useFont(require("../../../../assets/ttfs/Inter.ttf"), 13);
  const circleRadius = useSharedValue(CIRCLE_RADIUS);
  const glowOuterR = useDerivedValue(() => circleRadius.value * 4, [circleRadius]);
  const dotOpacity = useDerivedValue(() => (isActive.value ? 1 : 0), [isActive]);
  const [text, setText] = useState("");
  const textX = useDerivedValue(
    () => Math.max(5, circleX.value - 50),
    [circleX],
  );
  const textY = useDerivedValue(
    () => Math.max(14, circleY.value - 20),
    [circleY],
  );

  useAnimatedReaction(
    () => circleX.value,
    () => {
      runOnJS(setText)(tooltipTextRef.current);
    },
    [circleX, circleY],
  );

  return (
    <Group opacity={dotOpacity}>
      <Circle cx={circleX} cy={circleY} r={glowOuterR} color={"#00ddff"} opacity={0.06} />
      <Circle cx={circleX} cy={circleY} r={circleRadius} color={color}>
        <Shadow dx={0} dy={0} color={color} blur={6} />
      </Circle>
      {font && (
        <SkiaText
          x={textX}
          y={textY}
          text={text}
          font={font}
          color={Colors.textPrimary}
        />
      )}
    </Group>
  );
}

export const DonationChart: React.FC<DonationChartProps> = ({ data }) => {
  const points = useMemo(
    () =>
      data
        .map((d) => ({ value: d.count, date: new Date(d.date) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [data],
  );

  const { yLabels, xLabels } = useMemo(() => {
    const vals = points.map((p) => p.value);
    const maxVal = Math.max(...vals, 1);
    const ticks = 4;
    const yLabels = Array.from({ length: ticks + 1 }, (_, i) =>
      Math.round((maxVal / ticks) * i),
    );
    const labelCount = points.length <= 10 ? points.length : 5;
    const step = Math.max(1, Math.floor(points.length / labelCount));
    const xLabels = points
      .filter((_, i) => i % step === 0)
      .map((p) => ({
        date: p.date,
        label: p.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
    return { yLabels, xLabels };
  }, [points]);

  const handlePointSelected = useCallback((p: GraphPoint) => {
    const d = new Date(p.date);
    tooltipTextRef.current = `${d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${p.value}`;
  }, []);

  const hasSingleDate = useMemo(() => {
    if (points.length < 2) return true;
    const firstDate = points[0].date.getTime();
    return points.every((p) => p.date.getTime() === firstDate);
  }, [points]);

  if (data.length === 0 || points.length < 2 || hasSingleDate) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {data.length === 0 ? "No data to display" : "Insufficient data for chart"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donations Over Time</Text>
      <View style={styles.graphArea}>
        <View style={styles.yAxis}>
          {yLabels
            .slice()
            .reverse()
            .map((val, i) => (
              <Text key={i} style={styles.yLabel}>
                {val}
              </Text>
            ))}
        </View>
        <View style={styles.graphWrapper}>
          <LineGraph
            points={points}
            color={Colors.primary}
            animated
            enablePanGesture
            onPointSelected={handlePointSelected}
            style={styles.graph}
            lineThickness={2}
            horizontalPadding={HORIZONTAL_PADDING}
            verticalPadding={15}
            SelectionDot={StaticSelectionDot}
          />
          <View style={styles.xAxis}>
            {xLabels.map((label, i) => (
              <Text key={i} style={styles.xLabel}>
                {label.label}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
