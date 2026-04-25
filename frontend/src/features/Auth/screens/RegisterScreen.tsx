import React from "react";
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
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import BrandLogo from "@/shared/components/BrandLogo";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import { loginStyles as styles } from "../styles/loginStyles";

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

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please confirm your password.");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
      });

      Alert.alert(
        "Account created",
        "Please check your email to verify your account, then sign in.",
      );
      router.replace("/(auth)/login" as any);
    } catch (error: any) {
      Alert.alert(
        "Registration failed",
        error?.message ?? "Unable to create account.",
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
            disabled={registerMutation.isPending}
          >
            <Text style={styles.loginBtnText}>
              {registerMutation.isPending ? "Creating..." : "Create Account"}
            </Text>
          </TouchableOpacity>

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
