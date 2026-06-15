import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Plus,
  Search,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MeshGradientBackground from "@/shared/components/MeshGradientBackground";
import { Colors } from "@/shared/constants/color";
import {
  fetchAllUsers,
  toggleBlockUser,
} from "@/features/Donations/utils/usersApi";
import { AddUserModal } from "../components/AddUserModal";
import { BlockUserModal } from "../components/BlockUserModal";
import { getInitials } from "../utils/common";
import { userColors } from "../constants/userInterface";
import { UserListItem } from "@/features/Donations/types/common";

// TODO: move this hook to another file simply abstract it.

export default function ManageUsersScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ["users", "manage"],
    queryFn: fetchAllUsers,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Admin" | "User">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [blockTarget, setBlockTarget] = useState<UserListItem | null>(null);

  const filtered = useMemo(() => {
    let list = allUsers;
    if (filter !== "all") {
      list = list.filter((u) => u.role === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allUsers, filter, search]);

  const toggleMutation = useMutation({
    mutationFn: toggleBlockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "manage"] });
      setBlockTarget(null);
    },
  });

  return (
    <MeshGradientBackground>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingTop: 8,
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
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
              <ArrowLeft size={20} color={Colors.primary} strokeWidth={2.2} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: Colors.textPrimary,
              }}
            >
              Manage User&apos;s
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.35)",
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.8)",
                paddingHorizontal: 14,
                height: 44,
                gap: 10,
              }}
            >
              <Search size={16} color={Colors.textTertiary} strokeWidth={2} />
              <TextInput
                placeholder="Search user's"
                placeholderTextColor={Colors.textTertiary}
                value={search}
                onChangeText={setSearch}
                style={{ flex: 1, fontSize: 13, color: Colors.textPrimary }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.75}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={20} color="#fff" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {(["all", "Admin", "User"] as const).map((f) => {
              const active = filter === f;
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  activeOpacity={0.75}
                  style={{
                    height: 36,
                    borderRadius: 999,
                    paddingHorizontal: 16,
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
                      fontSize: 13,
                      fontWeight: "700",
                      color: active ? "#fff" : Colors.textSecondary,
                    }}
                  >
                    {f === "all" ? "All" : f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: "rgba(255,255,255,0.38)",
                    borderRadius: 14,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.82)",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: userColors[index % userColors.length],
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                    >
                      {getInitials(item.name)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: Colors.textPrimary,
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: Colors.textTertiary,
                        marginTop: 1,
                      }}
                      numberOfLines={1}
                    >
                      {item.email}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setBlockTarget(item)}
                    activeOpacity={0.75}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: item.isBlocked
                        ? Colors.errorLight
                        : Colors.secondaryLight,
                    }}
                  >
                    {item.isBlocked ? (
                      <Ban size={16} color={Colors.error} strokeWidth={2.2} />
                    ) : (
                      <CheckCircle2
                        size={16}
                        color={Colors.secondary}
                        strokeWidth={2.2}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.38)",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.82)",
                    padding: 28,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                    No users found
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>

      <AddUserModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["users", "manage"] });
          setShowAddModal(false);
        }}
      />

      <BlockUserModal
        user={blockTarget}
        onClose={() => setBlockTarget(null)}
        onConfirm={() => {
          if (blockTarget) toggleMutation.mutate(blockTarget.id);
        }}
        loading={toggleMutation.isPending}
      />
    </MeshGradientBackground>
  );
}
