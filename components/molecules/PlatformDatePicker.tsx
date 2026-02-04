import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useRef } from 'react';
import {
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import Button from '../atoms/Button';
import StandardBottomSheet from '../organisms/StandardBottomSheet';

interface PlatformDatePickerProps {
    visible: boolean;
    date: Date;
    onChange: (event: DateTimePickerEvent, date?: Date) => void;
    onClose: () => void;
    mode?: 'date' | 'time';
}

/**
 * A platform-aware DatePicker component that provides a consistent "Standard Bottom Sheet" look on iOS.
 * 
 * - iOS: Renders a StandardBottomSheet wrapper.
 * - Android: Renders the native modal picker.
 */
export default function PlatformDatePicker({
    visible,
    date,
    onChange,
    onClose,
    mode = 'date',
}: PlatformDatePickerProps) {
    const sheetRef = useRef<BottomSheetModal>(null);

    // iOS Bottom Sheet Visibility Logic
    useEffect(() => {
        if (Platform.OS === 'ios') {
            if (visible) {
                sheetRef.current?.present();
            } else {
                sheetRef.current?.dismiss();
            }
        }
    }, [visible]);

    if (Platform.OS === 'android') {
        if (!visible) return null;
        return (
            <DateTimePicker
                value={date}
                mode={mode}
                display="default"
                onChange={onChange}
            />
        );
    }

    // iOS Implementation: StandardBottomSheet with Picker
    return (
        <StandardBottomSheet
            ref={sheetRef}
            title="Select Date"
            onClose={onClose}
            snapPoints={['45%']}
        >
            <View style={styles.content}>
                {/* Picker */}
                <View style={styles.pickerContainer}>
                    <DateTimePicker
                        value={date}
                        mode={mode}
                        display="spinner"
                        onChange={onChange}
                        textColor={Colors.text.primary}
                        themeVariant="light"
                        style={styles.picker}
                    />
                </View>

                {/* Footer Action */}
                <View style={styles.footer}>
                    <Button title="Done" onPress={onClose} />
                </View>
            </View>
        </StandardBottomSheet>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    pickerContainer: {
        height: 200,
        justifyContent: 'center',
    },
    picker: {
        height: 200,
    },
    footer: {
        marginTop: Spacing.md,
    },
});
