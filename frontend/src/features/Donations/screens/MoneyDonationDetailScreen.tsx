import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { useDeleteDonation } from "../hooks/useDonations";
import { donatedItemsStyles as styles } from "../styles/donatedItemsStyles";

const categoryLabels: Record<string, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  other_items: "Other items",
};

export default function MoneyDonationDetailScreen() {
  const insets = useSafeAreaInsets();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const { mutate: deleteDonation, isPending: isDeleting } =
    useDeleteDonation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id, amount, donor, category, date, status } = useLocalSearchParams<{
    id?: string;
    amount: string;
    donor: string;
    category: string;
    date: string;
    status: string;
  }>();

  const handleDelete = () => {
    if (!id) return;
    deleteDonation(id);
    setShowDeleteModal(false);
    router.back();
  };

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.75}
            >
              <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity
                style={[styles.backButton, { borderColor: Colors.errorLight }]}
                onPress={() => setShowDeleteModal(true)}
                activeOpacity={0.75}
                disabled={isDeleting}
              >
                <Trash2 size={20} color={Colors.error} strokeWidth={2.2} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.titleSection}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "700",
                color: Colors.textPrimary,
                textAlign: "center",
              }}
            >
              ₹{Number(amount).toLocaleString("en-IN")}
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 13,
                color: Colors.textSecondary,
                textAlign: "center",
              }}
            >
              Donated By {donor}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Donor</Text>
              <Text style={styles.detailValue}>{donor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {categoryLabels[category || "money"]}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Accepted</Text>
              <Text style={styles.detailValue}>{date}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>
                {status === "verified" ? "Verified" : status}
              </Text>
            </View>
          </View>

          <Modal
            visible={showDeleteModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDeleteModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Delete Donation</Text>
                <Text style={styles.modalBody}>
                  Permanently delete this ₹{Number(amount).toLocaleString("en-IN")} donation? This cannot be undone.
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    activeOpacity={0.7}
                    onPress={() => setShowDeleteModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    activeOpacity={0.75}
                    onPress={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.modalConfirmText}>Delete</Text>
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
