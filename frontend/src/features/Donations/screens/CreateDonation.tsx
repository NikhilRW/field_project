import React, { useEffect, useMemo, useRef, useState } from "react";
import { UniImage } from "@/shared/components/UniComponents";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Banknote,
  BookOpen,
  Camera,
  CheckCircle2,
  CircleAlert,
  Package,
  Shirt,
  ShoppingCart,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { showMessage } from "react-native-flash-message";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { isDesktopBrowser, isWeb } from "@/shared/constants/platform";
import WebcamCaptureOverlay from "../components/WebcamCaptureOverlay";
import WebFileInput from "../components/WebFileInput";
import type { WebFileInputRef } from "../components/WebFileInput";
import PhotoSourcePicker from "../components/PhotoSourcePicker";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  useAllUsers,
  useCreateDraft,
  useCreateItemDonation,
  useCreateMoneyDonation,
  useDeleteDraft,
  useDraft,
  useSubmitDraft,
  useUpdateDraft,
} from "../hooks/useDonations";
import type {
  DonationCategory,
  CreateDraftPayload,
  UpdateDraftPayload,
} from "../utils/api";
import { createDonationScreenStyles as styles } from "../styles/createDonationScreenStyles";
import { UserListItem } from "../types/common";

type UserDonationType = DonationCategory;

type CapturedPhoto = {
  previewUri: string;
  imageUri: string;
  fileName?: string | null;
  fileType?: string | null;
};

const donationTypes: {
  value: UserDonationType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "money",
    label: "Money",
    icon: <Banknote size={17} color={Colors.secondary} strokeWidth={2.2} />,
  },
  {
    value: "books",
    label: "Books",
    icon: <BookOpen size={17} color={Colors.primary} strokeWidth={2.2} />,
  },
  {
    value: "clothes",
    label: "Clothes",
    icon: <Shirt size={17} color={Colors.accent} strokeWidth={2.2} />,
  },
  {
    value: "grocery",
    label: "Grocery",
    icon: <ShoppingCart size={17} color={Colors.accent} strokeWidth={2.2} />,
  },
  {
    value: "other_items",
    label: "Other items",
    icon: <Package size={17} color={Colors.error} strokeWidth={2.2} />,
  },
];

const normalizeAmount = (amount: string) =>
  Number(amount.replace(/,/g, "").trim());

