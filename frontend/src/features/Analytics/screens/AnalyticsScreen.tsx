import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { Calendar, ChevronDown } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAnalytics } from "../hooks/useAnalytics";
import { DateRangePicker } from "../components/DateRangePicker";
import { DonationChart } from "../components/DonationChart";
import type { TimeFilter } from "../types/common";
import { GRAPH_METRICS, TIME_FILTERS, TYPE_OPTIONS } from "../constants/common";
import { styles } from "../styles/analyticsScreenStyles";

export const AnalyticsScreen: React.FC = () => {
  // TODO: move all the state and logic to a custom hook (useAnalytics) to keep the component clean and focused on UI rendering

  const insets = useSafeAreaInsets();
  const {
    loading,
    error,
    timeFilter,
    setTimeFilter,
    setCustomDateRange,
    graphMetric,
    graphType,
    setGraphMetric,
    setGraphType,
    graphChartData,
  } = useAnalytics();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMetricPicker, setShowMetricPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const handleTimeFilterPress = (filter: TimeFilter) => {
    if (filter === "custom") {
      setShowDatePicker(true);
    } else {
      setTimeFilter(filter);
    }
  };

  const handleCustomDateApply = (start: Date, end: Date) => {
    setCustomDateRange(start, end);
  };

  const metricLabel =
    GRAPH_METRICS.find((m) => m.value === graphMetric)?.label ??
    "Total Donations";
  const typeLabel =
    TYPE_OPTIONS.find((t) => t.value === graphType)?.label ?? "Money";

  if (loading) {
    return (
      <MeshGradientBackground>
        <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </MeshGradientBackground>
    );
  }

  if (error) {
    return (
      <MeshGradientBackground>
        <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </MeshGradientBackground>
    );
  }

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Analytics Dashboard</Text>
            <Text style={styles.subtitle}>Track donation insights</Text>
          </View>

          {/* Time Filter Buttons */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>Time Period</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeFilters}
            >
              {TIME_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[
                    styles.timeFilterButton,
                    timeFilter === filter.value &&
                      styles.timeFilterButtonActive,
                  ]}
                  onPress={() => handleTimeFilterPress(filter.value)}
                >
                  {filter.value === "custom" && (
                    <Calendar
                      size={14}
                      color={
                        timeFilter === "custom" ? "#fff" : Colors.textSecondary
                      }
                    />
                  )}
                  <Text
                    style={[
                      styles.timeFilterText,
                      timeFilter === filter.value &&
                        styles.timeFilterTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chart Section */}
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>Chart</Text>
            </View>

            {/* Graph Metric Dropdown */}
            <View style={styles.graphMetricRow}>
              <Text style={styles.graphMetricLabel}>Metric</Text>
              <TouchableOpacity
                style={styles.graphPickerButton}
                onPress={() => setShowMetricPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.graphPickerText}>{metricLabel}</Text>
                <ChevronDown size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Conditional Type Sub-Dropdown */}
            {graphMetric === "type" && (
              <View style={styles.graphMetricRow}>
                <Text style={styles.graphMetricLabel}>Type</Text>
                <TouchableOpacity
                  style={styles.graphPickerButton}
                  onPress={() => setShowTypePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.graphPickerText}>{typeLabel}</Text>
                  <ChevronDown size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            <DonationChart data={graphChartData} />
          </View>
        </ScrollView>

        {/* Date Range Picker Modal */}
        <DateRangePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onApply={handleCustomDateApply}
        />

        {/* Graph Metric Picker Modal */}
        <Modal
          visible={showMetricPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMetricPicker(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setShowMetricPicker(false)}
          >
            <View style={styles.pickerModal}>
              {GRAPH_METRICS.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  style={[
                    styles.pickerOption,
                    graphMetric === m.value && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    setGraphMetric(m.value);
                    setShowMetricPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      graphMetric === m.value &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* Graph Type Picker Modal */}
        <Modal
          visible={showTypePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTypePicker(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setShowTypePicker(false)}
          >
            <View style={styles.pickerModal}>
              {TYPE_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[
                    styles.pickerOption,
                    graphType === t.value && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    setGraphType(t.value);
                    setShowTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      graphType === t.value && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    </MeshGradientBackground>
  );
};
