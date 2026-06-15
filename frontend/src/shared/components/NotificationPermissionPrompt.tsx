import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Colors } from "@/shared/constants/color";
import { Bell } from "lucide-react-native";
import { requestNotificationPermission, registerFCMToken, registerWebServiceWorker } from "../utils/fcm";

export default function NotificationPermissionPrompt() {
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (Platform.OS !== "web" || dismissed) return null;

  const isDefault =
    typeof Notification !== "undefined" && Notification.permission === "default";
  if (!isDefault) return null;

  const handleEnable = async () => {
    setLoading(true);
    try {
      const granted = await Notification.requestPermission();
      if (granted === "granted") {
        await registerWebServiceWorker();
        await registerFCMToken();
      }
    } catch {}
    setLoading(false);
    setDismissed(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Bell size={18} color={Colors.primary} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Enable Notifications?</Text>
        <Text style={styles.body}>
          Get notified when activities are updated or assigned.
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.enableBtn, loading && { opacity: 0.6 }]}
        onPress={handleEnable}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.enableBtnText}>{loading ? "..." : "Enable"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => setDismissed(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.skipBtnText}>Not now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  enableBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  enableBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: "600",
  },
});
