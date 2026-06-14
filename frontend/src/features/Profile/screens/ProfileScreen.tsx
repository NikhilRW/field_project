import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronRight, Phone, Mail, MapPin, Shield } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import BrandLogo from "@/shared/components/BrandLogo";
import { useAuthStore } from "@/shared/stores/authStore";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { useLogoutMutation } from "@/features/Auth/hooks/useAuthMutations";
import { buildProfileSettingsItems } from "../constants/settingsItems";
import { profileStyles as styles } from "../styles/profileStyles";
import EditNameModal from "../components/EditNameModal";

const getInitials = (name?: string | null) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const logoutMutation = useLogoutMutation();
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [editNameVisible, setEditNameVisible] = useState(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.replace("/(auth)/login");
  };

  const handleEditName = () => setEditNameVisible(true);

  const settingsItems = buildProfileSettingsItems(
    handleLogout,
    isAdmin,
    handleEditName,
  );

  return (
    <MeshGradientBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 40,
            backgroundColor: "transparent",
          },
        ]}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
                elevation: 0,
                shadowOpacity: 0,
              },
            ]}
          >
            <View style={styles.avatarSection}>
              <View
                style={[styles.orgAvatar, isAdmin && styles.orgAvatarBrand]}
              >
                {isAdmin ? (
                  <BrandLogo size={64} />
                ) : (
                  <Text style={styles.orgAvatarText}>
                    {getInitials(user?.name)}
                  </Text>
                )}
              </View>
              <View style={styles.verifiedBadge}>
                <Shield size={10} color="#fff" fill="#fff" />
              </View>
            </View>
            <Text style={styles.orgName}>
              {isAdmin ? "Helping Hands" : (user?.name ?? "User")}
            </Text>
            <Text style={styles.orgFullName}>
              {isAdmin ? "Samajik Seva Sanstha" : "Helping Hands User"}
            </Text>
            <Text style={styles.orgReg}>
              {isAdmin
                ? "Regd. NGO · Kalyan, Maharashtra"
                : "Registered User · Helping Hands"}
            </Text>

            <View style={styles.contactList}>
              {isAdmin ? (
                <>
                  <View style={styles.contactItem}>
                    <Phone
                      size={13}
                      color={Colors.textTertiary}
                      strokeWidth={1.6}
                    />
                    <Text style={styles.contactText}>+91 98765 43210</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Mail
                      size={13}
                      color={Colors.textTertiary}
                      strokeWidth={1.6}
                    />
                    <Text style={styles.contactText}>
                      helpinghand7887@gmail.com
                    </Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MapPin
                      size={13}
                      color={Colors.textTertiary}
                      strokeWidth={1.6}
                    />
                    <Text style={styles.contactText}>
                      Opp. Manali Palace, Chikanghar, Kalyan
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.contactItem}>
                  <Mail
                    size={13}
                    color={Colors.textTertiary}
                    strokeWidth={1.6}
                  />
                  <Text style={styles.contactText}>
                    {user?.email ?? "user@example.com"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {isAdmin ? (
            <View
              style={[
                styles.impactRow,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  elevation: 0,
                  shadowOpacity: 0,
                },
              ]}
            >
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>248</Text>
                <Text style={styles.impactLabel}>People</Text>
              </View>
              <View style={styles.impactDivider} />
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>64</Text>
                <Text style={styles.impactLabel}>Volunteers</Text>
              </View>
              <View style={styles.impactDivider} />
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>18</Text>
                <Text style={styles.impactLabel}>Programs</Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.sectionLabel}>Settings</Text>

          <View
            style={[
              styles.settingsCard,
              {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.5)",
                elevation: 0,
                shadowOpacity: 0,
              },
            ]}
          >
            {settingsItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.settingsRow,
                  i === settingsItems.length - 1 && styles.settingsRowLast,
                ]}
                onPress={item.onPress}
                activeOpacity={0.6}
                testID={`settings-${i}`}
              >
                <View
                  style={[
                    styles.settingsIconWrap,
                    { backgroundColor: item.iconBg },
                  ]}
                >
                  {item.icon}
                </View>
                <View style={styles.settingsTextWrap}>
                  <Text
                    style={[
                      styles.settingsLabel,
                      item.isLogout && styles.logoutText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.sub && (
                    <Text style={styles.settingsSub}>{item.sub}</Text>
                  )}
                </View>
                {!item.isLogout && (
                  <ChevronRight size={15} color={Colors.textTertiary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.footer}>SDG-3: Good Health & Well-Being</Text>
          <View style={{ height: 32 }} />
        </ScrollView>

        <EditNameModal
          visible={editNameVisible}
          currentName={user?.name ?? ""}
          onClose={() => setEditNameVisible(false)}
        />
      </View>
    </MeshGradientBackground>
  );
}
