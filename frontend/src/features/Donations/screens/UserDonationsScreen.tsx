import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Banknote,
  BookOpen,
  Camera,
  CheckCircle2,
  CircleAlert,
  Package,
  Shirt,
} from "lucide-react-native";
import { showMessage } from "react-native-flash-message";
import AppHeader from "@/shared/components/AppHeader";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  useCreateItemDonation,
  useCreateMoneyDonationOrder,
  useMyDonations,
  useVerifyMoneyDonation,
} from "../hooks/useDonations";
import type {
  DonationCategory,
  DonationPaymentStatus,
  DonationVerificationStatus,
  MyDonation,
} from "../utils/api";
import { userDonationsStyles as styles } from "../styles/userDonationsStyles";

type UserDonationType = DonationCategory;

type CapturedPhoto = {
  previewUri: string;
  imageUri: string;
  fileName?: string | null;
  fileType?: string | null;
};

type RazorpayPaymentSuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const donationTypes: Array<{
  value: UserDonationType;
  label: string;
  icon: React.ReactNode;
}> = [
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
    value: "other_items",
    label: "Other items",
    icon: <Package size={17} color={Colors.error} strokeWidth={2.2} />,
  },
];

const categoryLabels: Record<DonationCategory, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  other_items: "Other items",
};

const getStatusColors = (
  status: DonationVerificationStatus | DonationPaymentStatus,
) => {
  if (status === "verified" || status === "paid") {
    return { bg: Colors.secondaryLight, text: Colors.secondary };
  }

  if (status === "failed" || status === "rejected") {
    return { bg: Colors.errorLight, text: Colors.error };
  }

  if (status === "pending") {
    return { bg: Colors.accentLight, text: Colors.accent };
  }

  return { bg: Colors.primaryLight, text: Colors.primary };
};

const normalizeAmount = (amount: string) =>
  Number(amount.replace(/,/g, "").trim());

const formatCategory = (category: DonationCategory) => categoryLabels[category];

function DonationHistoryRow({ donation }: { donation: MyDonation }) {
  const isMoney = donation.category === "money";
  const verificationColors = getStatusColors(donation.verificationStatus);
  const paymentColors = getStatusColors(donation.paymentStatus);

  return (
    <View style={styles.historyRow} testID={`my-donation-${donation.id}`}>
      <View style={styles.historyIcon}>
        {isMoney ? (
          <Banknote size={18} color={Colors.secondary} strokeWidth={2.2} />
        ) : (
          <Package size={18} color={Colors.primary} strokeWidth={2.2} />
        )}
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle} numberOfLines={1}>
          {donation.purpose}
        </Text>
        <Text style={styles.historyMeta}>
          {formatCategory(donation.category)} · {donation.date}
        </Text>
        <View style={styles.statusPills}>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: verificationColors.bg },
            ]}
          >
            <Text
              style={[styles.statusText, { color: verificationColors.text }]}
            >
              {donation.verificationStatus}
            </Text>
          </View>
          {donation.paymentStatus !== "not_applicable" ? (
            <View
              style={[styles.statusPill, { backgroundColor: paymentColors.bg }]}
            >
              <Text style={[styles.statusText, { color: paymentColors.text }]}>
                {donation.paymentStatus}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {isMoney ? (
        <Text style={styles.amountText}>
          ₹{donation.amount.toLocaleString("en-IN")}
        </Text>
      ) : null}
    </View>
  );
}

