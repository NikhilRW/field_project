import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  PlayCircle,
} from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import type { ActivityStatus } from "@/shared/types/mock";
import { getActivityStatusColor } from "../utils/statusColors";
import { activityDetailStyles as styles } from "../styles/activityDetailStyles";

type ActivityStatusMenuProps = {
  status: ActivityStatus;
  isUpdating: boolean;
  onChangeStatus: (status: ActivityStatus) => void;
};

const statusOptions: ActivityStatus[] = ["Upcoming", "Ongoing", "Completed"];

const getStatusIcon = (status: ActivityStatus) => {
  if (status === "Completed") {
    return CheckCircle2;
  }

  if (status === "Ongoing") {
    return PlayCircle;
  }

  return Clock3;
};

export default function ActivityStatusMenu({
  status,
  isUpdating,
  onChangeStatus,
}: ActivityStatusMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const triggerColor = useMemo(
    () => getActivityStatusColor(status),
    [status],
  );

  return (
    <View style={styles.statusMenuWrap}>
      <TouchableOpacity
        style={[
          styles.statusMenuTrigger,
          isUpdating && styles.statusMenuTriggerDisabled,
        ]}
        onPress={() => setIsOpen((current) => !current)}
        activeOpacity={0.85}
        disabled={isUpdating}
        testID="activity-status-menu-trigger"
        accessibilityRole="button"
        accessibilityLabel="Change activity status"
      >
        <ChevronDown size={18} color={triggerColor} strokeWidth={2.4} />
      </TouchableOpacity>

      {isOpen ? (
        <View style={styles.statusMenuDropdown}>
          {statusOptions.map((option) => {
            const Icon = getStatusIcon(option);
            const isActive = option === status;
            const iconColor = isActive
              ? Colors.primary
              : getActivityStatusColor(option);

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.statusMenuOption,
                  isActive && styles.statusMenuOptionActive,
                ]}
                onPress={() => {
                  setIsOpen(false);
                  onChangeStatus(option);
                }}
                activeOpacity={0.8}
                testID={`activity-status-option-${option.toLowerCase()}`}
              >
                <Icon size={16} color={iconColor} strokeWidth={2.2} />
                <Text
                  style={[
                    styles.statusMenuOptionText,
                    isActive && styles.statusMenuOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
