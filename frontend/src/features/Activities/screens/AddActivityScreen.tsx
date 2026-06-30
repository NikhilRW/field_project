import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import  {
  type DateTimePickerEvent as RNDateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Camera, ChevronDown } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import { UniImage } from "@/shared/components/UniComponents";
import { Colors } from "@/shared/constants/color";
import { useActivityDraftStore } from "../hooks/useActivityDraftStore";
import { useCreateActivity } from "../hooks/useCreateActivity";
import { formatActivityDate, formatActivityDateLabel } from "../utils/date";
import { addActivityStyles as styles } from "../styles/addActivityStyles";
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import { isDesktopBrowser, isWeb } from "@/shared/constants/platform";
import PhotoSourcePicker from "@/features/Donations/components/PhotoSourcePicker";
import WebcamCaptureOverlay from "@/features/Donations/components/WebcamCaptureOverlay";
import WebFileInput, {
  type WebFileInputRef,
} from "@/features/Donations/components/WebFileInput";
import { CapturedPhoto } from "../types/photo";
import { statusOptions } from "../constants/options";

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
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const fileInputRef = useRef<WebFileInputRef>(null);

  const isDisabled = useMemo(
    () =>
      !name.trim() ||
      !date ||
      !description.trim() ||
      createActivityMutation.isPending,
    [name, date, description, createActivityMutation.isPending],
  );

  const handleCapturePhoto = async () => {
    if (isDesktopBrowser) {
      setShowSourcePicker(true);
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      showMessage({
        message: "Camera permission needed",
        description: "Allow camera access to take a photo for the activity.",
        type: "warning",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.45,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setPhoto({
      previewUri: asset.uri,
      imageUri: asset.uri,
      fileName: asset.fileName,
      fileType: asset.mimeType,
    });
  };

  const handleWebcamCapture = (captured: CapturedPhoto) => {
    if (photo?.imageUri?.startsWith("blob:")) {
      URL.revokeObjectURL(photo.imageUri);
    }
    setPhoto(captured);
    setShowWebcam(false);
  };

  const handleFilePick = (file: {
    uri: string;
    name: string;
    type: string;
  }) => {
    if (photo?.imageUri?.startsWith("blob:")) {
      URL.revokeObjectURL(photo.imageUri);
    }
    setPhoto({
      previewUri: file.uri,
      imageUri: file.uri,
      fileName: file.name,
      fileType: file.type,
    });
  };

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
      ...(photo?.imageUri
        ? {
            imageUri: photo.imageUri,
            fileName: photo.fileName,
            fileType: photo.fileType,
          }
        : {}),
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
      setPhoto(null);
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
    if (isWeb) {
      setDate(new Date((event as any).target.value));
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

        <Text style={styles.label}>Photo (optional)</Text>
        <TouchableOpacity
          onPress={handleCapturePhoto}
          activeOpacity={0.82}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.borderLight,
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            overflow: "hidden",
          }}
        >
          {photo?.previewUri ? (
            <UniImage
              source={{ uri: photo.previewUri }}
              style={{ width: "100%", height: 160, borderRadius: 11 }}
              contentFit="cover"
            />
          ) : (
            <>
              <Camera size={22} color={Colors.primary} strokeWidth={2.2} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: Colors.textPrimary,
                  marginTop: 8,
                }}
              >
                Add activity photo
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.textTertiary,
                  marginTop: 2,
                }}
              >
                Optional
              </Text>
            </>
          )}
        </TouchableOpacity>

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

      <WebcamCaptureOverlay
        visible={showWebcam}
        onCapture={handleWebcamCapture}
        onClose={() => setShowWebcam(false)}
      />

      <WebFileInput ref={fileInputRef} onFile={handleFilePick} />

      <PhotoSourcePicker
        visible={showSourcePicker}
        onTakePhoto={() => {
          setShowSourcePicker(false);
          setShowWebcam(true);
        }}
        onChooseFile={() => {
          setShowSourcePicker(false);
          fileInputRef.current?.open();
        }}
        onClose={() => setShowSourcePicker(false)}
      />
    </View>
  );
}
