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
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import BrandLogo from "@/shared/components/BrandLogo";
import { useLoginForm } from "../hooks/useLoginForm";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { loginStyles as styles } from "../styles/loginStyles";

// TODO: glassy vibes same as our app in all auth screens.
export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
  } = useLoginForm();

  const loginMutation = useLoginMutation();

  const handleLogin = async () => {
    try {
      const data = await loginMutation.mutateAsync({ email, password });

      const destination = "/(tabs)/dashboard";

      router.replace(destination as any);
    } catch (error: any) {
      const message = error?.message ?? "Unable to sign in. Please try again.";
      Alert.alert("Login failed", message);
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
          <Text style={styles.brandName}>Helping Hands</Text>
          <Text style={styles.brandOrg}>Samajik Seva Sanstha</Text>
          <Text style={styles.brandSub}>Sign in to your account</Text>
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

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => router.push("/(auth)/forgot-password" as any)}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.8}
            testID="login-btn"
            disabled={loginMutation.isPending}
          >
            <Text style={styles.loginBtnText}>
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              marginTop: 14,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: Colors.textSecondary }}>New here? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register" as any)}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: "600" as const,
                }}
              >
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
