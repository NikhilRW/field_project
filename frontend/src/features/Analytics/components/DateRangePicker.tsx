import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { X, Calendar } from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import CustomDateTimePicker from "@/features/Activities/components/CustomDateTimePicker";
import { DateRangePickerProps } from "../types/props";
import { styles } from "../styles/dateRangePickerStyles";

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  // TODO: convert to hook.
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleApply = () => {
    onApply(startDate, endDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlayWrapper}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date Range</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.dateSection}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Calendar size={16} color={Colors.primary} />
                <Text style={styles.dateText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <CustomDateTimePicker
                  value={startDate}
                  onChange={(event, date) => {
                    const isDismissed = !date && event?.type === "dismissed";
                    const selectedDate =
                      date ||
                      ((event as any)?.target?.value
                        ? new Date((event as any).target.value)
                        : null);
                    if (selectedDate) setStartDate(selectedDate);
                    if (selectedDate || isDismissed) setShowStartPicker(false);
                  }}
                  maximumDate={endDate}
                />
              )}
            </View>

            <View style={styles.dateSection}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Calendar size={16} color={Colors.primary} />
                <Text style={styles.dateText}>
                  {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <CustomDateTimePicker
                  value={endDate}
                  onChange={(event, date) => {
                    const selectedDate =
                      date ||
                      ((event as any)?.target?.value
                        ? new Date((event as any).target.value)
                        : null);
                    if (selectedDate) {
                      setEndDate(selectedDate);
                      setShowEndPicker(false);
                    }
                  }}
                  minimumDate={startDate}
                />
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
