import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Calendar, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type DateFilterType =
  | "last30"
  | "last90"
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
  { id: "last30", label: "Last 30 Days" },
  { id: "last90", label: "Last 90 Days" },
  { id: "thisYear", label: "This Year" },
];

export default function DateFilterModal({
  visible,
  selected,
  onApply,
  onClear,
  onClose,
}: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const isPresenting = useRef(false);
  const [value, setValue] = useState<DateFilterType>(selected);

  // Sync visible prop with imperative API
  useEffect(() => {
    if (visible && !isPresenting.current) {
      // Sync state before presenting
      setValue(selected);
      bottomSheetModalRef.current?.present();
      isPresenting.current = true;
    } else if (!visible && isPresenting.current) {
      bottomSheetModalRef.current?.dismiss();
      isPresenting.current = false;
    }
  }, [visible, selected]);

  // Update value when selected changes
  useEffect(() => {
    setValue(selected);
  }, [selected]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleDismiss = useCallback(() => {
    isPresenting.current = false;
    setValue(selected);
    onClose();
  }, [onClose, selected]);

  const handleApply = () => {
    onApply(value);
    bottomSheetModalRef.current?.dismiss();
  };

  const handleClear = () => {
    onClear();
    bottomSheetModalRef.current?.dismiss();
  };

  const handleToggle = (id: DateFilterType) => {
    // Select this one (don't deselect if already selected)
    if (id) setValue(id);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['50%']}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.background}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>by Date</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            activeOpacity={0.7}
          >
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Options Grid */}
        <View style={styles.optionsContainer}>
          <View style={styles.grid}>
            {OPTIONS.map((option) => {
              const isSelected = value === option.id;
              return (
                <View key={option.id} style={styles.listItem}>
                  <TouchableOpacity
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => handleToggle(option.id as DateFilterType)}
                    activeOpacity={0.7}
                  >
                    <Calendar
                      size={20}
                      color={isSelected ? Colors.primary.main : Colors.neutral.gray500}
                      style={styles.icon}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.7}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: Colors.neutral.gray300,
    width: 40,
  },
  background: {
    backgroundColor: Colors.background.default,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
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
  grid: {
    flexDirection: "column",
  },
  listItem: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.lg,
    height: 52,
  },
  optionCardSelected: {
    backgroundColor: Colors.primary.main + "10",
    borderColor: Colors.primary.main,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  optionLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  optionLabelSelected: {
    color: Colors.primary.main,
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
