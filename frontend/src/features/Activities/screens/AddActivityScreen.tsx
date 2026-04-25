import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Check, ChevronDown, Plus } from "lucide-react-native";
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "@/shared/constants/color";
import { useVolunteers } from "@/features/Volunteers/hooks/useVolunteers";
import type { ActivityStatus, Volunteer } from "@/shared/types/mock";
import { useActivityDraftStore } from "../hooks/useActivityDraftStore";
import { useCreateActivity } from "../hooks/useCreateActivity";
import { formatActivityDate, formatActivityDateLabel } from "../utils/date";
import { addActivityStyles as styles } from "../styles/addActivityStyles";

const statusOptions: ActivityStatus[] = ["Upcoming", "Ongoing", "Completed"];

export default function AddActivityScreen() {
  const insets = useSafeAreaInsets();
  const { data: volunteers = [] } = useVolunteers();
  const createActivityMutation = useCreateActivity();

  const {
    name,
    date,
    description,
    status,
    volunteerIds,
    setName,
    setDate,

    setDescription,
    setStatus,
    toggleVolunteer,
    resetDraft,
  } = useActivityDraftStore();
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedCount = volunteerIds.length;

  const isDisabled = useMemo(
    () =>
      !name.trim() ||
      !date ||
      !description.trim() ||
      createActivityMutation.isPending,
    [name, date, description, createActivityMutation.isPending],
  );

  const handleSave = async () => {
    if (isDisabled) {
      showMessage({
        message: "Missing details",
        description: "Please complete all required fields.",
        type: "warning",
      });
      return;
    }

    const payload = {
      name: name.trim(),
      date: formatActivityDate(date!),
      description: description.trim(),
      status,
      volunteerIds,
    };

    const netState = await NetInfo.fetch();
    const isOnline = Boolean(netState.isConnected);

    if (!isOnline) {
      createActivityMutation.mutate(payload);
      showMessage({
        message: "Activity queued",
        description: "It will sync automatically when you are back online.",
        type: "info",
      });
      resetDraft();
      router.back();
      return;
    }

    try {
      await createActivityMutation.mutateAsync(payload);

      showMessage({
        message: "Activity created",
        description: "Volunteers have been assigned successfully.",
        type: "success",
      });
      resetDraft();
      router.back();
    } catch (error: any) {
      showMessage({
        message: "Unable to save activity",
        description:
          error?.message ?? "Please try again once your connection is stable.",
        type: "danger",
      });
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }

    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Activity Name</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Enter activity name"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
            testID="activity-name-input"
          />
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowDatePicker(true)}
          testID="activity-date-input"
        >
          <Text style={styles.pickerValue}>
            {date ? formatActivityDateLabel(date) : "Select date"}
          </Text>
          <ChevronDown size={16} color={Colors.textTertiary} />
        </TouchableOpacity>
        {showDatePicker && (
          <View style={{ marginBottom: 14 }}>
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={[styles.saveBtn, { marginTop: 8 }]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.saveBtnText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label}>Description</Text>
        <View style={[styles.inputWrap, styles.textAreaWrap]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the activity"
            placeholderTextColor={Colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            testID="activity-description-input"
          />
        </View>

        <Text style={styles.label}>Status</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowStatusPicker((prev) => !prev)}
          testID="status-picker"
        >
          <Text style={styles.pickerValue}>{status}</Text>
          <ChevronDown size={16} color={Colors.textTertiary} />
        </TouchableOpacity>
        {showStatusPicker && (
          <View style={styles.pickerDropdown}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOption,
                  option === status && styles.pickerOptionActive,
                ]}
                onPress={() => {
                  setStatus(option);
                  setShowStatusPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    option === status && styles.pickerOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assign Volunteers</Text>
          <Text style={styles.sectionSub}>{selectedCount} selected</Text>
        </View>

        <View style={styles.volunteerList}>
          {volunteers.map((volunteer: Volunteer) => {
            const isSelected = volunteerIds.includes(volunteer.id);
            return (
              <TouchableOpacity
                key={volunteer.id}
                style={[
                  styles.volunteerRow,
                  isSelected && styles.volunteerRowActive,
                ]}
                onPress={() => toggleVolunteer(volunteer.id)}
                testID={`assign-${volunteer.id}`}
              >
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
                <View
                  style={[
                    styles.selectBadge,
                    isSelected && styles.selectBadgeActive,
                  ]}
                >
                  {isSelected ? (
                    <Check size={14} color="#fff" strokeWidth={2.4} />
                  ) : (
                    <Plus
                      size={14}
                      color={Colors.textTertiary}
                      strokeWidth={2}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View
        style={[styles.saveContainer, { paddingBottom: insets.bottom + 8 }]}
      >
        <TouchableOpacity
          style={[styles.saveBtn, isDisabled && { opacity: 0.6 }]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isDisabled}
          testID="save-activity-btn"
        >
          <Text style={styles.saveBtnText}>
            {createActivityMutation.isPending
              ? "Saving..."
              : "Save Activity & Assign"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
