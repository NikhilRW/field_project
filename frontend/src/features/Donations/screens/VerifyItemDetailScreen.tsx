import React from "react";
import { UniImage } from "@/shared/components/UniComponents";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showMessage } from "react-native-flash-message";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import {
  useItemDonation,
  useRejectItemDonation,
  useVerifyItemDonation,
} from "../hooks/useDonations";
import type { DonationCategory, DonationVerificationStatus } from "../utils/api";
import { verifyItemsStyles as styles } from "../styles/verifyItemsStyles";

const categoryLabels: Record<DonationCategory, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  grocery: "Grocery",
  other_items: "Other",
};

const getStatusColor = (status: DonationVerificationStatus) => {
  if (status === "verified") {
    return { bg: Colors.secondaryLight, text: Colors.secondary };
  }

  if (status === "rejected") {
    return { bg: Colors.errorLight, text: Colors.error };
  }

  return { bg: Colors.primaryLight, text: Colors.primary };
};

export default function VerifyItemDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const itemId = id ?? "";
  const { data: item, isLoading, isError } = useItemDonation(itemId);
  const verifyMutation = useVerifyItemDonation();
  const rejectMutation = useRejectItemDonation();
  const isSubmitting = verifyMutation.isPending || rejectMutation.isPending;

  const handleVerify = async () => {
    if (!item || isSubmitting) {
      return;
    }

    try {
      await verifyMutation.mutateAsync(item.id);
      showMessage({
        message: "Item verified",
        description: "The item donation has been accepted.",
        type: "success",
      });
      router.back();
    } catch (error: any) {
      showMessage({
        message: "Unable to verify item",
        description: error?.message ?? "Please try again.",
        type: "danger",
      });
    }
  };

  const handleReject = () => {
    if (!item || isSubmitting) {
      return;
    }

    Alert.alert(
      "Reject item donation?",
      "Reject this only if the physical item does not match the image or cannot be accepted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              await rejectMutation.mutateAsync(item.id);
              showMessage({
                message: "Item rejected",
                description: "The donation request has been rejected.",
                type: "success",
              });
              router.back();
            } catch (error: any) {
              showMessage({
                message: "Unable to reject item",
                description: error?.message ?? "Please try again.",
                type: "danger",
              });
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <MeshGradientBackground>
        <View
          style={[
            styles.stateContainer,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <TouchableOpacity
            style={styles.backButtonFloating}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
          </TouchableOpacity>
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.stateText}>Loading item donation...</Text>
          </View>
        </View>
      </MeshGradientBackground>
    );
  }

  if (isError || !item) {
    return (
      <MeshGradientBackground>
        <View
          style={[
            styles.stateContainer,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <TouchableOpacity
            style={styles.backButtonFloating}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
          </TouchableOpacity>
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>
              Unable to load item donation. Please try again.
            </Text>
          </View>
        </View>
      </MeshGradientBackground>
    );
  }

  const statusColors = getStatusColor(item.verificationStatus);
  const canReview = item.verificationStatus === "unverified";

  return (
    <MeshGradientBackground>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.titleSection}>
            <Text style={styles.title}>{item.purpose}</Text>
            <Text style={styles.subtitle}>
              Compare this photo with the physical item before taking it from
              the donor.
            </Text>
          </View>

          <View style={styles.imageCard}>
            <UniImage
              source={{ uri: item.imageUrl ?? undefined }}
              style={styles.image}
              contentFit="scale-down"
            />
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Donor</Text>
              <Text style={styles.detailValue}>{item.donor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {categoryLabels[item.category]}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            <View
              style={[styles.statusPill, { backgroundColor: statusColors.bg }]}
            >
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {item.verificationStatus}
              </Text>
            </View>
          </View>

          {canReview ? (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.rejectButton,
                  isSubmitting && styles.actionButtonDisabled,
                ]}
                onPress={handleReject}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <XCircle size={18} color="#fff" strokeWidth={2.2} />
                <Text style={styles.actionText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.verifyButton,
                  isSubmitting && styles.actionButtonDisabled,
                ]}
                onPress={handleVerify}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <CheckCircle2 size={18} color="#fff" strokeWidth={2.2} />
                <Text style={styles.actionText}>Verify</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
