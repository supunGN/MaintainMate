import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddServiceFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = params.category as string;

  const [itemName, setItemName] = useState('');
  const [repairType, setRepairType] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [note, setNote] = useState('');

  const handleAddPhoto = () => {
    console.log('Open Camera/Gallery');
    Alert.alert('Photo Upload', 'Camera/Gallery picker will be implemented here');
  };

  const handleSubmit = () => {
    const serviceData = {
      category,
      itemName,
      repairType,
      date,
      cost,
      note,
    };
    console.log('Service Data:', serviceData);
    Alert.alert('Success', 'Service record added successfully!', [
      {
        text: 'OK',
        onPress: () => router.push('/(tabs)'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Service</Text>
        </View>

        {/* Form Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Item Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Add Item Name</Text>
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
              placeholder="e.g., Compressor replacement, Annual servicing"
              autoCapitalize="sentences"
            />
          </View>

          {/* Date of Service */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Service</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                // TODO: Implement date picker
                Alert.alert('Date Picker', 'Date picker will be implemented here');
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dateText,
                  !date && styles.placeholderText,
                ]}
              >
                {date || 'MM - DD - YYYY'}
              </Text>
            </TouchableOpacity>
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
              placeholder="e.g., Warranty valid until Dec 2025, technician contact: +1234567890"
              multiline
              numberOfLines={4}
              style={styles.noteInput}
              autoCapitalize="sentences"
            />
          </View>

          {/* Add Photo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Add Photo</Text>
            <TouchableOpacity
              style={styles.photoUpload}
              onPress={handleAddPhoto}
              activeOpacity={0.7}
            >
              <Camera size={32} color={Colors.neutral.gray500} />
              <Text style={styles.photoText}>Tap to add receipt or service photo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Add"
            onPress={handleSubmit}
            disabled={!itemName || !repairType || !cost}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.h3,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
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
  placeholderText: {
    color: Colors.neutral.gray500,
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
  footer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    backgroundColor: Colors.background.default,
  },
});
