import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import BrandLogo from "@/shared/components/BrandLogo";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { useRegisterForm } from "../hooks/useRegisterForm";
import {
  useGoogleLoginMutation,
  useRegisterMutation,
} from "../hooks/useAuthMutations";
import { loginStyles as styles } from "../styles/loginStyles";
import {
  getGoogleIdToken,
  getGoogleSignInErrorMessage,
} from "../utils/googleAuth";
import { showAppMessage } from "@/shared/utils/flashMessage";

// TODO: use react hook form for all forms in the app

export default function RegisterScreen() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    toggleShowPassword,
  } = useRegisterForm();

  const registerMutation = useRegisterMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showAppMessage({
        message: "Missing details",
        description: "Please fill in all required fields.",
        type: "warning",
      });
      return;
    }

    if (password !== confirmPassword) {
      showAppMessage({
        message: "Passwords do not match",
        description: "Please confirm your password.",
        type: "warning",
      });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
      });

      showAppMessage({
        message: "Account created",
        description: "Please verify your email to sign in.",
        type: "success",
      });
      router.replace(`/(auth)/verify-email?email=${encodeURIComponent(email)}` as any);
    } catch (error: any) {
      showAppMessage({
        message: "Registration failed",
        description: error?.message ?? "Unable to create account.",
        type: "danger",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const idToken = await getGoogleIdToken();

      if (!idToken) {
        return;
      }

      await googleLoginMutation.mutateAsync({ idToken });
      router.replace("/(tabs)/activities" as any);
    } catch (error: any) {
      showAppMessage({
        message: "Google sign-in failed",
        description: getGoogleSignInErrorMessage(error),
        type: "danger",
      });
    }
  };

  const isAuthLoading =
    registerMutation.isPending || googleLoginMutation.isPending;

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
            <BrandLogo size={40} />
          </View>
          <Text style={styles.brandName}>Helping Hands</Text>
          <Text style={styles.brandOrg}>Samajik Seva Sanstha</Text>
          <Text style={styles.brandSub}>Create your account</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrap}>
            <User size={17} color={Colors.textTertiary} strokeWidth={1.6} />
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              testID="name-input"
            />
          </View>

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
              testID="email-input"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Lock size={17} color={Colors.textTertiary} strokeWidth={1.6} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              testID="password-input"
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
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
              placeholder="Re-enter password"
              placeholderTextColor={Colors.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              testID="confirm-password-input"
            />
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleRegister}
            activeOpacity={0.8}
            testID="register-btn"
            disabled={isAuthLoading}
          >
            <Text style={styles.loginBtnText}>
              {registerMutation.isPending ? "Creating..." : "Create Account"}
            </Text>
          </TouchableOpacity>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleAuthButton
            onPress={handleGoogleSignIn}
            testID="google-register-btn"
            disabled={isAuthLoading}
            isLoading={googleLoginMutation.isPending}
          />

          <View
            style={{
              marginTop: 14,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: Colors.textSecondary }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login" as any)}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: "600" as const,
                }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
