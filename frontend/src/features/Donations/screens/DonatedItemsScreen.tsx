import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Package,
  PackageCheck,
  Shirt,
  User,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { useDonatedItemDonations } from "../hooks/useDonations";
import type { DonationCategory, MyDonation } from "../utils/api";
import { donatedItemsStyles as styles } from "../styles/donatedItemsStyles";

type FilterCategory = "all" | Exclude<DonationCategory, "money">;

const categoryLabels: Record<DonationCategory, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  other_items: "Other items",
};

const filterOptions: Array<{
  value: FilterCategory;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "all",
    label: "All",
    icon: <PackageCheck size={15} color={Colors.primary} strokeWidth={2.2} />,
  },
  {
    value: "books",
    label: "Books",
    icon: <BookOpen size={15} color={Colors.primary} strokeWidth={2.2} />,
  },
  {
    value: "clothes",
    label: "Clothes",
    icon: <Shirt size={15} color={Colors.accent} strokeWidth={2.2} />,
  },
  {
    value: "other_items",
    label: "Other",
    icon: <Package size={15} color={Colors.error} strokeWidth={2.2} />,
  },
];

const chipColors: Record<FilterCategory, { bg: string; text: string }> = {
  all: { bg: Colors.primaryLight, text: Colors.primary },
  books: { bg: Colors.primaryLight, text: Colors.primary },
  clothes: { bg: Colors.accentLight, text: Colors.accent },
  other_items: { bg: Colors.errorLight, text: Colors.error },
};

type Props = {
  showBackButton?: boolean;
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

export default function DonatedItemsScreen({ showBackButton = true }: Props) {
  const insets = useSafeAreaInsets();
  const currentUser = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("all");
  const [myItemsOnly, setMyItemsOnly] = useState(false);

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

  const filteredItems = useMemo(() => {
    const categoryFiltered =
      selectedCategory === "all"
        ? items
        : items.filter((item) => item.category === selectedCategory);

    if (!myItemsOnly || !currentUser?.id) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((item) => item.donorId === currentUser.id);
  }, [items, selectedCategory, myItemsOnly, currentUser?.id]);

  if (isLoading) {
    return (
      <MeshGradientBackground>
        <View
          style={[
            styles.stateContainer,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
          ]}
        >
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButtonFloating}
              onPress={() => router.back()}
              activeOpacity={0.75}
            >
              <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
            </TouchableOpacity>
          )}
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
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButtonFloating}
              onPress={() => router.back()}
              activeOpacity={0.75}
            >
              <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
            </TouchableOpacity>
          )}
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
          data={filteredItems}
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
              {showBackButton && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                  activeOpacity={0.75}
                >
                  <ArrowLeft
                    size={20}
                    color={Colors.primary}
                    strokeWidth={2.2}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.titleSection}>
                <Text style={styles.title}>Donated Items</Text>
                <Text style={styles.subtitle}>
                  Browse item donations verified and accepted by the NGO.
                </Text>
              </View>

              <View style={styles.ownerToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.ownerToggleChip,
                    !myItemsOnly && styles.ownerToggleChipActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setMyItemsOnly(false)}
                >
                  <PackageCheck
                    size={15}
                    color={!myItemsOnly ? Colors.primary : Colors.textTertiary}
                    strokeWidth={2.2}
                  />
                  <Text
                    style={[
                      styles.ownerToggleLabel,
                      !myItemsOnly && styles.ownerToggleLabelActive,
                    ]}
                  >
                    All Items
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.ownerToggleChip,
                    myItemsOnly && styles.ownerToggleChipActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setMyItemsOnly(true)}
                >
                  <User
                    size={15}
                    color={myItemsOnly ? Colors.primary : Colors.textTertiary}
                    strokeWidth={2.2}
                  />
                  <Text
                    style={[
                      styles.ownerToggleLabel,
                      myItemsOnly && styles.ownerToggleLabelActive,
                    ]}
                  >
                    My Items
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {filterOptions.map((option) => {
                  const isActive = selectedCategory === option.value;
                  const colors = chipColors[option.value];

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterChip,
                        isActive && {
                          backgroundColor: colors.bg,
                          borderColor: colors.bg,
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={() => setSelectedCategory(option.value)}
                    >
                      {option.icon}
                      <Text
                        style={[
                          styles.filterChipLabel,
                          isActive && { color: colors.text },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.stateText}>
                {myItemsOnly
                  ? "You haven't donated any items yet."
                  : selectedCategory === "all"
                    ? "No verified item donations are available yet."
                    : `No ${categoryLabels[selectedCategory].toLowerCase()} donations yet.`}
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 32 }} />}
        />
      </View>
    </MeshGradientBackground>
  );
}
