import Button from "@/components/atoms/Button";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

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
  const contentHeightRef = useRef(220); // fallback
  const [snapPoints, setSnapPoints] = useState<(number | string)[]>([
    220,
    "100%",
  ]);

  const [name, setName] = useState(serviceName);
  const [date, setDate] = useState(serviceDate);

  useEffect(() => {
    if (visible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [visible]);

  const expandFull = useCallback(() => {
    sheetRef.current?.snapToIndex(1);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props}>
        <View style={styles.footer}>
          <Button title="Save" onPress={() => onSave(name, date)} loading={isSaving} />
        </View>
      </BottomSheetFooter>
    ),
    [name, date, isSaving]
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        onLayout={(e: { nativeEvent: { layout: { height: number; }; }; }) => {
          const h = e.nativeEvent.layout.height + 80; // header + padding
          if (h !== contentHeightRef.current) {
            contentHeightRef.current = h;
            setSnapPoints([h, "100%"]);
          }
        }}
      >
        <Text style={styles.title}>Edit Service</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Service Name</Text>
          <BottomSheetTextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            onFocus={expandFull}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Service Date</Text>
          <BottomSheetTextInput
            style={styles.input}
            value={date}
            placeholder="MM-DD-YYYY"
            onFocus={expandFull}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  indicator: {
    backgroundColor: Colors.neutral.gray300,
    width: 48,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.neutral.black,
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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    backgroundColor: Colors.neutral.white,
  },
});
