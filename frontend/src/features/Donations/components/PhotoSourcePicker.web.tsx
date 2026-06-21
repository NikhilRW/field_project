import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Camera, FolderOpen } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";

type Props = {
  visible: boolean;
  onTakePhoto: () => void;
  onChooseFile: () => void;
  onClose: () => void;
};

export default function PhotoSourcePicker({
  visible,
  onTakePhoto,
  onChooseFile,
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
          <Text style={styles.title}>Add Photo</Text>
          <Text style={styles.subtitle}>
            Take a new photo or choose from files
          </Text>

          <TouchableOpacity
            style={styles.optionBtn}
            onPress={onTakePhoto}
            activeOpacity={0.7}
          >
            <Camera size={20} color={Colors.primary} strokeWidth={2.2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionSub}>Use your camera</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionBtn}
            onPress={onChooseFile}
            activeOpacity={0.7}
          >
            <FolderOpen size={20} color={Colors.primary} strokeWidth={2.2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Choose from Files</Text>
              <Text style={styles.optionSub}>Browse existing images</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// TODO: move to styles folder.

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modal: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  optionSub: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.surface,
  },
});
