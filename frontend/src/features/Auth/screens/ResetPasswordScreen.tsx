import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useResetPasswordMutation } from "../hooks/useAuthMutations";
import { loginStyles as styles } from "../styles/loginStyles";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const resetMutation = useResetPasswordMutation();
  const token = params.token ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isDisabled = useMemo(
    () =>
      !token ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword ||
      resetMutation.isPending,
    [token, password, confirmPassword, resetMutation.isPending],
  );

  const handleReset = async () => {
    if (!token) {
      Alert.alert(
        "Reset link missing",
        "Please open the reset link from your email again.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Please re-enter matching passwords.");
      return;
    }

    try {
      await resetMutation.mutateAsync({ token, password });
      Alert.alert(
        "Password updated",
        "You can now sign in with your password.",
      );
      router.replace("/(auth)/login" as any);
    } catch (error: any) {
      Alert.alert(
        "Reset failed",
        error?.message ?? "Unable to reset password. Try again.",
      );
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
            <KeyRound size={22} color="#fff" />
          </View>
          <Text style={styles.brandName}>Reset Password</Text>
          <Text style={styles.brandSub}>
            Set a new password for your account
          </Text>
        </View>

        <View style={styles.formCard}>
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
