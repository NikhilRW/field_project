import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Colors } from "@/shared/constants/color";
import { Bell } from "lucide-react-native";
import { registerFCMToken, registerWebServiceWorker } from "../utils/fcm";
import { styles } from "../styles/notificationPermissionPromptStyles";

export default function NotificationPermissionPrompt() {
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (Platform.OS !== "web" || dismissed) return null;

  const isDefault =
    typeof Notification !== "undefined" &&
    Notification.permission === "default";
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
