import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export type DateFilterType =
  | "last30"
  | "last90"
  | "thisMonth"
  | "lastMonth"
  | "last6Months"
  | "thisYear"
  | null;

interface Props {
  visible: boolean;
  selected: DateFilterType;
  onApply: (value: DateFilterType) => void;
  onClear: () => void;
  onClose: () => void;
}

const OPTIONS = [
  { id: "last30", label: "Last 30 days" },
  { id: "last90", label: "Last 90 days" },
  { id: "thisMonth", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "last6Months", label: "Last 6 Months" },
  { id: "thisYear", label: "This Year" },
];

export default function DateFilterModal({
  visible,
  selected,
  onApply,
  onClear,
  onClose,
}: Props) {
  const [value, setValue] = useState<DateFilterType>(selected);

  useEffect(() => {
    setValue(selected);
  }, [selected]);

  const handleClose = () => {
    setValue(selected);
    onClose();
  };

  const handleApply = () => {
    onApply(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* Modal Content */}
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <RNText style={styles.title}>by Date</RNText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  value === option.id && styles.optionSelected,
                ]}
                onPress={() => setValue(option.id as DateFilterType)}
                activeOpacity={0.7}
              >
                <RNText
                  style={[
                    styles.optionText,
                    value === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </RNText>
                <View
                  style={[
                    styles.radio,
                    value === option.id && styles.radioActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClear}
              activeOpacity={0.7}
            >
              <RNText style={styles.clearButtonText}>Clear</RNText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.7}
            >
              <RNText style={styles.applyButtonText}>Apply</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.background.default,
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.fontSize.h3,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  optionsContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.neutral.gray100,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: 0,
  },
  optionSelected: {
    backgroundColor: Colors.primary.main + "10",
    borderColor: Colors.primary.main,
  },
  optionText: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  optionTextSelected: {
    color: Colors.primary.main,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.neutral.gray300,
  },
  radioActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  clearButton: {
    flex: 1,
    height: Spacing.buttonHeight,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  applyButton: {
    flex: 2,
    height: Spacing.buttonHeight,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.white,
  },
});