export const UserDonationsScreen = () => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const {
    data: myDonationPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching: isMyDonationsRefetching,
    refetch: refetchMyDonations,
  } = useMyDonations();
  const createItemDonationMutation = useCreateItemDonation();
  const createMoneyOrderMutation = useCreateMoneyDonationOrder();
  const verifyMoneyDonationMutation = useVerifyMoneyDonation();

  const [selectedType, setSelectedType] = useState<UserDonationType>("money");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  
  const isMoney = selectedType === "money";
  const myDonations = useMemo(
    () => myDonationPages?.pages.flatMap((page) => page.items) ?? [],
    [myDonationPages],
  );
  const totalMyDonations =
    myDonationPages?.pages[0]?.total ?? myDonations.length;
  const numericAmount = useMemo(() => normalizeAmount(amount), [amount]);
  const isSubmitting =
    createItemDonationMutation.isPending ||
    createMoneyOrderMutation.isPending ||
    verifyMoneyDonationMutation.isPending;

  const canSubmit = isMoney
    ? Number.isFinite(numericAmount) && numericAmount > 0 && !isSubmitting
    : Boolean(purpose.trim() && photo?.imageUri && !isSubmitting);

  const resetForm = () => {
    setAmount("");
    setPurpose("");
    setPhoto(null);
  };
  


  const handleCapturePhoto = async () => {
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

  const handleSubmitItemDonation = async () => {
    if (isMoney || !photo?.imageUri || !purpose.trim()) {
      showMessage({
        message: "Missing details",
        description: "Add item details and take a photo before submitting.",
        type: "warning",
      });
      return;
    }

    try {
      await createItemDonationMutation.mutateAsync({
        category: selectedType,
        purpose: purpose.trim(),
        imageUri: photo.imageUri,
        fileName: photo.fileName,
        fileType: photo.fileType,
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

    if (Platform.OS === "web") {
      showMessage({
        message: "Payment unavailable",
        description: "Razorpay checkout is available in the mobile app.",
        type: "warning",
      });
      return;
    }

    try {
      const order = await createMoneyOrderMutation.mutateAsync({
        amount: numericAmount,
        purpose: purpose.trim() || "Helping Hands Donation",
      });

      const RazorpayCheckout = (
        await import("react-native-razorpay")
      ).default;
      const payment = (await RazorpayCheckout.open({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Helping Hands",
        description: order.purpose,
        order_id: order.orderId,
        prefill: {
          name: order.donorName,
          email: user?.email,
        },
        theme: {
          color: Colors.primary,
        },
      })) as RazorpayPaymentSuccess;

      await verifyMoneyDonationMutation.mutateAsync({
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpaySignature: payment.razorpay_signature,
      });

      showMessage({
        message: "Donation completed",
        description: "Your payment was verified successfully.",
        type: "success",
      });
      resetForm();
    } catch (error: any) {
      showMessage({
        message: "Payment not completed",
        description: error?.description ?? error?.message ?? "Please try again.",
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
            paddingBottom: insets.bottom + 20,
            backgroundColor: "transparent",
          },
        ]}
      >
        <AppHeader />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isMyDonationsRefetching && !isFetchingNextPage}
              onRefresh={refetchMyDonations}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleSection}>
            <Text style={styles.title}>Donate</Text>
            <Text style={styles.titleSub}>
              Support the NGO with money or verified item donations
            </Text>
          </View>

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
                      setPhoto(null);
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
                <Text style={styles.label}>Photo</Text>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handleCapturePhoto}
                  activeOpacity={0.82}
                  testID="donation-photo-button"
                >
                  {photo?.previewUri ? (
                    <Image
                      source={{ uri: photo.previewUri }}
                      style={styles.photoPreview}
                      resizeMode="cover"
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
                        Required before handover verification
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
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.85}
              testID="submit-donation-button"
            >
              {isMoney ? (
                <Banknote size={18} color="#fff" strokeWidth={2.2} />
              ) : (
                <CheckCircle2 size={18} color="#fff" strokeWidth={2.2} />
              )}
              <Text style={styles.submitButtonText}>
                {isSubmitting
                  ? "Processing..."
                  : isMoney
                    ? "Pay with Razorpay"
                    : "Submit for verification"}
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
                  : "Item donations stay unverified until the NGO team checks them at handover."}
              </Text>
            </View>
          </View>

          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>My donations</Text>
            <Text style={styles.historyCount}>{totalMyDonations} total</Text>
          </View>

          {myDonations.length > 0 ? (
            <>
              {myDonations.map((donation) => (
                <DonationHistoryRow key={donation.id} donation={donation} />
              ))}
              {hasNextPage ? (
                <TouchableOpacity
                  style={[
                    styles.loadMoreButton,
                    isFetchingNextPage && styles.loadMoreButtonDisabled,
                  ]}
                  onPress={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  activeOpacity={0.82}
                  testID="load-more-donations-button"
                >
                  <Text style={styles.loadMoreText}>
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </>
          ) : (
            <View style={[styles.panel, styles.emptyPanel]}>
              <Text style={styles.emptyText}>No donations yet</Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
