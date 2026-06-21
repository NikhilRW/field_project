import React, { useCallback, useState } from "react";
import { UniImage } from "@/shared/components/UniComponents";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Hand,
  PackageCheck,
  RotateCcw,
  HelpingHand,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  useItemDonation,
  useToggleItemDonatedStatus,
} from "../hooks/useDonations";
import type { DonationCategory } from "../utils/api";
import { donatedItemsStyles as styles } from "../styles/donatedItemsStyles";

const categoryLabels: Record<DonationCategory, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  other_items: "Other items",
};

export default function DonatedItemDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const itemId = id ?? "";
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === "Admin";
  const { data: item, isLoading, isError } = useItemDonation(itemId);
  const { mutate: toggleDonated, isPending: isToggling } =
    useToggleItemDonatedStatus();
  const [showModal, setShowModal] = useState(false);

  const handleToggleDonated = useCallback(() => {
    if (!item) return;
    toggleDonated(item.id);
    setShowModal(false);
  }, [item, toggleDonated]);

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
            <Text style={styles.stateText}>Loading donated item...</Text>
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
              Unable to load this donated item. Please try again.
            </Text>
          </View>
        </View>
      </MeshGradientBackground>
    );
  }

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
              This item was physically checked and accepted by the NGO team.
            </Text>
          </View>

          <View style={styles.imageCard}>
            {item.imageUrl ? (
              <UniImage
                source={{ uri: item.imageUrl }}
                style={styles.image}
                contentFit="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <PackageCheck
                  size={34}
                  color={Colors.primary}
                  strokeWidth={2.2}
                />
              </View>
            )}
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
              <Text style={styles.detailLabel}>Accepted</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{item.verificationStatus}</Text>
            </View>
          </View>

          {isAdmin && (
            <>
              {item.isDonated ? (
                <TouchableOpacity
                  style={styles.donatedBadge}
                  onPress={() => setShowModal(true)}
                  activeOpacity={0.75}
                >
                  <Hand size={18} color={Colors.secondary} strokeWidth={2.2} />
                  <Text style={styles.donatedBadgeText}>
                    Handed over to beneficiary
                  </Text>
                  <View style={styles.editBadgeButton}>
                    <Text style={styles.editBadgeText}>Revert</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.donateButton}
                  activeOpacity={0.75}
                  onPress={() => setShowModal(true)}
                  disabled={isToggling}
                >
                  {isToggling ? (
                    <ActivityIndicator size="small" color={Colors.secondary} />
                  ) : (
                    <>
                      <HelpingHand
                        size={22}
                        color={Colors.secondary}
                        strokeWidth={2.2}
                      />
                      <Text style={styles.donateButtonText}>Donate Item</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}

          {!isAdmin && item.isDonated && (
            <View style={styles.donatedBadge}>
              <Hand size={18} color={Colors.secondary} strokeWidth={2.2} />
              <Text style={styles.donatedBadgeText}>
                Handed over to beneficiary
              </Text>
            </View>
          )}

          <Modal
            visible={showModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {item.isDonated
                    ? "Revert Donation Status"
                    : "Mark as Donated"}
                </Text>
                <Text style={styles.modalBody}>
                  {item.isDonated
                    ? `"${item.purpose}" will be marked as not donated and will appear in the available items list again.`
                    : `Confirm that "${item.purpose}" has been handed over to the beneficiary?`}
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    activeOpacity={0.7}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    activeOpacity={0.75}
                    onPress={handleToggleDonated}
                    disabled={isToggling}
                  >
                    {isToggling ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.modalConfirmText}>
                        {item.isDonated ? "Revert" : "Confirm"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
