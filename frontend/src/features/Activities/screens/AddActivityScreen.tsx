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
  type DateTimePickerEvent as RNDateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "@/shared/constants/color";
import type { ActivityStatus } from "@/shared/types/mock";
import { useActivityDraftStore } from "../hooks/useActivityDraftStore";
import { useCreateActivity } from "../hooks/useCreateActivity";
import { formatActivityDate, formatActivityDateLabel } from "../utils/date";
import { addActivityStyles as styles } from "../styles/addActivityStyles";
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import { isWeb } from "@/shared/utils/platform";

const statusOptions: ActivityStatus[] = ["Upcoming", "Ongoing", "Completed"];

export default function AddActivityScreen() {
  const insets = useSafeAreaInsets();
  const createActivityMutation = useCreateActivity();

  const {
    name,
    date,
    description,
    status,
    setName,
    setDate,

    setDescription,
    setStatus,
    resetDraft,
  } = useActivityDraftStore();
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        description: "The activity has been created successfully.",
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
    event: RNDateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (isWeb()) {
      // TODO: fix the any stuff here.
      setDate(new Date((event as any).target.value))
    }

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
            <CustomDateTimePicker
              value={date ?? new Date()}
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
              : "Save Activity"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
