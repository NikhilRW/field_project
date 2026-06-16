import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import type { FilterDropdownProps } from "../types/props";
import { DONATION_TYPES } from "../constants/common";
import { styles } from "../styles/filterDropdownStyles";

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    DONATION_TYPES.find((t) => t.value === value)?.label || "All";

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{selectedLabel}</Text>
        <ChevronDown size={16} color={Colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            {DONATION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.option,
                  value === type.value && styles.optionSelected,
                ]}
                onPress={() => {
                  onChange(type.value);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === type.value && styles.optionTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
