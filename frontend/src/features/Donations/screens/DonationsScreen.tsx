import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { CirclePlus, ChevronRight, PackageCheck, IndianRupee } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "@/shared/components/AppHeader";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { useAllDonations } from "../hooks/useDonations";
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

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<DonationCategory | "all">("all");

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

  const handleCardPress = (item: AllDonation) => {
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
        <View style={{ paddingHorizontal: 20 }}>
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

          {isLoading ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : filtered.length === 0 ? (
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
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {/* Implement Flatlist */}
              {filtered.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleCardPress(item)}
                  activeOpacity={0.75}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: "rgba(255,255,255,0.38)",
                    borderRadius: 14,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.82)",
                    marginBottom: 10,
                  }}
                >
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
                      <IndianRupee size={22} color={Colors.secondary} strokeWidth={2.2} />
                    ) : item.imageUrl ? (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{
                          width: 62,
                          height: 62,
                          borderRadius: 12,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <PackageCheck size={22} color={Colors.primary} strokeWidth={2.2} />
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
                      {item.category === "money" ? item.donor : `${item.donor} · ${item.date}`}
                    </Text>
                  </View>

                  <ChevronRight size={18} color={Colors.textTertiary} strokeWidth={2} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </MeshGradientBackground>
  );
}

export default function DonationsScreen() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  return isAdmin ? <AdminDonationsScreen /> : <DonatedItemsScreen showBackButton={false} />;
}
