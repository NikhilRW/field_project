import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Mail, KeyRound, ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/shared/constants/color";
import {
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
} from "../hooks/useAuthMutations";
import BrandLogo from "@/shared/components/BrandLogo";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { showAppMessage } from "@/shared/utils/flashMessage";

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? "");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtpMutation = useSendVerificationEmailMutation();
  const verifyMutation = useVerifyEmailMutation();

  const handleSendOtp = async () => {
    if (!email.trim()) {
      showAppMessage({
        message: "Missing email",
        description: "Please enter your email address.",
        type: "warning",
      });
      return;
    }
    try {
      await sendOtpMutation.mutateAsync(email.trim());
      setOtpSent(true);
      showAppMessage({
        message: "OTP sent",
        description:
          "If an account exists, a 6-digit OTP has been sent to your email.",
        type: "success",
      });
    } catch (error: any) {
      showAppMessage({
        message: "Failed to send OTP",
        description: error?.message ?? "Unable to send OTP. Please try again.",
        type: "danger",
      });
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showAppMessage({
        message: "Invalid OTP",
        description: "Please enter the 6-digit OTP.",
        type: "warning",
      });
      return;
    }
    try {
      await verifyMutation.mutateAsync({ email: email.trim(), otp });
      showAppMessage({
        message: "Email verified",
        description: "You can now sign in with your account.",
        type: "success",
      });
      router.replace("/(auth)/login");
    } catch (error: any) {
      showAppMessage({
        message: "Verification failed",
        description: error?.message ?? "Invalid or expired OTP.",
        type: "danger",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <MeshGradientBackground>
        <View
          style={[
            s.container,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 40,
              backgroundColor: "transparent",
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={s.backBtn}
              activeOpacity={0.75}
            >
              <ArrowLeft
                size={20}
                color={Colors.textPrimary}
                strokeWidth={2.2}
              />
            </TouchableOpacity>

            <View style={s.hero}>
              <View style={s.logoWrap}>
                <BrandLogo size={48} />
              </View>
              <Text style={s.title}>Verify Email</Text>
              <Text style={s.subtitle}>
                {otpSent
                  ? "Enter the 6-digit OTP sent to your email"
                  : "Send a 6-digit OTP to verify your email"}
              </Text>
            </View>

            <View style={s.card}>
              {!params.email && (
                <>
                  <Text style={s.label}>Email</Text>
                  <View style={s.inputWrap}>
                    <Mail
                      size={17}
                      color={Colors.textTertiary}
                      strokeWidth={1.6}
                    />
                    <TextInput
                      style={s.input}
                      placeholder="you@example.com"
                      placeholderTextColor={Colors.textTertiary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </>
              )}

              {!otpSent ? (
                <TouchableOpacity
                  style={s.btn}
                  onPress={handleSendOtp}
                  activeOpacity={0.8}
                  disabled={sendOtpMutation.isPending}
                >
                  <Text style={s.btnText}>
                    {sendOtpMutation.isPending
                      ? "Sending..."
                      : "Send OTP"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <Text style={s.label}>OTP</Text>
                  <View style={s.inputWrap}>
                    <KeyRound
                      size={17}
                      color={Colors.textTertiary}
                      strokeWidth={1.6}
                    />
                    <TextInput
                      style={s.input}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor={Colors.textTertiary}
                      value={otp}
                      onChangeText={(t) =>
                        setOtp(t.replace(/\D/g, "").slice(0, 6))
                      }
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    style={s.btn}
                    onPress={handleVerify}
                    activeOpacity={0.8}
                    disabled={verifyMutation.isPending}
                  >
                    <Text style={s.btnText}>
                      {verifyMutation.isPending
                        ? "Verifying..."
                        : "Verify Email"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </MeshGradientBackground>
    </KeyboardAvoidingView>
  );
}

const s = {
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "rgba(255, 255, 255, 0.38)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.82)",
    marginTop: 12,
    marginBottom: 20,
  },
  hero: {
    alignItems: "center" as const,
    marginBottom: 32,
  },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrap: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600" as const,
  },
};
