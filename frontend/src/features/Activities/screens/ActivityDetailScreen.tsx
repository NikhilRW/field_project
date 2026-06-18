import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Trash2, CalendarDays } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import ActivityStatusMenu from "../components/ActivityStatusMenu";
import DeleteActivityModal from "../components/DeleteActivityModal";
import { useActivity } from "../hooks/useActivity";
import { activityDetailStyles } from "../styles/activityDetailStyles";
import {
  getActivityStatusBg,
  getActivityStatusColor,
} from "../utils/statusColors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const {
    data: activity,
    isLoading,
    isError,
    deleteModalVisible,
    openDeleteModal,
    closeDeleteModal,
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>{activity.name}</Text>
          </View>
          {isAdmin ? (
            <View style={styles.titleActions}>
              <TouchableOpacity
                style={[
                  styles.deleteIconButton,
                  isDeleting && styles.deleteIconButtonDisabled,
                ]}
                onPress={openDeleteModal}
                activeOpacity={0.85}
                disabled={isDeleting}
                testID="delete-activity-btn"
                accessibilityRole="button"
                accessibilityLabel="Delete activity"
              >
                <Trash2 size={18} color={Colors.error} strokeWidth={2.2} />
              </TouchableOpacity>
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

        <View style={{ height: 24 }} />
      </ScrollView>

      <DeleteActivityModal
        visible={deleteModalVisible}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
      />
    </SafeAreaView>
  );
}

const styles = activityDetailStyles;
