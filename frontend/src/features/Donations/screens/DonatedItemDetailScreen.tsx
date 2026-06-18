import React, { useCallback } from "react";
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
import { ArrowLeft, Hand, PackageCheck } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { useItemDonation, useMarkItemAsDonated } from "../hooks/useDonations";
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
  const { mutate: markDonated, isPending: isMarking } =
    useMarkItemAsDonated();

  const handleMarkDonated = useCallback(() => {
    if (!item || item.isDonated) return;

    Alert.alert(
      "Mark as Donated",
      `Confirm that "${item.purpose}" has been handed over to the beneficiary?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => markDonated(item.id),
        },
      ],
    );
  }, [item, markDonated]);

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

          {isAdmin && !item.isDonated && (
            <TouchableOpacity
              style={styles.donateButton}
              activeOpacity={0.75}
              onPress={handleMarkDonated}
              disabled={isMarking}
            >
              {isMarking ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Hand size={20} color="#fff" strokeWidth={2.2} />
                  <Text style={styles.donateButtonText}>
                    Mark as Donated
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {item.isDonated && (
            <View style={styles.donatedBadge}>
              <Hand size={18} color={Colors.secondary} strokeWidth={2.2} />
              <Text style={styles.donatedBadgeText}>
                Handed over to beneficiary
              </Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