export const CreateDonation = () => {
  const insets = useSafeAreaInsets();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const createItemDonationMutation = useCreateItemDonation();
  const createMoneyDonationMutation = useCreateMoneyDonation();
  const createDraftMutation = useCreateDraft();
  const updateDraftMutation = useUpdateDraft();
  const submitDraftMutation = useSubmitDraft();
  const deleteDraftMutation = useDeleteDraft();
  const { data: draftData } = useDraft(
    draftId,
    submitDraftMutation.isPending || deleteDraftMutation.isPending,
  );
  const { data: allUsers = [] } = useAllUsers();

  const currentUser = useAuthStore((state) => state.user);
  const isEditingDraft = Boolean(draftId);
  const [selectedType, setSelectedType] = useState<UserDonationType>(
    draftData?.category ?? "money",
  );
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState(draftData?.purpose ?? "");
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef<WebFileInputRef>(null);

  useEffect(() => {
    if (draftData && !initialized) {
      setInitialized(true);
      setSelectedType(draftData.category);
      setPurpose(draftData.purpose ?? "");
    }
  }, [draftData, initialized]);

  useEffect(() => {
    if (draftData?.donorId && allUsers.length > 0 && !selectedUser) {
      if (draftData.donorId === currentUser?.id) return;
      const match = allUsers.find((u) => u.id === draftData.donorId);
      if (match) {
        setSelectedUser(match);
        setUserSearch(match.name);
      }
    }
  }, [draftData?.donorId, allUsers, selectedUser, currentUser?.id]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return allUsers;
    const q = userSearch.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q),
    );
  }, [allUsers, userSearch]);

  const isMoney = selectedType === "money";
  const numericAmount = useMemo(() => normalizeAmount(amount), [amount]);
  const isSavingDraft =
    createDraftMutation.isPending || updateDraftMutation.isPending;
  const isSubmitting =
    createItemDonationMutation.isPending ||
    createMoneyDonationMutation.isPending ||
    submitDraftMutation.isPending ||
    deleteDraftMutation.isPending;

  const canSubmit = isEditingDraft
    ? isMoney
      ? Number.isFinite(numericAmount) &&
        numericAmount > 0 &&
        !isSubmitting &&
        (!isAdmin || selectedUser)
      : Boolean(draftId && !isSubmitting)
    : isMoney
      ? Number.isFinite(numericAmount) &&
        numericAmount > 0 &&
        !isSubmitting &&
        (!isAdmin || selectedUser)
      : Boolean(
          purpose.trim() &&
          !isSubmitting &&
          (!isAdmin || selectedUser),
        );

  const resetForm = () => {
    setAmount("");
    setPurpose("");
    setPhoto((prev) => {
      if (prev?.imageUri?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.imageUri);
      }
      return null;
    });
    setSelectedUser(null);
    setUserSearch("");
  };

  const handleCapturePhoto = async () => {
    if (isDesktopBrowser) {
      setShowSourcePicker(true);
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera permission needed",
        "Allow camera access to take a photo of the donation item.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleSaveDraft = async () => {
    if (isMoney) return;

    try {
      const hasNewPhoto = Boolean(
        photo?.imageUri && !/^https?:\/\//.test(photo.imageUri),
      );

      if (isEditingDraft && draftId) {
        const payload: UpdateDraftPayload = {
          category: selectedType as Exclude<DonationCategory, "money">,
          purpose: purpose.trim() || null,
        };
        if (hasNewPhoto) {
          payload.imageUri = photo!.imageUri;
          payload.fileName = photo!.fileName;
          payload.fileType = photo!.fileType;
        }
        await updateDraftMutation.mutateAsync({ id: draftId, payload });
      } else {
        const createPayload: CreateDraftPayload = {
          category: selectedType as Exclude<DonationCategory, "money">,
          purpose: purpose.trim() || null,
          donorId: selectedUser?.id,
        };
        if (hasNewPhoto) {
          createPayload.imageUri = photo!.imageUri;
          createPayload.fileName = photo!.fileName;
          createPayload.fileType = photo!.fileType;
        }
        await createDraftMutation.mutateAsync(createPayload);
      }

      showMessage({
        message: isEditingDraft ? "Draft updated" : "Draft saved",
        description: "You can continue editing later.",
        type: "success",
      });
      if (!isEditingDraft) resetForm();
    } catch (error: any) {
      showMessage({
        message: "Unable to save draft",
        description: error?.message ?? "Please try again.",
        type: "danger",
      });
    }
  };

  const handleSubmitDraft = async () => {
    if (!draftId) return;
    try {
      if (isMoney) {
        await createMoneyDonationMutation.mutateAsync({
          amount: numericAmount,
          purpose: purpose.trim() || "Donation",
          donorId: selectedUser?.id,
        });
        await deleteDraftMutation.mutateAsync(draftId);
      } else {
        const hasNewPhoto = Boolean(
          photo?.imageUri && !/^https?:\/\//.test(photo.imageUri),
        );
        const payload: UpdateDraftPayload = {
          purpose: purpose.trim() || null,
          category: selectedType as Exclude<DonationCategory, "money">,
        };
        if (hasNewPhoto) {
          payload.imageUri = photo!.imageUri;
          payload.fileName = photo!.fileName;
          payload.fileType = photo!.fileType;
        }
        await updateDraftMutation.mutateAsync({ id: draftId, payload });
        await submitDraftMutation.mutateAsync(draftId);
      }
      showMessage({
        message: "Donation submitted",
        description: isMoney
          ? "Money donation recorded from draft."
          : "Draft has been converted to a donation.",
        type: "success",
      });
      router.back();
    } catch (error: any) {
      showMessage({
        message: "Unable to submit",
        description: error?.message ?? "Please try again.",
        type: "danger",
      });
    }
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

  const handleSubmitItemDonation = async () => {
    if (isMoney || !purpose.trim()) {
      showMessage({
        message: "Missing details",
        description: "Add item details before submitting.",
        type: "warning",
      });
      return;
    }

    try {
      await createItemDonationMutation.mutateAsync({
        category: selectedType,
        purpose: purpose.trim(),
        ...(photo?.imageUri
          ? {
              imageUri: photo.imageUri,
              fileName: photo.fileName,
              fileType: photo.fileType,
            }
          : {}),
        donorId: selectedUser?.id,
      });

      showMessage({
        message: "Donation submitted",
        description: "The NGO team will verify the item at handover.",
        type: "success",
      });
      resetForm();
    } catch (error: any) {
      showMessage({
        message: "Unable to submit donation",
        description: error?.message ?? "Please try again.",
        type: "danger",
      });
    }
  };

  const handleSubmitMoneyDonation = async () => {
    if (!isMoney || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      showMessage({
        message: "Invalid amount",
        description: "Enter a valid amount to donate.",
        type: "warning",
      });
      return;
    }

    try {
      await createMoneyDonationMutation.mutateAsync({
        amount: numericAmount,
        purpose: purpose.trim() || "Helping Hands Donation",
        donorId: selectedUser?.id,
      });

      showMessage({
        message: "Donation created",
        description: "The donation has been recorded successfully.",
        type: "success",
      });
      resetForm();
    } catch (error: any) {
      showMessage({
        message: "Unable to create donation",
        description: error?.message ?? "Please try again.",
        type: "danger",
      });
    }
  };

  const handleSubmit = () => {
    if (isMoney) {
      handleSubmitMoneyDonation();
      return;
    }

    handleSubmitItemDonation();
  };

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: !isWeb ? insets.bottom + 20 : 0,
            backgroundColor: "transparent",
          },
        ]}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.navigate("/donations")}
              style={styles.backButton}
              activeOpacity={0.75}
            >
              <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
            </TouchableOpacity>
            {!isMoney && (
              <TouchableOpacity
                style={[
                  styles.saveDraftBtn,
                  isSavingDraft && styles.saveDraftBtnDisabled,
                ]}
                onPress={handleSaveDraft}
                activeOpacity={0.75}
                disabled={isSavingDraft}
              >
                {isSavingDraft ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveDraftBtnText}>
                    {isEditingDraft ? "Update Draft" : "Save Draft"}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Donate</Text>
            <Text style={styles.titleSub}>
              Support the NGO with money or verified item donations
            </Text>
          </View>

          {isAdmin && (
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Donating on behalf of</Text>
              <TouchableOpacity
                style={styles.inputWrap}
                onPress={() => setShowUserDropdown(!showUserDropdown)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.input,
                    { paddingVertical: 14 },
                    !selectedUser && { color: Colors.textTertiary },
                  ]}
                >
                  {selectedUser
                    ? `${selectedUser.name} (${selectedUser.email ?? selectedUser.phone})`
                    : "Select a user (optional)"}
                </Text>
              </TouchableOpacity>
              {showUserDropdown && (
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.92)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.82)",
                    maxHeight: 220,
                    overflow: "hidden",
                  }}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(255,255,255,0.6)",
                      },
                    ]}
                    placeholder="Search by name or email..."
                    placeholderTextColor={Colors.textTertiary}
                    value={userSearch}
                    onChangeText={setUserSearch}
                  />
                  <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: "rgba(255,255,255,0.4)",
                          backgroundColor:
                            selectedUser?.id === item.id
                              ? Colors.primaryLight
                              : "transparent",
                        }}
                        onPress={() => {
                          setSelectedUser(
                            selectedUser?.id === item.id ? null : item,
                          );
                          setShowUserDropdown(false);
                          setUserSearch("");
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: Colors.textPrimary,
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Colors.textTertiary,
                            marginTop: 1,
                          }}
                        >
                          {item.email ?? item.phone}
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text
                        style={{
                          fontSize: 13,
                          color: Colors.textTertiary,
                          textAlign: "center",
                          paddingVertical: 14,
                        }}
                      >
                        No users found
                      </Text>
                    }
                  />
                </View>
              )}
            </View>
          )}

          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Donation type</Text>
            <View style={styles.typeGrid}>
              {donationTypes.map((type) => {
                const isActive = selectedType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeButton,
                      isActive && styles.typeButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedType(type.value);
                      if (!isEditingDraft) setPhoto(null);
                    }}
                    activeOpacity={0.8}
                    testID={`donation-type-${type.value}`}
                  >
                    <View style={styles.typeIcon}>{type.icon}</View>
                    <Text style={styles.typeLabel}>{type.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>
              {isMoney ? "Payment details" : "Item details"}
            </Text>

            {isMoney ? (
              <>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="₹0"
                    placeholderTextColor={Colors.textTertiary}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    testID="donation-amount-input"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.label}>Photo (optional)</Text>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handleCapturePhoto}
                  activeOpacity={0.82}
                  testID="donation-photo-button"
                >
                  {photo?.previewUri || draftData?.imageUrl ? (
                    <UniImage
                      source={{
                        uri: photo?.previewUri || draftData!.imageUrl!,
                      }}
                      style={styles.photoPreview}
                      contentFit="cover"
                    />
                  ) : (
                    <>
                      <View style={styles.photoPlaceholderIcon}>
                        <Camera
                          size={20}
                          color={Colors.primary}
                          strokeWidth={2.2}
                        />
                      </View>
                      <Text style={styles.photoTitle}>Take item photo</Text>
                      <Text style={styles.photoSub}>
                        Helps with handover verification
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.label}>
              {isMoney ? "Purpose" : "Item description"}
            </Text>
            <View style={[styles.inputWrap, styles.textAreaWrap]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={
                  isMoney
                    ? "General donation, education support..."
                    : "Describe the books, clothes, or item condition"
                }
                placeholderTextColor={Colors.textTertiary}
                value={purpose}
                onChangeText={setPurpose}
                multiline
                numberOfLines={4}
                testID="donation-purpose-input"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
              onPress={isEditingDraft ? handleSubmitDraft : handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.85}
              testID="submit-donation-button"
            >
              {isEditingDraft ? (
                <CheckCircle2 size={18} color="#fff" strokeWidth={2.2} />
              ) : isMoney ? (
                <Banknote size={18} color="#fff" strokeWidth={2.2} />
              ) : (
                <CheckCircle2 size={18} color="#fff" strokeWidth={2.2} />
              )}
              <Text style={styles.submitButtonText}>
                {isSubmitting
                  ? "Processing..."
                  : isEditingDraft
                    ? "Submit Draft"
                    : "Create donation"}
              </Text>
            </TouchableOpacity>

            <View style={styles.helperRow}>
              <CircleAlert
                size={15}
                color={isMoney ? Colors.secondary : Colors.accent}
                strokeWidth={2.2}
              />
              <Text style={styles.helperText}>
                {isMoney
                  ? "Successful payments are marked paid and verified automatically."
                  : "Item donations are marked verified upon creation."}
              </Text>
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

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
    </MeshGradientBackground>
  );
};
