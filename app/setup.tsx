import Button from '@/components/atoms/Button';
import UserSetupSlide from '@/components/organisms/UserSetupSlide';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetupScreen() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (userName.trim().length < 2) return;

        setIsSubmitting(true);
        try {
            await AsyncStorage.setItem('@user_name', userName.trim());
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error saving user name:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = userName.trim().length >= 2;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.body}>
                    <UserSetupSlide
                        illustration={require('@/assets/images/onboarding/onboarding_6.png')}
                        title="Let's get to know each other!"
                        subtitle="To personalize your maintenance dashboard, what should I call you?"
                        userName={userName}
                        onNameChange={setUserName}
                        onSubmit={handleNext}
                    />
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Get Started"
                        onPress={handleNext}
                        disabled={!canProceed || isSubmitting}
                        loading={isSubmitting}
                        style={styles.button}
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
    body: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: Spacing.screenHorizontal,
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.md,
        backgroundColor: Colors.background.default,
    },
    button: {
        width: '100%',
    },
});
