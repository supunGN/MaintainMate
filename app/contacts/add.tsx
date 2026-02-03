import Button from '@/components/atoms/Button';
import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { saveContact } from '@/utils/storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddContactScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Please enter a name');
            return;
        }
        if (!phone.trim()) {
            Alert.alert('Required', 'Please enter a phone number');
            return;
        }

        setIsSubmitting(true);

        try {
            await saveContact({
                name: name.trim(),
                phone: phone.trim(),
                specialty: specialty.trim() || 'General',
                category: 'other',
            });

            Alert.alert('Success', 'Contact added successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Error saving contact:', error);
            Alert.alert('Error', 'Failed to save contact. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <PageHeader title="Add New Contact" showBackButton onBackPress={handleBack} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. John's Garage"
                            placeholderTextColor={Colors.text.tertiary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. +94 77 123 4567"
                            placeholderTextColor={Colors.text.tertiary}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Role / Specialty</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Mechanic, Plumber"
                            placeholderTextColor={Colors.text.tertiary}
                            value={specialty}
                            onChangeText={setSpecialty}
                        />
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Save Contact"
                        onPress={handleSave}
                        loading={isSubmitting}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.default,
    },
    content: {
        padding: Spacing.screenHorizontal,
        paddingBottom: 100,
    },
    formGroup: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.neutral.gray100,
        borderRadius: Spacing.borderRadius.lg,
        padding: Spacing.md,
        fontSize: 16,
        color: Colors.text.primary,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    footer: {
        padding: Spacing.screenHorizontal,
        paddingBottom: Platform.OS === 'ios' ? 20 : 20,
        borderTopWidth: 1,
        borderTopColor: Colors.neutral.gray200,
        backgroundColor: Colors.background.default,
    },
});
