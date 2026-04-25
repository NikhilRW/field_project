import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { Camera, ChevronDown } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useCreateBeneficiary } from "../hooks/useCreateBeneficiary";
import {
  beneficiaryCategories,
  beneficiaryGenders,
  beneficiaryHealthOptions,
} from "../constants/formOptions";
import type { Category, Gender, HealthStatus } from "../types/form";
import { getHealthColor } from "../utils/colors";
import { addBeneficiaryStyles as styles } from "../styles/addBeneficiaryStyles";

export default function AddBeneficiaryScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [category, setCategory] = useState<Category>("Elderly");
  const [address, setAddress] = useState("");
  const [healthStatus, setHealthStatus] = useState<HealthStatus>("Good");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showHealthPicker, setShowHealthPicker] = useState(false);
  const { mutate, mutateAsync, isPending: isSaving } = useCreateBeneficiary();

  const genders: Gender[] = beneficiaryGenders;
  const categories: Category[] = beneficiaryCategories;
  const healthOptions: HealthStatus[] = beneficiaryHealthOptions;
  const healthColor = getHealthColor;

  const handleSave = async () => {
    if (!name.trim() || !age.trim() || !address.trim()) {
      showMessage({
        message: "Missing details",
        description: "Please fill in name, age, and address.",
        type: "warning",
      });
      return;
    }

    const parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge <= 0) {
      showMessage({
        message: "Invalid age",
        description: "Please enter a valid age.",
        type: "warning",
      });
      return;
    }

    const payload = {
      name: name.trim(),
      age: parsedAge,
      gender,
      category,
      address: address.trim(),
      healthStatus,
    };

    const netState = await NetInfo.fetch();
    const isOnline = Boolean(netState.isConnected);

    if (!isOnline) {
      mutate(payload);
      showMessage({
        message: "Beneficiary queued",
        description:
          "No internet connection. This save will sync automatically when you're back online.",
        type: "info",
      });
      router.back();
      return;
    }

    try {
      await mutateAsync(payload);

      showMessage({
        message: "Beneficiary added",
        description: "New beneficiary saved successfully.",
        type: "success",
      });
      router.back();
    } catch (error: any) {
      showMessage({
        message: "Save failed",
        description:
          error?.message ?? "Unable to save beneficiary. Please try again.",
        type: "danger",
      });
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
        <TouchableOpacity style={styles.photoUpload} testID="photo-upload">
          <View style={styles.photoCircle}>
            <Camera size={26} color={Colors.textTertiary} strokeWidth={1.6} />
            <Text style={styles.photoText}>Add Photo</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
            testID="name-input"
          />
        </View>

        <Text style={styles.label}>Age</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            placeholderTextColor={Colors.textTertiary}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            testID="age-input"
          />
        </View>

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          {genders.map((g) => (
            <TouchableOpacity
              key={g}
              style={styles.radioItem}
              onPress={() => setGender(g)}
              testID={`gender-${g}`}
            >
              <View
                style={[
                  styles.radioOuter,
                  gender === g && styles.radioOuterActive,
                ]}
              >
                {gender === g && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          testID="category-picker"
        >
          <Text style={styles.pickerValue}>{category}</Text>
          <ChevronDown size={16} color={Colors.textTertiary} />
        </TouchableOpacity>
        {showCategoryPicker && (
          <View style={styles.pickerDropdown}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.pickerOption,
                  c === category && styles.pickerOptionActive,
                ]}
                onPress={() => {
                  setCategory(c);
                  setShowCategoryPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    c === category && styles.pickerOptionTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Address</Text>
        <View style={[styles.inputWrap, styles.textAreaWrap]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter complete address"
            placeholderTextColor={Colors.textTertiary}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            testID="address-input"
          />
        </View>

        <Text style={styles.label}>Health Status</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setShowHealthPicker(!showHealthPicker)}
          testID="health-picker"
        >
          <View style={styles.healthRow}>
            <View
              style={[
                styles.healthDot,
                { backgroundColor: healthColor(healthStatus) },
              ]}
            />
            <Text style={styles.pickerValue}>{healthStatus}</Text>
          </View>
          <ChevronDown size={16} color={Colors.textTertiary} />
        </TouchableOpacity>
        {showHealthPicker && (
          <View style={styles.pickerDropdown}>
            {healthOptions.map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.pickerOption,
                  h === healthStatus && styles.pickerOptionActive,
                ]}
                onPress={() => {
                  setHealthStatus(h);
                  setShowHealthPicker(false);
                }}
              >
                <View style={styles.healthRow}>
                  <View
                    style={[
                      styles.healthDot,
                      { backgroundColor: healthColor(h) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.pickerOptionText,
                      h === healthStatus && styles.pickerOptionTextActive,
                    ]}
                  >
                    {h}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View
        style={[styles.saveContainer, { paddingBottom: insets.bottom + 8 }]}
      >
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.8}
          testID="save-btn"
          disabled={isSaving}
        >
          <Text style={styles.saveBtnText}>
            {isSaving ? "Saving..." : "Save Beneficiary"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
