import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Trash2, Plus } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { UniImage } from "@/shared/components/UniComponents";
import {
  useGalleryImages,
  useAddGalleryImages,
  useDeleteGalleryImage,
} from "../hooks/useGallery";
import { showAppMessage } from "@/shared/utils/flashMessage";
import { galleryModalStyles as styles } from "../styles/galleryModalStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function GalleryModal({ visible, onClose }: Props) {
  const { data: images, isLoading } = useGalleryImages();
  const addMutation = useAddGalleryImages();
  const deleteMutation = useDeleteGalleryImage();
  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAppMessage({ message: "Permission Required", description: "Gallery access is needed to add images.", type: "danger" });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.45,
    });

    if (result.canceled || !result.assets?.length) return;

    const assets = result.assets;

    if (assets.length > 20) {
      showAppMessage({ message: "Limit Reached", description: "You can upload up to 20 images at a time.", type: "warning" });
      return;
    }

    addMutation.mutate({
      imageUris: assets.map((a) => a.uri),
      fileNames: assets.map((a) => a.fileName ?? null),
      fileTypes: assets.map((a) => a.mimeType ?? null),
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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
          <Text style={styles.title}>Gallery Images</Text>
          <Text style={styles.subtitle}>
            Manage images displayed on the public showcase
          </Text>

          <ScrollView
            style={styles.imageList}
            contentContainerStyle={styles.imageListContent}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={{ paddingVertical: 40 }}
              />
            ) : images && images.length > 0 ? (
              <View style={styles.grid}>
                {images.map((img) => (
                  <View key={img.id} style={styles.imageItem}>
                    <UniImage
                      source={{ uri: img.imageUrl }}
                      style={styles.imageThumb}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(img.id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No gallery images yet.</Text>
            )}
          </ScrollView>

          <View style={styles.addSection}>
            <TouchableOpacity
              style={[
                styles.addBtn,
                (addMutation.isPending || deleteMutation.isPending) &&
                  styles.addBtnDisabled,
              ]}
              onPress={handlePickImages}
              activeOpacity={0.85}
              disabled={addMutation.isPending || deleteMutation.isPending}
            >
              {addMutation.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Plus size={18} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.addBtnText}>Add Images</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


