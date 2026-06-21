import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { X } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import { createUser } from "@/features/Donations/utils/usersApi";

export const AddUserModal = ({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}) => {
  const [role, setRole] = useState<"User" | "Admin">("User");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: onCreated,
  });

  const canSubmit =
    name.trim() && email.trim() && password.trim() && !createMutation.isPending;

  const handleCreate = () => {
    if (!canSubmit) return;
    createMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <MeshGradientBackground>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingTop: 20,
              marginBottom: 28,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.75}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.38)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.82)",
              }}
            >
              <X size={20} color={Colors.primary} strokeWidth={2.2} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: Colors.textPrimary,
              }}
            >
              Add User
            </Text>
          </View>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: Colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Role
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {(["User", "Admin"] as const).map((r) => {
              const active = role === r;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  activeOpacity={0.75}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: active
                      ? Colors.primary
                      : "rgba(255,255,255,0.34)",
                    borderWidth: 1,
                    borderColor: active
                      ? Colors.primary
                      : "rgba(255,255,255,0.72)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: active ? "#fff" : Colors.textSecondary,
                    }}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: Colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Enter Name
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.48)",
              borderRadius: 12,
              paddingHorizontal: 14,
              height: 50,
              justifyContent: "center",
              marginBottom: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.72)",
            }}
          >
            <TextInput
              placeholder="Full name"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
              style={{ fontSize: 14, color: Colors.textPrimary }}
            />
          </View>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: Colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Enter Email
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.48)",
              borderRadius: 12,
              paddingHorizontal: 14,
              height: 50,
              justifyContent: "center",
              marginBottom: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.72)",
            }}
          >
            <TextInput
              placeholder="Email address"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ fontSize: 14, color: Colors.textPrimary }}
            />
          </View>

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: Colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Enter Password
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.48)",
              borderRadius: 12,
              paddingHorizontal: 14,
              height: 50,
              justifyContent: "center",
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.72)",
            }}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ fontSize: 14, color: Colors.textPrimary }}
            />
          </View>

          <TouchableOpacity
            onPress={handleCreate}
            disabled={!canSubmit}
            activeOpacity={0.85}
            style={{
              height: 52,
              borderRadius: 14,
              backgroundColor: canSubmit
                ? Colors.primary
                : "rgba(13,92,145,0.4)",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
              {createMutation.isPending
                ? "Creating..."
                : `Create ${role === "Admin" ? "Admin" : "User"}`}
            </Text>
          </TouchableOpacity>

          {createMutation.isError && (
            <Text
              style={{
                fontSize: 13,
                color: Colors.error,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              {(createMutation.error as any)?.message ??
                "Failed to create user."}
            </Text>
          )}
        </View>
      </MeshGradientBackground>
    </Modal>
  );
};
