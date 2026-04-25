import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Users, CalendarDays } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import ActivityDeleteAction from "../components/ActivityDeleteAction";
import ActivityStatusMenu from "../components/ActivityStatusMenu";
import { useActivity } from "../hooks/useActivity";
import { activityDetailStyles } from "../styles/activityDetailStyles";
import {
  getActivityStatusBg,
  getActivityStatusColor,
} from "../utils/statusColors";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const {
    data: activity,
    isLoading,
    isError,
    handleDelete,
    handleStatusChange,
    isDeleting,
    isUpdatingStatus,
  } = useActivity(id ?? "");

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.stateText}>Loading activity...</Text>
      </View>
    );
  }

  if (isError || !activity) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>
          Unable to load activity details. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>{activity.name}</Text>
          </View>
          {isAdmin ? (
            <View style={styles.titleActions}>
              <ActivityDeleteAction
                isDeleting={isDeleting}
                onDelete={handleDelete}
              />
              <ActivityStatusMenu
                status={activity.status}
                isUpdating={isUpdatingStatus}
                onChangeStatus={handleStatusChange}
              />
            </View>
          ) : null}
        </View>
        <Text style={styles.subtitle}>{activity.description}</Text>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <CalendarDays size={16} color={Colors.primary} strokeWidth={1.8} />
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{activity.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Users size={16} color={Colors.primary} strokeWidth={1.8} />
            <Text style={styles.metaLabel}>
              {isAdmin ? "Volunteers" : "Team Members"}
            </Text>
            <Text style={styles.metaValue}>{activity.volunteers}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: getActivityStatusBg(activity.status),
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: getActivityStatusColor(activity.status),
                  },
                ]}
              >
                {activity.status}
              </Text>
            </View>
          </View>
        </View>

        {isAdmin && activity.assignedVolunteers?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Volunteers</Text>
            {activity.assignedVolunteers.map((volunteer) => (
              <View key={volunteer.id} style={styles.volunteerRow}>
                <View
                  style={[
                    styles.volunteerAvatar,
                    { backgroundColor: volunteer.color },
                  ]}
                >
                  <Text style={styles.volunteerInitials}>
                    {volunteer.initials}
                  </Text>
                </View>
                <View style={styles.volunteerInfo}>
                  <Text style={styles.volunteerName}>{volunteer.name}</Text>
                  <Text style={styles.volunteerMeta}>
                    {volunteer.role} · {volunteer.skill}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = activityDetailStyles;
