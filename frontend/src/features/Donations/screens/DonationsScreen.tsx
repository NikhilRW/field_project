import React, { useCallback, useMemo, useState } from "react";
import { UniImage } from "@/shared/components/UniComponents";
import {
  ActivityIndicator,
  FlatList,
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
  PackageCheck,
  IndianRupee,
  ListChecks,
  X,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "@/shared/components/AppHeader";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { useAllDonations, useBatchMarkItemsDonated } from "../hooks/useDonations";
import type { AllDonation, DonationCategory } from "../utils/api";
import DonatedItemsScreen from "./DonatedItemsScreen";

const filters: { label: string; value: DonationCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Money", value: "money" },
  { label: "Clothes", value: "clothes" },
  { label: "Books", value: "books" },
  { label: "Others", value: "other_items" },
];

function AdminDonationsScreen() {
  const insets = useSafeAreaInsets();
  const { data: allDonations = [], isLoading } = useAllDonations();
  const batchMarkMutation = useBatchMarkItemsDonated();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<DonationCategory | "all">(
    "all",
  );
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filtered = useMemo(() => {
    let list = allDonations;
    if (activeFilter !== "all") {
      list = list.filter((d) => d.category === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.purpose.toLowerCase().includes(q) ||
          d.donor.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allDonations, activeFilter, search]);

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
      onSuccess: () => {
        exitSelectMode();
      },
    });
  }, [selectedIds, batchMarkMutation, exitSelectMode]);

  const handleCardPress = (item: AllDonation) => {
    if (selectMode) {
      if (item.category !== "money") {
        toggleSelectItem(item.id);
      }
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

  return (
    <MeshGradientBackground>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <AppHeader />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.35)",
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.8)",
                paddingHorizontal: 14,
                height: 44,
              }}
            >
              <TextInput
                placeholder="Search Donations By Item Name Or Person"
                placeholderTextColor={Colors.textTertiary}
                value={search}
                onChangeText={setSearch}
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: Colors.textPrimary,
                }}
              />
            </View>
            {selectMode ? (
              <>
                <TouchableOpacity
                  onPress={exitSelectMode}
                  activeOpacity={0.75}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.35)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.8)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={20} color={Colors.textPrimary} strokeWidth={2.2} />
                </TouchableOpacity>
                {selectedIds.size > 0 && (
                  <TouchableOpacity
                    onPress={() => setShowConfirmModal(true)}
                    activeOpacity={0.75}
                    style={{
                      height: 44,
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      backgroundColor: "#16a34a",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 6,
                    }}
                  >
                    <Check size={18} color="#fff" strokeWidth={2.5} />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      {selectedIds.size}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                onPress={() => setSelectMode(true)}
                activeOpacity={0.75}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "rgba(255,255,255,0.35)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.8)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ListChecks
                  size={20}
                  color={Colors.textPrimary}
                  strokeWidth={2.2}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.push("/(main)/donate")}
              activeOpacity={0.75}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CirclePlus size={20} color="#fff" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
              ListEmptyComponent={
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.38)",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.82)",
                    padding: 28,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                    No donations found
                  </Text>
                </View>
              }
              ListHeaderComponent={
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                  style={{ marginBottom: 8 }}
                >
                  {filters.map((f) => {
                    const isActive = activeFilter === f.value;
                    return (
                      <TouchableOpacity
                        key={f.value}
                        onPress={() => setActiveFilter(f.value)}
                        activeOpacity={0.75}
                        style={{
                          flexShrink: 0,
                          height: 36,
                          borderRadius: 999,
                          paddingHorizontal: 16,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isActive
                            ? Colors.primary
                            : "rgba(255,255,255,0.34)",
                          borderWidth: 1,
                          borderColor: isActive
                            ? Colors.primary
                            : "rgba(255,255,255,0.72)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: isActive ? "#fff" : Colors.textSecondary,
                          }}
                        >
                          {f.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              }
              renderItem={({ item }) => {
                const isSelected = selectedIds.has(item.id);
                const isItem = item.category !== "money";

                return (
                  <TouchableOpacity
                    onPress={() => handleCardPress(item)}
                    activeOpacity={0.75}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      backgroundColor: isSelected
                        ? "rgba(22,163,74,0.15)"
                        : "rgba(255,255,255,0.38)",
                      borderRadius: 14,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: isSelected
                        ? "#16a34a"
                        : "rgba(255,255,255,0.82)",
                      marginBottom: 10,
                    }}
                  >
                    {selectMode && isItem && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          borderWidth: 2,
                          borderColor: isSelected ? "#16a34a" : Colors.textTertiary,
                          backgroundColor: isSelected ? "#16a34a" : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && (
                          <Check size={14} color="#fff" strokeWidth={3} />
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          item.category === "money"
                            ? Colors.secondaryLight
                            : Colors.inputBg,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.78)",
                      }}
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
                          style={{
                            width: 62,
                            height: 62,
                            borderRadius: 12,
                          }}
                          contentFit="cover"
                        />
                      ) : (
                        <PackageCheck
                          size={22}
                          color={Colors.primary}
                          strokeWidth={2.2}
                        />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: Colors.textPrimary,
                        }}
                        numberOfLines={1}
                      >
                        {item.category === "money"
                          ? `₹${item.amount.toLocaleString("en-IN")}`
                          : item.purpose}
                      </Text>
                      <Text
                        style={{
                          marginTop: 3,
                          fontSize: 12,
                          color: Colors.textTertiary,
                        }}
                        numberOfLines={1}
                      >
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
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 24,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: 8,
              }}
            >
              Mark as Donated
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                lineHeight: 20,
                marginBottom: 24,
              }}
            >
              Are you sure you want to mark {selectedIds.size} item
              {selectedIds.size !== 1 ? "s" : ""} as donated? This action can be
              undone later.
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.75}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "#f0f0f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#666",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmBatch}
                activeOpacity={0.75}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "#16a34a",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {batchMarkMutation.isPending && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
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
