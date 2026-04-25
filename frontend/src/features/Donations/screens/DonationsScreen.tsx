import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react-native";
import AppHeader from "@/shared/components/AppHeader";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { useDonations, useMonthlyDonations } from "../hooks/useDonations";
import { MAX_CHART_HEIGHT } from "../constants/chart";
import { getDonationTotals, getMonthlyMaxValue } from "../utils/aggregates";
import { donationsStyles as styles } from "../styles/donationsStyles";

export default function DonationsScreen() {
  const insets = useSafeAreaInsets();
  const { data: donationItems = [] } = useDonations();
  const { data: monthlyItems = [] } = useMonthlyDonations();

  const { received: totalReceived, spent: totalSpent } =
    getDonationTotals(donationItems);
  const maxVal = monthlyItems.length > 0 ? getMonthlyMaxValue(monthlyItems) : 1;

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top,paddingBottom:insets.bottom + 20, backgroundColor: "transparent" },
        ]}
      >
        <AppHeader />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <Text style={styles.title}>Funds</Text>
            <Text style={styles.titleSub}>Track all donations & expenses</Text>
          </View>

          <View style={styles.summaryRow}>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  elevation: 0,
                  shadowOpacity: 0,
                },
              ]}
            >
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: Colors.secondaryLight },
                ]}
              >
                <ArrowDownLeft
                  size={15}
                  color={Colors.secondary}
                  strokeWidth={2}
                />
              </View>
              <Text style={styles.summaryLabel}>Received</Text>
              <Text style={[styles.summaryValue, { color: Colors.secondary }]}>
                ₹{totalReceived.toLocaleString("en-IN")}
              </Text>
            </View>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  elevation: 0,
                  shadowOpacity: 0,
                },
              ]}
            >
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: Colors.accentLight },
                ]}
              >
                <ArrowUpRight size={15} color={Colors.accent} strokeWidth={2} />
              </View>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>
                ₹{totalSpent.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: "rgba(255, 255, 255, 0.35)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.8)",
                elevation: 0,
                shadowOpacity: 0,
              },
            ]}
          >
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Monthly Overview</Text>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: Colors.secondary },
                    ]}
                  />
                  <Text style={styles.legendText}>In</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: Colors.accent },
                    ]}
                  />
                  <Text style={styles.legendText}>Out</Text>
                </View>
              </View>
            </View>
            <View style={styles.chart}>
              {monthlyItems.map((m, i) => {
                const receivedH = (m.received / maxVal) * MAX_CHART_HEIGHT;
                const spentH = (m.spent / maxVal) * MAX_CHART_HEIGHT;
                return (
                  <View key={i} style={styles.barGroup}>
                    <View style={styles.bars}>
                      <View
                        style={[
                          styles.bar,
                          styles.barReceived,
                          { height: receivedH },
                        ]}
                      />
                      <View
                        style={[
                          styles.bar,
                          styles.barSpent,
                          { height: spentH },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{m.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.transactionsTitle}>Recent Transactions</Text>

          {donationItems.map((d) => {
            const isIncoming = d.type === "incoming";
            return (
              <View
                key={d.id}
                style={[
                  styles.transRow,
                  {
                    backgroundColor: "rgba(255, 255, 255, 0.35)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    elevation: 0,
                    shadowOpacity: 0,
                  },
                ]}
                testID={`donation-${d.id}`}
              >
                <View
                  style={[
                    styles.transIcon,
                    {
                      backgroundColor: isIncoming
                        ? Colors.secondaryLight
                        : Colors.errorLight,
                    },
                  ]}
                >
                  {isIncoming ? (
                    <ArrowDownLeft
                      size={14}
                      color={Colors.secondary}
                      strokeWidth={2}
                    />
                  ) : (
                    <ArrowUpRight
                      size={14}
                      color={Colors.error}
                      strokeWidth={2}
                    />
                  )}
                </View>
                <View style={styles.transInfo}>
                  <Text style={styles.transDonor}>{d.donor}</Text>
                  <Text style={styles.transMeta}>
                    {d.purpose} · {d.date}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transAmount,
                    { color: isIncoming ? Colors.secondary : Colors.error },
                  ]}
                >
                  {isIncoming ? "+" : "-"}₹{d.amount.toLocaleString("en-IN")}
                </Text>
              </View>
            );
          })}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
