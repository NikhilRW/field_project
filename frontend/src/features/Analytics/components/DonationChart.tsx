import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import type { DonationChartProps } from "../types/props";
import {
  CIRCLE_RADIUS,
  CIRCLE_RADIUS_MULTIPLIER,
  HORIZONTAL_PADDING,
} from "../constants/common";
import { aggregateByWeek } from "../utils/common";
import { styles } from "../styles/donationChartStyles";

// TODO: what is this actually can not use ref directly.
const tooltipTextRef: { current: string } = { current: "" };

function StaticSelectionDot({ color, circleX, circleY }: SelectionDotProps) {
  const font = useFont(require("../../../../assets/ttfs/Inter.ttf"), 13);
  const circleRadius = useSharedValue(CIRCLE_RADIUS);
  const circleStrokeRadius = useDerivedValue(
    () => circleRadius.value * CIRCLE_RADIUS_MULTIPLIER,
  );
  const [text, setText] = useState(tooltipTextRef.current);
  const textX = useDerivedValue(
    () => Math.max(5, circleX.value - 70),
    [circleX],
  );
  const textY = useDerivedValue(
    () => Math.max(14, circleY.value - 20),
    [circleY],
  );

  useEffect(() => {
    setText(tooltipTextRef.current);
  }, []);

  useAnimatedReaction(
    () => circleX.value,
    () => {
      runOnJS(setText)(tooltipTextRef.current);
    },
    [circleX, circleY],
  );

  return (
    <Group>
      <Circle
        opacity={0.05}
        cx={circleX}
        cy={circleY}
        r={circleStrokeRadius}
        color="#333333"
      />
      <Circle cx={circleX} cy={circleY} r={circleRadius} color={color}>
        <Shadow dx={0} dy={0} color="rgba(0,0,0,0.5)" blur={4} />
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
  const points = useMemo(() => aggregateByWeek(data), [data]);
  const firstPoint = points[0] ?? null;

  useEffect(() => {
    if (firstPoint) {
      const d = new Date(firstPoint.date);
      tooltipTextRef.current = `${d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })}  ${firstPoint.value}`;
    }
  }, [firstPoint]);

  const { yLabels, xLabels } = useMemo(() => {
    const vals = points.map((p) => p.value);
    const maxVal = Math.max(...vals, 1);
    const ticks = 4;
    const yLabels = Array.from({ length: ticks + 1 }, (_, i) =>
      Math.round((maxVal / ticks) * i),
    );
    const xLabels = points
      .filter((_, i) => i % Math.max(1, Math.floor(points.length / 5)) === 0)
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

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data to display</Text>
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
            verticalPadding={30}
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
