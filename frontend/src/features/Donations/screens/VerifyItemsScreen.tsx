import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { usePendingItemDonations } from "../hooks/useDonations";
import type { DonationCategory } from "../utils/api";
import { verifyItemsStyles as styles } from "../styles/verifyItemsStyles";

const categoryLabels: Record<DonationCategory, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  other_items: "Other items",
};

export default function VerifyItemsScreen() {
  const insets = useSafeAreaInsets();
  const {
    data: items = [],
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = usePendingItemDonations();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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
            <Text style={styles.stateText}>Loading item donations...</Text>
          </View>
        </View>
      </MeshGradientBackground>
    );
  }

  if (isError) {
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
              Unable to load item donations. Please try again.
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
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
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
            <Text style={styles.title}>Verify Items</Text>
            <Text style={styles.subtitle}>
              Review item donations when the donor brings the physical item to
              the NGO.
            </Text>
          </View>

          {items.length > 0 ? (
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemRow}
                activeOpacity={0.75}
                onPress={() =>
                  router.push(`/(main)/verify-item/${item.id}` as any)
                }
                testID={`verify-item-${item.id}`}
              >
                <Image
                  source={{ uri: item.imageUrl ?? undefined }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.purpose}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {categoryLabels[item.category]} · {item.date}
                  </Text>
                  <Text style={styles.donorText} numberOfLines={1}>
                    {item.donor}
                  </Text>
                </View>
                <ChevronRight size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.stateText}>
                No item donations are waiting for verification.
              </Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
