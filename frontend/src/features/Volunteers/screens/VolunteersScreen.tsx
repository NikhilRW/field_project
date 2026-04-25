import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  X,
  CalendarDays,
  Briefcase,
  ChevronRight,
} from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useVolunteers } from "../hooks/useVolunteers";
import type { Volunteer } from "@/shared/types/mock";
import { getVolunteerRoleBg, getVolunteerRoleColor } from "../utils/roleColors";
import { volunteersStyles as styles } from "../styles/volunteersStyles";

export default function VolunteersScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [volList, setVolList] = useState<Volunteer[]>([]);
  const [selected, setSelected] = useState<Volunteer | null>(null);
  const { data: volunteers = [] } = useVolunteers();

  useEffect(() => {
    setVolList(volunteers);
  }, [volunteers]);

  const filtered = volList.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.skill.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAvailability = (id: string) => {
    setVolList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, available: !v.available } : v)),
    );
    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, available: !prev.available } : prev,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.textTertiary} strokeWidth={1.8} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search volunteers..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
            testID="volunteer-search"
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[styles.statChip, { backgroundColor: Colors.secondaryLight }]}
        >
          <View
            style={[styles.statDot, { backgroundColor: Colors.secondary }]}
          />
          <Text style={styles.statChipText}>
            {volList.filter((v) => v.available).length} Available
          </Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: Colors.errorLight }]}>
          <View style={[styles.statDot, { backgroundColor: Colors.error }]} />
          <Text style={styles.statChipText}>
            {volList.filter((v) => !v.available).length} Unavailable
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={styles.card}
            onPress={() => setSelected(v)}
            activeOpacity={0.7}
            testID={`volunteer-${v.id}`}
          >
            <View style={[styles.avatar, { backgroundColor: v.color }]}>
              <Text style={styles.avatarText}>{v.initials}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{v.name}</Text>
              <View style={styles.tagRow}>
                <View
                  style={[
                    styles.roleTag,
                    { backgroundColor: getVolunteerRoleBg(v.role) },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleTagText,
                      { color: getVolunteerRoleColor(v.role) },
                    ]}
                  >
                    {v.role}
                  </Text>
                </View>
                <Text style={styles.skillText}>{v.skill}</Text>
              </View>
              <View style={styles.assignedRow}>
                <CalendarDays
                  size={11}
                  color={Colors.textTertiary}
                  strokeWidth={1.6}
                />
                <Text style={styles.assignedText}>{v.assignedActivity}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Switch
                value={v.available}
                onValueChange={() => toggleAvailability(v.id)}
                trackColor={{
                  false: Colors.border,
                  true: Colors.secondary + "66",
                }}
                thumbColor={v.available ? Colors.secondary : "#ccc"}
                testID={`toggle-${v.id}`}
              />
              <ChevronRight
                size={14}
                color={Colors.textTertiary}
                style={{ marginTop: 4 }}
              />
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>

      <Modal
        visible={selected !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelected(null)}
            >
              <X size={16} color={Colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>

            {selected && (
              <>
                <View style={styles.sheetProfile}>
                  <View
                    style={[
                      styles.sheetAvatar,
                      { backgroundColor: selected.color },
                    ]}
                  >
                    <Text style={styles.sheetAvatarText}>
                      {selected.initials}
                    </Text>
                  </View>
                  <Text style={styles.sheetName}>{selected.name}</Text>
                  <View
                    style={[
                      styles.roleTag,
                      {
                        backgroundColor: getVolunteerRoleBg(selected.role),
                        marginTop: 6,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        { color: getVolunteerRoleColor(selected.role) },
                      ]}
                    >
                      {selected.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.sheetDivider} />

                <View style={styles.sheetDetail}>
                  <View style={styles.sheetDetailRow}>
                    <Briefcase
                      size={15}
                      color={Colors.primary}
                      strokeWidth={1.6}
                    />
                    <Text style={styles.sheetDetailLabel}>Skill</Text>
                    <Text style={styles.sheetDetailValue}>
                      {selected.skill}
                    </Text>
                  </View>
                  <View style={styles.sheetDetailRow}>
                    <CalendarDays
                      size={15}
                      color={Colors.primary}
                      strokeWidth={1.6}
                    />
                    <Text style={styles.sheetDetailLabel}>Assigned To</Text>
                    <Text style={styles.sheetDetailValue}>
                      {selected.assignedActivity}
                    </Text>
                  </View>
                  <View style={styles.sheetDetailRow}>
                    <View
                      style={[
                        styles.statDot,
                        {
                          backgroundColor: selected.available
                            ? Colors.secondary
                            : Colors.error,
                        },
                      ]}
                    />
                    <Text style={styles.sheetDetailLabel}>Availability</Text>
                    <Text
                      style={[
                        styles.sheetDetailValue,
                        {
                          color: selected.available
                            ? Colors.secondary
                            : Colors.error,
                          fontWeight: "600" as const,
                        },
                      ]}
                    >
                      {selected.available ? "Available" : "Unavailable"}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
