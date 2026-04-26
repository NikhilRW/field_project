import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { ArrowLeft, ChevronRight, PackageCheck } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useDonatedItemDonations } from "../hooks/useDonations";
import type { DonationCategory, MyDonation } from "../utils/api";
import { donatedItemsStyles as styles } from "../styles/donatedItemsStyles";

const categoryLabels: Record<DonationCategory, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  other_items: "Other items",
};

function DonatedItemRow({ item }: { item: MyDonation }) {
  return (
    <TouchableOpacity
      style={styles.itemCard}
      activeOpacity={0.75}
      onPress={() => router.push(`/(main)/donatedItem/${item.id}` as any)}
      testID={`donated-item-${item.id}`}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <PackageCheck size={22} color={Colors.primary} strokeWidth={2.2} />
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.purpose}
        </Text>
        <Text style={styles.itemMeta}>
          {categoryLabels[item.category]} · {item.date}
        </Text>
        <Text style={styles.donorText} numberOfLines={1}>
          Donated by {item.donor}
        </Text>
      </View>
      <ChevronRight size={18} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
}

export default function DonatedItemsScreen() {
  const insets = useSafeAreaInsets();
  const {
    data: items = [],
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useDonatedItemDonations();

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
            <Text style={styles.stateText}>Loading donated items...</Text>
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
              Unable to load donated items. Please try again.
            </Text>
          </View>
        </View>
      </MeshGradientBackground>
    );
  }

  return (
    <MeshGradientBackground>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DonatedItemRow item={item} />}
          contentContainerStyle={[
            styles.listContent,
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
          ListHeaderComponent={
            <>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.75}
              >
                <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
              </TouchableOpacity>

              <View style={styles.titleSection}>
                <Text style={styles.title}>Donated Items</Text>
                <Text style={styles.subtitle}>
                  Browse item donations verified and accepted by the NGO.
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.stateText}>
                No verified item donations are available yet.
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 32 }} />}
        />
      </View>
    </MeshGradientBackground>
  );
}
