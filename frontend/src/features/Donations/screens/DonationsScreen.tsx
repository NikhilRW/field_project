import React, { useCallback, useMemo, useState } from "react";
import { UniImage } from "@/shared/components/UniComponents";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  Check,
  CirclePlus,
  ChevronRight,
  FileEdit,
  PackageCheck,
  IndianRupee,
  ListChecks,
  X,
  BookOpen,
  Shirt,
  ShoppingCart,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "@/shared/components/AppHeader";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { donationsStyles as s } from "../styles/donationsStyles";
import {
  useAllDonations,
  useBatchMarkItemsDonated,
  useDrafts,
} from "../hooks/useDonations";
import type { AllDonation, DraftDonation } from "../utils/api";
import DonatedItemsScreen from "./DonatedItemsScreen";
import Animated, { LinearTransition } from "react-native-reanimated";

// TODO: abstract out this component in every way.

type DisplayItem =
  | (AllDonation & { __kind: "donation" })
  | (DraftDonation & { __kind: "draft" });

const filters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Money", value: "money" },
  { label: "Clothes", value: "clothes" },
  { label: "Books", value: "books" },
  { label: "Grocery", value: "grocery" },
  { label: "Others", value: "other_items" },
  { label: "Drafts", value: "drafts" },
];

function AdminDonationsScreen() {
  const insets = useSafeAreaInsets();
  const { data: allDonations = [], isLoading } = useAllDonations();
  const { data: drafts = [] } = useDrafts();
  const batchMarkMutation = useBatchMarkItemsDonated();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const isDraftsView = activeFilter === "drafts";
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const displayList = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matchesSearch = (text: string) =>
      !q || text.toLowerCase().includes(q);

    if (isDraftsView) {
      return drafts
        .filter((d) => !search.trim() || matchesSearch(d.purpose ?? ""))
        .map((d) => ({ ...d, __kind: "draft" as const }));
    }

    const draftItems: DisplayItem[] = drafts
      .filter((d) => {
        if (activeFilter !== "all" && d.category !== activeFilter) return false;
        if (search.trim()) return matchesSearch(d.purpose ?? "");
        return true;
      })
      .map((d) => ({ ...d, __kind: "draft" as const }));

    const donationItems: DisplayItem[] = allDonations
      .filter((d) => {
        if (activeFilter !== "all" && d.category !== activeFilter) return false;
        if (search.trim())
          return matchesSearch(d.purpose) || matchesSearch(d.donor);
        return true;
      })
      .map((d) => ({ ...d, __kind: "donation" as const }));

    return [...draftItems, ...donationItems];
  }, [allDonations, drafts, activeFilter, search, isDraftsView]);

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleConfirmBatch = useCallback(() => {
    setShowConfirmModal(false);
    batchMarkMutation.mutate(Array.from(selectedIds), {
      onSuccess: () => exitSelectMode(),
    });
  }, [selectedIds, batchMarkMutation, exitSelectMode]);

  const handleDonationPress = (item: AllDonation) => {
    if (selectMode) {
      if (item.category !== "money") toggleSelectItem(item.id);
      return;
    }
    if (item.category === "money") {
      router.push(
        `/(main)/donation/${item.id}?amount=${item.amount}&donor=${encodeURIComponent(item.donor)}&category=${item.category}&date=${item.date}&status=${item.verificationStatus}`,
      );
    } else {
      router.push(`/(main)/donatedItem/${item.id}`);
    }
  };

  const handleDraftPress = (draft: DraftDonation) => {
    router.push({ pathname: "/(main)/donate", params: { draftId: draft.id } });
  };

  return (
    <MeshGradientBackground>
      <View
        style={[
          s.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <AppHeader />
        <View style={s.content}>
          <View style={s.actionRow}>
            <View style={s.searchWrap}>
              <TextInput
                placeholder={
                  isDraftsView ? "Search drafts..." : "Search donations..."
                }
                placeholderTextColor={Colors.textTertiary}
                value={search}
                onChangeText={setSearch}
                style={s.searchInput}
              />
            </View>
            {!isDraftsView && selectMode ? (
              <>
                <TouchableOpacity
                  onPress={exitSelectMode}
                  activeOpacity={0.75}
                  style={s.glassyBtn}
                >
                  <X size={20} color={Colors.textPrimary} strokeWidth={2.2} />
                </TouchableOpacity>
                {selectedIds.size > 0 && (
                  <TouchableOpacity
                    onPress={() => setShowConfirmModal(true)}
                    activeOpacity={0.75}
                    style={s.batchBtn}
                  >
                    <Check size={18} color="#fff" strokeWidth={2.5} />
                    <Text style={s.batchBtnText}>{selectedIds.size}</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : !isDraftsView ? (
              <TouchableOpacity
                onPress={() => setSelectMode(true)}
                activeOpacity={0.75}
                style={s.glassyBtn}
              >
                <ListChecks
                  size={20}
                  color={Colors.textPrimary}
                  strokeWidth={2.2}
                />
              </TouchableOpacity>
            ) : null}
            {!isDraftsView && (
              <TouchableOpacity
                onPress={() => router.push("/(main)/donate")}
                activeOpacity={0.75}
                style={s.addBtn}
              >
                <CirclePlus size={20} color="#fff" strokeWidth={2.2} />
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <View style={s.loadingView}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <Animated.FlatList<DisplayItem>
              data={displayList}
              keyExtractor={(item) => `display-${item.id}`}
              itemLayoutAnimation={LinearTransition.springify()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.listPadding}
              ListEmptyComponent={
                <View style={s.emptyCard}>
                  <Text style={s.emptyText}>No donations found</Text>
                </View>
              }
              ListHeaderComponent={
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                  style={s.filterScroll}
                >
                  {filters.map((f) => {
                    const isActive = activeFilter === f.value;
                    return (
                      <TouchableOpacity
                        key={f.value}
                        onPress={() => setActiveFilter(f.value)}
                        activeOpacity={0.75}
                        style={[s.filterChip, isActive && s.filterChipActive]}
                      >
                        <Text
                          style={[
                            s.filterChipText,
                            isActive && s.filterChipTextActive,
                          ]}
                        >
                          {f.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              }
              renderItem={({ item }) => {
                if (item.__kind === "draft") {
                  return (
                    <TouchableOpacity
                      onPress={() => handleDraftPress(item)}
                      activeOpacity={0.75}
                      style={[s.card, s.draftCard]}
                    >
                      <View style={s.itemImage}>
                        {item.imageUrl ? (
                          <UniImage
                            source={{ uri: item.imageUrl }}
                            style={s.itemImageFilled}
                            contentFit="cover"
                          />
                        ) : item.category === "books" ? (
                          <BookOpen
                            size={22}
                            color={Colors.primary}
                            strokeWidth={2.2}
                          />
                        ) : item.category === "clothes" ? (
                          <Shirt
                            size={22}
                            color={Colors.accent}
                            strokeWidth={2.2}
                          />
                        ) : item.category === "grocery" ? (
                          <ShoppingCart
                            size={22}
                            color={Colors.error}
                            strokeWidth={2.2}
                          />
                        ) : (
                          <FileEdit
                            size={22}
                            color={Colors.primary}
                            strokeWidth={2.2}
                          />
                        )}
                      </View>
                      <View style={s.itemInfo}>
                        <Text style={s.itemTitle} numberOfLines={1}>
                          {item.purpose || "Untitled Draft"}
                        </Text>
                        <Text style={s.itemSub} numberOfLines={1}>
                          Draft · {item.createdAt?.split("T")[0] || ""}
                        </Text>
                      </View>
                      <ChevronRight
                        size={18}
                        color={Colors.textTertiary}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  );
                }

                const isSelected = selectedIds.has(item.id);
                const isItem = item.category !== "money";

                return (
                  <TouchableOpacity
                    onPress={() => handleDonationPress(item)}
                    activeOpacity={0.75}
                    style={[s.card, isSelected && s.cardSelected]}
                  >
                    {selectMode && isItem && (
                      <View
                        style={[s.checkbox, isSelected && s.checkboxChecked]}
                      >
                        {isSelected && (
                          <Check size={14} color="#fff" strokeWidth={3} />
                        )}
                      </View>
                    )}
                    <View
                      style={[
                        s.itemImage,
                        item.category === "money" && s.itemImageMoney,
                      ]}
                    >
                      {item.category === "money" ? (
                        <IndianRupee
                          size={22}
                          color={Colors.secondary}
                          strokeWidth={2.2}
                        />
                      ) : item.imageUrl ? (
                        <UniImage
                          source={{ uri: item.imageUrl }}
                          style={s.itemImageFilled}
                          contentFit="cover"
                        />
                      ) : item.category === "books" ? (
                        <BookOpen
                          size={22}
                          color={Colors.primary}
                          strokeWidth={2.2}
                        />
                      ) : item.category === "clothes" ? (
                        <Shirt
                          size={22}
                          color={Colors.accent}
                          strokeWidth={2.2}
                        />
                      ) : item.category === "grocery" ? (
                        <ShoppingCart
                          size={22}
                          color={Colors.error}
                          strokeWidth={2.2}
                        />
                      ) : (
                        <PackageCheck
                          size={22}
                          color={Colors.primary}
                          strokeWidth={2.2}
                        />
                      )}
                    </View>
                    <View style={s.itemInfo}>
                      <Text style={s.itemTitle} numberOfLines={1}>
                        {item.category === "money"
                          ? `₹${item.amount.toLocaleString("en-IN")}`
                          : item.purpose}
                      </Text>
                      <Text style={s.itemSub} numberOfLines={1}>
                        {item.category === "money"
                          ? item.donor
                          : `${item.donor} · ${item.date}`}
                      </Text>
                    </View>
                    {!selectMode && (
                      <ChevronRight
                        size={18}
                        color={Colors.textTertiary}
                        strokeWidth={2}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Mark as Donated</Text>
            <Text style={s.modalText}>
              Are you sure you want to mark {selectedIds.size} item
              {selectedIds.size !== 1 ? "s" : ""} as donated? This action can be
              undone later.
            </Text>
            <View style={s.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.75}
                style={[s.modalBtn, s.modalBtnCancel]}
              >
                <Text style={[s.modalBtnText, s.modalBtnTextCancel]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmBatch}
                activeOpacity={0.75}
                style={[s.modalBtn, s.modalBtnConfirm]}
              >
                <Text style={[s.modalBtnText, s.modalBtnTextConfirm]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {batchMarkMutation.isPending && (
        <View style={s.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </MeshGradientBackground>
  );
}

export default function DonationsScreen() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  return isAdmin ? (
    <AdminDonationsScreen />
  ) : (
    <DonatedItemsScreen showBackButton={false} />
  );
}
