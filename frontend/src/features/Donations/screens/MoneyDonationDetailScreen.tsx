import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { donatedItemsStyles as styles } from "../styles/donatedItemsStyles";

const categoryLabels: Record<string, string> = {
  money: "Money",
  books: "Books",
  clothes: "Clothes",
  other_items: "Other items",
};

export default function MoneyDonationDetailScreen() {
  const insets = useSafeAreaInsets();
  const { amount, donor, category, date, status } = useLocalSearchParams<{
    amount: string;
    donor: string;
    category: string;
    date: string;
    status: string;
  }>();

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
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
            <Text
              style={{
                fontSize: 36,
                fontWeight: "700",
                color: Colors.textPrimary,
                textAlign: "center",
              }}
            >
              ₹{Number(amount).toLocaleString("en-IN")}
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 13,
                color: Colors.textSecondary,
                textAlign: "center",
              }}
            >
              Donated By {donor}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Donor</Text>
              <Text style={styles.detailValue}>{donor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {categoryLabels[category || "money"]}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Accepted</Text>
              <Text style={styles.detailValue}>{date}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>
                {status === "verified" ? "Verified" : status}
              </Text>
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </MeshGradientBackground>
  );
}
