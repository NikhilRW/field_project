import React from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import { Trash2 } from "lucide-react-native";
import { deleteActivityModalStyles as styles } from "../styles/deleteActivityModalStyles";

type Props = {
  visible: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onClose: () => void;
};

export default function DeleteActivityModal({
  visible,
  isDeleting,
  onDelete,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Delete activity?</Text>

          <Text style={styles.body}>
            This will permanently remove the activity and it's all details.
          </Text>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
              disabled={isDeleting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
              onPress={onDelete}
              activeOpacity={0.85}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Trash2 size={16} color="#fff" strokeWidth={2.2} />
                  <Text style={styles.deleteText}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
