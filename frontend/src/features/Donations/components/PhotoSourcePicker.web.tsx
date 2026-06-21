import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera } from "lucide-react-native";

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
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: 18,
            }}
            onPress={onTakePhoto}
            activeOpacity={0.7}
          >
            <Camera size={22} color="#1a1a1a" strokeWidth={2.2} />
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#1a1a1a",
                }}
              >
                Take Photo
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginTop: 1,
                }}
              >
                Use your camera to capture an image
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: "#f0f0f0",
              marginHorizontal: 18,
            }}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: 18,
            }}
            onPress={onChooseFile}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: "#1a1a1a",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: "#1a1a1a",
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#1a1a1a",
                }}
              >
                Choose from Files
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginTop: 1,
                }}
              >
                Browse and select an existing image
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 12,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 16,
            alignItems: "center",
          }}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#1a1a1a",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
