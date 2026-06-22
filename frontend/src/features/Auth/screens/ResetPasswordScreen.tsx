import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Lock, Eye, EyeOff, KeyRound, Mail } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useResetPasswordMutation } from "../hooks/useAuthMutations";
import BrandLogo from "@/shared/components/BrandLogo";
import { showAppMessage } from "@/shared/utils/flashMessage";
import { loginStyles as styles } from "../styles/loginStyles";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const resetMutation = useResetPasswordMutation();
  const [email, setEmail] = useState(params.email ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isDisabled = useMemo(
    () =>
      !email.trim() ||
      otp.length !== 6 ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword ||
      resetMutation.isPending,
    [email, otp, password, confirmPassword, resetMutation.isPending],
  );

  const handleReset = async () => {
    if (password !== confirmPassword) {
      showAppMessage({
        message: "Password mismatch",
        description: "Please re-enter matching passwords.",
        type: "warning",
      });
      return;
    }

    try {
      await resetMutation.mutateAsync({ email: email.trim(), otp, password });
      showAppMessage({
        message: "Password updated",
        description: "You can now sign in with your password.",
        type: "success",
      });
      router.replace("/(auth)/login" as any);
    } catch (error: any) {
      showAppMessage({
        message: "Reset failed",
        description: error?.message ?? "Unable to reset password. Try again.",
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
        <View style={styles.topSection}>
          <View style={styles.logoBox}>
            <BrandLogo size={44} />
          </View>
          <Text style={styles.brandName}>Reset Password</Text>
          <Text style={styles.brandSub}>
            Enter the OTP sent to your email and set a new password
          </Text>
        </View>

        <View style={styles.formCard}>
          {!params.email && (
            <>
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
                  testID="reset-email-input"
                />
              </View>
            </>
          )}

          <Text style={styles.label}>OTP</Text>
          <View style={styles.inputWrap}>
            <KeyRound size={17} color={Colors.textTertiary} strokeWidth={1.6} />
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor={Colors.textTertiary}
              value={otp}
              onChangeText={(t) => setOtp(t.replace(/\D/g, "").slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              testID="reset-otp-input"
            />
          </View>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrap}>
            <Lock size={17} color={Colors.textTertiary} strokeWidth={1.6} />
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              testID="new-password-input"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <Eye size={17} color={Colors.textTertiary} strokeWidth={1.6} />
              ) : (
                <EyeOff
                  size={17}
                  color={Colors.textTertiary}
                  strokeWidth={1.6}
                />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrap}>
            <Lock size={17} color={Colors.textTertiary} strokeWidth={1.6} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor={Colors.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              testID="confirm-password-input"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, isDisabled && { opacity: 0.6 }]}
            onPress={handleReset}
            activeOpacity={0.8}
            disabled={isDisabled}
            testID="reset-btn"
          >
            <Text style={styles.loginBtnText}>
              {resetMutation.isPending ? "Updating..." : "Reset Password"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
