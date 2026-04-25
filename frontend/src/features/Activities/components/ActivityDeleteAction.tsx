import React from "react";
import { TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { activityDetailStyles as styles } from "../styles/activityDetailStyles";

type ActivityDeleteActionProps = {
  isDeleting: boolean;
  onDelete: () => void;
};

export default function ActivityDeleteAction({
  isDeleting,
  onDelete,
}: ActivityDeleteActionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.deleteIconButton,
        isDeleting && styles.deleteIconButtonDisabled,
      ]}
      onPress={onDelete}
      activeOpacity={0.85}
      disabled={isDeleting}
      testID="delete-activity-btn"
      accessibilityRole="button"
      accessibilityLabel="Delete activity"
    >
      <Trash2 size={18} color={Colors.error} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}
