import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (contact: { name: string; place: string; phone: string }) => void;
}

export default function AddContactModal({
  visible,
  onClose,
  onSave,
}: AddContactModalProps) {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (name && place && phone) {
      onSave({ name, place, phone });
      // Reset form
      setName('');
      setPlace('');
      setPhone('');
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form on close
    setName('');
    setPlace('');
    setPhone('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
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
            <Text style={styles.title}>Add Service contact</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name</Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Name"
                autoCapitalize="words"
              />
            </View>

            {/* Place Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Place</Text>
              <Input
                value={place}
                onChangeText={setPlace}
                placeholder="Place Name"
                autoCapitalize="words"
              />
            </View>

            {/* Contact Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Contact</Text>
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="Number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.footer}>
            <Button
              title="Save"
              onPress={handleSave}
              disabled={!name || !place || !phone}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.background.default,
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  title: {
    fontSize: Typography.fontSize.h3,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  form: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
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
  footer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
  },
});
