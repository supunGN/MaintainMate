import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import PageHeader from '@/components/molecules/PageHeader';
import PlatformDatePicker from '@/components/molecules/PlatformDatePicker';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useUpdateService } from '@/hooks/useUpdateService';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, CheckCircle } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
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
  const updateMutation = useUpdateService();

  const id = params.id as string;
  const [itemName, setItemName] = useState((params.itemName as string) || '');
  const [repairType, setRepairType] = useState((params.repairType as string) || '');
  const [date, setDate] = useState(() => parseDate((params.date as string) || ''));
  const [cost, setCost] = useState((params.cost as string) || '');
  const [note, setNote] = useState((params.note as string) || '');
  const [image, setImage] = useState<string | null>((params.image as string) || null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleAddPhoto = () => {
    Alert.alert(
      'Update Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: openCamera,
        },
        {
          text: 'Choose from Library',
          onPress: openImageLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to update the photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!itemName || !repairType || !cost) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        updatedFields: {
          itemName,
          repairType,
          date: formatDate(date),
          cost,
          note,
          image: image || undefined,
        },
      });

      setShowSuccess(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to update service record.');
    }
  }, [id, itemName, repairType, date, cost, note, image, updateMutation]);

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
            <Text style={styles.label}>Item Name</Text>
            <Input
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g., Samsung Refrigerator Model XYZ"
              autoCapitalize="words"
            />
          </View>

          {/* Repair Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Repair type</Text>
            <Input
              value={repairType}
              onChangeText={setRepairType}
              placeholder="e.g., Compressor replacement"
              autoCapitalize="sentences"
            />
          </View>

          {/* Date of Service */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Service</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={handleOpenDatePicker}
              activeOpacity={0.7}
            >
              <Text style={styles.dateText}>
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
            <PlatformDatePicker
              visible={showDatePicker}
              date={date}
              onChange={onDateChange}
              onClose={() => setShowDatePicker(false)}
            />
          </View>

          {/* Cost */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cost</Text>
            <Input
              value={cost}
              onChangeText={setCost}
              placeholder="e.g., 15000"
              keyboardType="numeric"
            />
          </View>

          {/* Note */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Note (Optional)</Text>
            <Input
              value={note}
              onChangeText={setNote}
              placeholder="Add details about the service, warranty, etc."
              multiline
              numberOfLines={4}
              style={styles.noteInput}
              autoCapitalize="sentences"
            />
          </View>

          {/* Key Updates: Photo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Photo</Text>
            <TouchableOpacity
              style={styles.photoUpload}
              onPress={handleAddPhoto}
              activeOpacity={0.7}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <>
                  <Camera size={32} color={Colors.neutral.gray500} />
                  <Text style={styles.photoText}>Tap to add/change photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={updateMutation.isPending ? "Saving..." : "Save Changes"}
            onPress={handleSubmit}
            disabled={updateMutation.isPending || !itemName || !repairType || !cost}
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
  } catch { }
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
  noteInput: {
    height: 120,
    paddingTop: Spacing.md,
    textAlignVertical: 'top',
  },
  photoUpload: {
    height: 160,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.neutral.gray100,
    borderWidth: 2,
    borderColor: Colors.neutral.gray300,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  photoText: {
    fontSize: Typography.fontSize.caption,
    color: Colors.neutral.gray500,
    fontFamily: Typography.fontFamily.regular,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: Spacing.borderRadius.lg,
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
