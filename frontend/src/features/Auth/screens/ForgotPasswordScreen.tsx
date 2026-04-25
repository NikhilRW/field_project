import React, { useState } from "react";
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
import { Mail, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { Colors } from "@/shared/constants/color";
import { useForgotPasswordMutation } from "../hooks/useAuthMutations";
import { loginStyles as styles } from "../styles/loginStyles";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const forgotMutation = useForgotPasswordMutation();

  const handleSubmit = async () => {
    try {
      if (!email.trim()) {
        Alert.alert("Missing email", "Please enter your email address.");
        return;
      }
      await forgotMutation.mutateAsync(email.trim());
      Alert.alert(
        "Check your email",
        "If an account exists for this email, a reset password link has been sent to your email address.",
      );
      router.replace("/(auth)/reset-password" as any);
    } catch (error: any) {
      Alert.alert(
        "Request failed",
        error?.message ?? "Unable to send reset email. Please try again.",
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
        {/*TODO: go back button should be created */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignSelf: "flex-start", position: 'absolute', marginBottom: 12 }}
        >
          <ArrowLeft size={18} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.topSection}>
          <Text style={styles.brandName}>Forgot Password</Text>
          <Text style={styles.brandSub}>
            Enter your email to receive a reset password link.
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
              {forgotMutation.isPending ? "Sending..." : "Send Reset Password Link"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
