import Button from "@/components/atoms/Button";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import {
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import StandardBottomSheet from "./StandardBottomSheet";

interface Props {
  visible: boolean;
  serviceName: string;
  serviceDate: string;
  onClose: () => void;
  onSave: (name: string, date: string) => void;
  isSaving?: boolean;
}

export default function EditServiceBottomSheet({
  visible,
  serviceName,
  serviceDate,
  onClose,
  onSave,
  isSaving = false,
}: Props) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [name, setName] = useState(serviceName);
  const [date, setDate] = useState(serviceDate);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  useEffect(() => {
    if (visible) {
      setName(serviceName);
      setDate(serviceDate);
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible, serviceName, serviceDate]);

  return (
    <StandardBottomSheet
      ref={sheetRef}
      title="Edit Service"
      snapPoints={snapPoints}
      onClose={onClose}
    >
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Service Name</Text>
          <BottomSheetTextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Service Date</Text>
          <BottomSheetTextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="MM-DD-YYYY"
            placeholderTextColor={Colors.text.tertiary}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={styles.footer}>
          <Button title="Save Changes" onPress={() => onSave(name, date)} loading={isSaving} />
        </View>
      </View>
    </StandardBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    marginTop: 12,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.neutral.gray100,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.body,
    color: Colors.text.primary,
  },
  footer: {
    marginTop: 16,
    paddingBottom: Platform.OS === "ios" ? 0 : 16,
  },
});
