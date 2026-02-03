import Button from "@/components/atoms/Button";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import StandardBottomSheet from "./StandardBottomSheet";

interface Props {
    visible: boolean;
    currentName: string;
    onClose: () => void;
    onSave: (name: string) => void;
}

export default function EditNameBottomSheet({
    visible,
    currentName,
    onClose,
    onSave,
}: Props) {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [name, setName] = useState(currentName);
    const snapPoints = React.useMemo(() => ["45%"], []);

    useEffect(() => {
        if (visible) {
            setName(currentName);
            sheetRef.current?.present();
        } else {
            sheetRef.current?.dismiss();
        }
    }, [visible, currentName]);

    const handleSave = () => {
        onSave(name);
        sheetRef.current?.dismiss();
    };

    return (
        <StandardBottomSheet
            ref={sheetRef}
            title="Edit Name"
            snapPoints={snapPoints}
            onClose={onClose}
        >
            <View style={styles.content}>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <BottomSheetTextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor={Colors.text.tertiary}
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Save Changes" onPress={handleSave} />
                </View>
            </View>
        </StandardBottomSheet>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 8,
        marginTop: 0,
        flex: 1,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: "center",
        marginBottom: 24,
    },
    inputContainer: {
        gap: 8,
        marginBottom: 24,
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
    buttonContainer: {
        marginTop: "auto",
        marginBottom: Platform.OS === "ios" ? 10 : 0,
    },
});
