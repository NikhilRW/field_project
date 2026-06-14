import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { X } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useUpdateProfileMutation } from "@/features/Auth/hooks/useAuthMutations";
import { editNameModalStyles as styles } from "../styles/editNameModalStyles";

type Props = {
  visible: boolean;
  currentName: string;
  onClose: () => void;
};

export default function EditNameModal({
  visible,
  currentName,
  onClose,
}: Props) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");
  const { mutateAsync, isPending } = useUpdateProfileMutation();

  const handleUpdate = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Name cannot be empty.");
      return;
    }

    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (trimmed === currentName) {
      onClose();
      return;
    }

    try {
      setError("");
      await mutateAsync({ name: trimmed });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update name.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color={Colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Name</Text>
            <View style={styles.closeBtn} />
          </View>

          <View style={styles.body}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) setError("");
              }}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textTertiary}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleUpdate}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateBtn, isPending && styles.updateBtnDisabled]}
              onPress={handleUpdate}
              activeOpacity={0.85}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.updateText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
