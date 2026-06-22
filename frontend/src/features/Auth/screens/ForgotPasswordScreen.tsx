import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Mail, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { Colors } from "@/shared/constants/color";
import { useForgotPasswordMutation } from "../hooks/useAuthMutations";
import BrandLogo from "@/shared/components/BrandLogo";
import { showAppMessage } from "@/shared/utils/flashMessage";
import { loginStyles as styles } from "../styles/loginStyles";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const forgotMutation = useForgotPasswordMutation();

  const handleSubmit = async () => {
    try {
      if (!email.trim()) {
        showAppMessage({
          message: "Missing email",
          description: "Please enter your email address.",
          type: "warning",
        });
        return;
      }
      await forgotMutation.mutateAsync(email.trim());
      showAppMessage({
        message: "Check your email",
        description: "If an account exists for this email, a 6-digit OTP has been sent to your email address.",
        type: "success",
      });
      router.replace(`/(auth)/reset-password?email=${encodeURIComponent(email.trim())}` as any);
    } catch (error: any) {
      showAppMessage({
        message: "Request failed",
        description: error?.message ?? "Unable to send reset email. Please try again.",
        type: "danger",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/*TODO: go back button should be created */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignSelf: "flex-start", position: 'absolute', marginBottom: 12 }}
        >
          <ArrowLeft size={18} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.topSection}>
          <View style={styles.logoBox}>
            <BrandLogo size={44} />
          </View>
          <Text style={styles.brandName}>Forgot Password</Text>
          <Text style={styles.brandSub}>
            Enter your email to receive a 6-digit OTP.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Mail size={17} color={Colors.textTertiary} strokeWidth={1.6} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="forgot-email-input"
            />
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={forgotMutation.isPending}
            testID="forgot-submit-btn"
          >
            <Text style={styles.loginBtnText}>
              {forgotMutation.isPending ? "Sending..." : "Send OTP"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
