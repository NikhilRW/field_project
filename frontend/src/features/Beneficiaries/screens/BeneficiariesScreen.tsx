import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Plus,
} from "lucide-react-native";
import AppHeader from "@/shared/components/AppHeader";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import type { Beneficiary } from "@/shared/types/mock";
import { useBeneficiaries } from "../hooks/useBeneficiaries";
import { beneficiaryFilterTabs } from "../constants/filterTabs";
import type { BeneficiaryFilterTab } from "../types/filter";
import {
  getCategoryBg,
  getCategoryColor,
  getHealthBg,
  getHealthColor,
} from "../utils/colors";
import { beneficiariesStyles as styles } from "../styles/beneficiariesStyles";

export default function BeneficiariesScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<BeneficiaryFilterTab>("All");
  const { data: beneficiaryList = [] } = useBeneficiaries();

  const filtered = beneficiaryList.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "All" || b.category === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: "transparent" },
        ]}
      >
        <AppHeader />

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Beneficiaries</Text>
            <Text style={styles.titleSub}>
              {beneficiaryList.length} people registered
            </Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
            ]}
          >
            <Search size={16} color={Colors.textTertiary} strokeWidth={1.8} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              placeholderTextColor={Colors.textTertiary}
              value={search}
              onChangeText={setSearch}
              testID="search-input"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
            ]}
            activeOpacity={0.7}
          >
            <SlidersHorizontal
              size={17}
              color={Colors.primary}
              strokeWidth={1.8}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {beneficiaryFilterTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
                activeTab === tab && styles.filterTabActive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
              testID={`filter-${tab}`}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === tab && styles.filterTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((b: Beneficiary) => (
            <TouchableOpacity
              key={b.id}
              style={[
                styles.card,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.35)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  elevation: 0,
                  shadowOpacity: 0,
                },
              ]}
              activeOpacity={0.7}
              testID={`beneficiary-${b.id}`}
            >
              <View style={[styles.avatar, { backgroundColor: b.color }]}>
                <Text style={styles.avatarText}>{b.initials}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{b.name}</Text>
                <Text style={styles.cardAge}>
                  {b.age} yrs · {b.address}
                </Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.catBadge,
                      { backgroundColor: getCategoryBg(b.category) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.catBadgeText,
                        { color: getCategoryColor(b.category) },
                      ]}
                    >
                      {b.category}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.healthBadge,
                      { backgroundColor: getHealthBg(b.healthStatus) },
                    ]}
                  >
                    <View
                      style={[
                        styles.healthDot,
                        { backgroundColor: getHealthColor(b.healthStatus) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.healthText,
                        { color: getHealthColor(b.healthStatus) },
                      ]}
                    >
                      {b.healthStatus}
                    </Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={15} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(main)/add-beneficiary")}
          activeOpacity={0.8}
          testID="add-fab"
        >
          <Plus size={22} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </MeshGradientBackground>
  );
}
