import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/shared/constants/color";
import { UserListItem } from "@/features/Donations/types/common";

export const BlockUserModal = ({
  user,
  onClose,
  onConfirm,
  loading,
}: {
  user: UserListItem | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  if (!user) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.92)",
            borderRadius: 18,
            padding: 22,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: Colors.textPrimary,
              marginBottom: 8,
            }}
          >
            {user.isBlocked ? "Unblock" : "Block"} User
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: Colors.textSecondary,
              textAlign: "center",
              marginBottom: 20,
              lineHeight: 19,
            }}
          >
            {user.isBlocked
              ? `${user.name} is currently blocked. Unblock to restore access?`
              : `Block ${user.name}? They will lose access until unblocked.`}
          </Text>
          <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.75}
              style={{
                flex: 1,
                height: 46,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.8)",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: Colors.textSecondary,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.85}
              style={{
                flex: 1,
                height: 46,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: user.isBlocked
                  ? Colors.secondary
                  : Colors.error,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                {loading ? "..." : user.isBlocked ? "Unblock" : "Block"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
