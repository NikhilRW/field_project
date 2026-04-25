import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Clock, Plus, Users } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import AppHeader from "@/shared/components/AppHeader";
import { useAuthStore } from "@/shared/stores/authStore";
import { useActivities } from "../hooks/useActivities";
import { activityFilterTabs } from "../constants/filterTabs";
import type { ActivityFilterTab } from "../types/filter";
import {
  getActivityStatusBg,
  getActivityStatusColor,
} from "../utils/statusColors";
import { activitiesStyles as styles } from "../styles/activitiesStyles";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";

export default function ActivitiesScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ActivityFilterTab>("All");
  const { data: activityItems = [], refetch } = useActivities();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const filtered = activityItems.filter(
    (a) => activeTab === "All" || a.status === activeTab,
  );

  const upcoming = activityItems.filter((a) => a.status === "Upcoming").length;
  const completed = activityItems.filter(
    (a) => a.status === "Completed",
  ).length;

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top,paddingBottom:insets.bottom + 40, backgroundColor: "transparent" },
        ]}
      >
        <AppHeader />

        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Activities</Text>
              <Text style={styles.titleSub}>
                {activityItems.length} total programs
              </Text>
            </View>
            {isAdmin && (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => router.push("/(main)/add-activity" as any)}
                testID="add-activity-btn"
              >
                <Plus size={14} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.miniStat,
              {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
            ]}
          >
            <Text style={[styles.miniStatNum, { color: Colors.accent }]}>
              {upcoming}
            </Text>
            <Text style={styles.miniStatLabel}>Upcoming</Text>
          </View>
          <View
            style={[
              styles.miniStat,
              {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
            ]}
          >
            <Text style={[styles.miniStatNum, { color: Colors.secondary }]}>
              {completed}
            </Text>
            <Text style={styles.miniStatLabel}>Done</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {activityFilterTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
                activeTab === tab && styles.filterTabActive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
              testID={`filter-${tab}`}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === tab && styles.filterTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.card,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.35)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  elevation: 0,
                  shadowOpacity: 0,
                },
              ]}
              activeOpacity={0.7}
              onPress={() =>
                router.push(`/(main)/activity/${activity.id}` as any)
              }
              testID={`activity-${activity.id}`}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.dateChip,
                    { backgroundColor: getActivityStatusBg(activity.status) },
                  ]}
                >
                  <Clock
                    size={11}
                    color={getActivityStatusColor(activity.status)}
                    strokeWidth={1.8}
                  />
                  <Text
                    style={[
                      styles.dateChipText,
                      { color: getActivityStatusColor(activity.status) },
                    ]}
                  >
                    {activity.date}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: getActivityStatusColor(activity.status),
                    },
                  ]}
                />
              </View>
              <Text style={styles.cardTitle}>{activity.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {activity.description}
              </Text>
              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Users size={12} color={Colors.primary} strokeWidth={1.6} />
                  <Text
                    style={[
                      styles.footerText,
                      { color: Colors.primary, fontWeight: "600" as const },
                    ]}
                  >
                    {activity.volunteers}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {activityItems.length === 0
                  ? "No activities are available yet."
                  : "No activities match this filter."}
              </Text>
            </View>
          ) : null}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
