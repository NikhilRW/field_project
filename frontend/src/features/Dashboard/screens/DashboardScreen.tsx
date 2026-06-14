import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AnimatedMeshGradient } from "@/shared/components/mesh-gradient";
import type { IMeshGradientColor } from "@/shared/components/mesh-gradient/types";
import {
  Users,
  CalendarDays,
  HandCoins,
  ChevronRight,
  Clock,
  ArrowUpRight,
  PackageCheck,
} from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import AppHeader from "@/shared/components/AppHeader";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import { useDashboard } from "../hooks/useDashboard";
import {
  getDashboardStatusBg,
  getDashboardStatusColor,
} from "../utils/statusColors";
import { dashboardStyles as styles } from "../styles/dashboardStyles";

const getFirstName = (name?: string | null) =>
  name?.trim().split(/\s+/)[0] ?? "User";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useDashboard();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);

  const { mutate } = useMutation({
    mutationKey: ["hello"],
    networkMode: "online",
  });

  useEffect(() => {
    mutate();
  }, []);

  const stats = data?.stats ?? {
    beneficiaries: 0,
    activities: 0,
    donations: 0,
  };
  const recentActivities = data?.recentActivities ?? [];
  const donationTotal = stats.donations ?? 0;

  const donationLabel =
    donationTotal > 0 ? `₹${(donationTotal / 100000).toFixed(2)}L` : "₹0";
  const greetingName = isAdmin ? "Admin" : getFirstName(user?.name);

  const meshColors: IMeshGradientColor[] = [
    { r: 0.92, g: 0.94, b: 1.0 },
    { r: 0.98, g: 0.92, b: 1.0 },
    { r: 0.9, g: 0.98, b: 1.0 },
    { r: 0.96, g: 0.94, b: 1.0 },
  ];

  const handleDonate = () => {
    router.push("/donations");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AnimatedMeshGradient
        colors={meshColors}
        speed={0.8}
        noise={0.2}
        blur={0.1}
        contrast={1.1}
        animated={true}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 40,
        }}
      >
        <AppHeader />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.greetingSection}
          >
            <Text style={styles.greetingSub}>Welcome back</Text>
            <Text style={styles.greeting}>Good Morning, {greetingName}</Text>
          </Animated.View>

          <View style={styles.statsGrid}>
            {isAdmin && (
              <Animated.View
                entering={ZoomIn.delay(200).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: Colors.primaryLight },
                  ]}
                >
                  <Users size={20} color={Colors.primary} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{stats.beneficiaries}</Text>
                <Text style={styles.statLabel}>Beneficiaries</Text>
              </Animated.View>
            )}

            <Animated.View
              entering={ZoomIn.delay(300).springify()}
              style={styles.statCard}
            >
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: Colors.secondaryLight },
                ]}
              >
                <CalendarDays
                  size={20}
                  color={Colors.secondary}
                  strokeWidth={2}
                />
              </View>
              <Text style={styles.statValue}>{stats.activities}</Text>
              <Text style={styles.statLabel}>Programs</Text>
            </Animated.View>
            {isAdmin ? (
              <Animated.View
                entering={ZoomIn.delay(500).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: Colors.errorLight },
                  ]}
                >
                  <HandCoins size={20} color={Colors.error} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{donationLabel}</Text>
                <Text style={styles.statLabel}>Donations</Text>
              </Animated.View>
            ) : null}
          </View>

          {!isAdmin ? (
            <Animated.View
              entering={FadeInDown.delay(560).springify()}
              style={styles.donateCard}
            >
              <View>
                <Text style={styles.donateEyebrow}>Support Helping Hands</Text>
                <Text style={styles.donateTitle}>Donate money or items</Text>
                <Text style={styles.donateBody}>
                  Give through Razorpay or submit books, clothes, and other
                  items for NGO verification.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.donateButton}
                onPress={handleDonate}
                activeOpacity={0.85}
                testID="donate-btn"
              >
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : null}

          {isAdmin ? (
            <Animated.View
              entering={FadeInDown.delay(600).springify()}
              style={styles.quickActionsRow}
            >
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push("/(main)/donatedItems" as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: Colors.accentLight },
                  ]}
                >
                  <PackageCheck
                    size={22}
                    color={Colors.accent}
                    strokeWidth={2}
                  />
                </View>
                <Text style={styles.quickActionLabel}>Donated Items</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push("/(main)/add-beneficiary")}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: Colors.primaryLight },
                  ]}
                >
                  <Users size={22} color={Colors.primary} strokeWidth={2} />
                </View>
                <Text style={styles.quickActionLabel}>Add Person</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push("/(main)/verify-items" as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: Colors.secondaryLight },
                  ]}
                >
                  <PackageCheck
                    size={22}
                    color={Colors.secondary}
                    strokeWidth={2}
                  />
                </View>
                <Text style={styles.quickActionLabel}>Verify Items</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeInDown.delay(600).springify()}
              style={styles.quickActionsRow}
            >
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push("/(tabs)/activities" as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: Colors.secondaryLight },
                  ]}
                >
                  <CalendarDays
                    size={22}
                    color={Colors.secondary}
                    strokeWidth={2}
                  />
                </View>
                <Text style={styles.quickActionLabel}>Activities</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push("/(tabs)/profile" as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: Colors.primaryLight },
                  ]}
                >
                  <Users size={22} color={Colors.primary} strokeWidth={2} />
                </View>
                <Text style={styles.quickActionLabel}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push("/(main)/donatedItems" as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: Colors.accentLight },
                  ]}
                >
                  <PackageCheck
                    size={22}
                    color={Colors.accent}
                    strokeWidth={2}
                  />
                </View>
                <Text style={styles.quickActionLabel}>Donated Items</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.delay(700).springify()}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push("/(tabs)/activities" as any)}
            >
              <Text style={styles.viewAllText}>See all</Text>
              <ArrowUpRight
                size={16}
                color={Colors.primary}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </Animated.View>

          {recentActivities.map((activity, index) => (
            <Animated.View
              key={activity.id}
              entering={FadeInRight.delay(800 + index * 100).springify()}
            >
              <TouchableOpacity
                style={styles.activityCard}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(`/(main)/activity/${activity.id}` as any)
                }
                testID={`activity-${activity.id}`}
              >
                <View style={styles.activityContent}>
                  <View style={styles.activityTop}>
                    <Text style={styles.activityName} numberOfLines={1}>
                      {activity.name}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: getDashboardStatusBg(
                            activity.status,
                          ),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getDashboardStatusColor(activity.status) },
                        ]}
                      >
                        {activity.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.activityMeta}>
                    <View style={styles.metaItem}>
                      <Clock
                        size={14}
                        color={Colors.textTertiary}
                        strokeWidth={2}
                      />
                      <Text style={styles.metaText}>{activity.date}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight
                  size={18}
                  color={Colors.textTertiary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </View>
  );
}
