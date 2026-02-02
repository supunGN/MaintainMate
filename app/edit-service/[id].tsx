import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [itemName, setItemName] = useState((params.name as string) || '');
  const [date, setDate] = useState(() => parseDate((params.date as string) || ''));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleOpenDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month} - ${day} - ${year}`;
  };

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
    }, 500);
  }, [itemName, date]);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <PageHeader title="Edit Service" showBackButton onBackPress={handleBack} />

        {/* Form Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Item Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Service Name</Text>
            <Input
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g., Samsung Refrigerator Model XYZ"
              autoCapitalize="words"
            />
          </View>

          {/* Date of Service */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Service</Text>
            {Platform.OS === 'web' ? (
              <Input
                value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`}
                onChangeText={() => {}}
                // @ts-ignore - type is supported on web for react-native-web
                type="date"
                placeholder="MM - DD - YYYY"
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={handleOpenDatePicker}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dateText}>
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                  />
                )}
              </>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={isSaving ? "Saving..." : "Save"}
            onPress={handleSubmit}
            disabled={isSaving || !itemName}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <CheckCircle size={40} color={Colors.primary.main} />
            </View>
            <Text style={styles.successTitle}>Updated Successfully!</Text>
            <Text style={styles.successSubtext}>Your service record has been updated.</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleCloseSuccess}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function parseDate(str: string): Date {
  try {
    const parts = str.split(' - ');
    if (parts.length === 3) {
      return new Date(+parts[2], +parts[0] - 1, +parts[1]);
    }
  } catch {}
  return new Date();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.xl,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.caption,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  dateInput: {
    height: Spacing.inputHeight,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.neutral.gray100,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: Typography.fontSize.body,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.regular,
  },
  footer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    backgroundColor: Colors.background.default,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.neutral.white,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 10,
  },
  successSubtext: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 15,
  },
  modalButtonText: {
    color: Colors.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
