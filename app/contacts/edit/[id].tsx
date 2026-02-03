import Button from '@/components/atoms/Button';
import PageHeader from '@/components/molecules/PageHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { getContacts, updateContact } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
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

export default function EditContactScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const { id } = params;

    // Use a ref to ensure we only load data once and don't reset it
    const hasLoaded = useRef(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load initial data ONCE
    useEffect(() => {
        if (hasLoaded.current) return;

        const loadInitialData = async () => {
            try {
                // Priority 1: Use direct params if available (best UX)
                if (params.name) {
                    setName(params.name as string);
                    setPhone((params.phone as string) || '');
                    setSpecialty((params.specialty as string) || '');
                    hasLoaded.current = true;
                    setIsLoading(false);
                    return;
                }

                // Priority 2: Fetch from storage if params are missing
                if (id) {
                    const contacts = await getContacts();
                    const contact = contacts.find(c => c.id === id);
                    if (contact) {
                        setName(contact.name);
                        setPhone(contact.phone);
                        setSpecialty(contact.specialty);
                        hasLoaded.current = true;
                    } else {
                        Alert.alert('Error', 'Contact not found');
                        router.back();
                    }
                }
            } catch (error) {
                console.error('Error loading contact:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [id, params.name, params.phone, params.specialty]);

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a name');
            return;
        }
        if (!id) {
            Alert.alert('Error', 'Contact ID missing');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await updateContact(id as string, {
                name: name.trim(),
                phone: phone.trim(),
                specialty: specialty.trim(),
            });

            if (result) {
                Alert.alert('Success', 'Contact updated!', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update contact');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <PageHeader title="Edit Contact" showBackButton onBackPress={handleBack} />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <PageHeader title="Edit Contact" showBackButton onBackPress={handleBack} />

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
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={Colors.text.tertiary}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholderTextColor={Colors.text.tertiary}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Specialty / Role</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Mechanic"
                            value={specialty}
                            onChangeText={setSpecialty}
                            placeholderTextColor={Colors.text.tertiary}
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Save Changes"
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: Spacing.screenHorizontal,
        paddingBottom: 40,
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
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        borderTopWidth: 1,
        borderTopColor: Colors.neutral.gray200,
        backgroundColor: Colors.background.default,
    },
});
