import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StandardBottomSheetProps {
    title?: string;
    snapPoints?: (string | number)[];
    onClose: () => void;
    children: React.ReactNode;
    enableDynamicSizing?: boolean;
}

const StandardBottomSheet = forwardRef<BottomSheetModal, StandardBottomSheetProps>(
    ({ title, snapPoints, onClose, children, enableDynamicSizing = false }, ref) => {
        const bottomSheetModalRef = useRef<BottomSheetModal>(null);

        // Expose BottomSheetModal methods to the parent via the forwarded ref
        useImperativeHandle(ref, () => ({
            present: () => bottomSheetModalRef.current?.present(),
            dismiss: () => bottomSheetModalRef.current?.dismiss(),
            collapse: () => bottomSheetModalRef.current?.collapse(),
            expand: () => bottomSheetModalRef.current?.expand(),
            snapToIndex: (index: number) => bottomSheetModalRef.current?.snapToIndex(index),
            snapToPosition: (position: string | number) => bottomSheetModalRef.current?.snapToPosition(position),
            close: () => bottomSheetModalRef.current?.close(),
            forceClose: () => bottomSheetModalRef.current?.forceClose(),
        } as any));

        const defaultSnapPoints = useMemo(() => ['50%'], []);
        const activeSnapPoints = snapPoints || defaultSnapPoints;

        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.4}
                    pressBehavior="close"
                />
            ),
            []
        );

        const handleClosePress = () => {
            bottomSheetModalRef.current?.dismiss();
        };

        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={activeSnapPoints}
                onDismiss={onClose}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                enableDynamicSizing={enableDynamicSizing}
                handleIndicatorStyle={styles.indicator}
                backgroundStyle={styles.bottomSheet}
                keyboardBehavior="interactive"
                android_keyboardInputMode="adjustResize"
            >
                <BottomSheetView style={styles.contentContainer}>
                    {/* Standard Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft} />
                        <Text style={styles.title} numberOfLines={1}>{title || ''}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClosePress}
                            hitSlop={15}
                        >
                            <Ionicons name="close" size={24} color={Colors.neutral.black} />
                        </TouchableOpacity>
                    </View>

                    {children}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    bottomSheet: {
        backgroundColor: Colors.neutral.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    indicator: {
        backgroundColor: Colors.neutral.gray300,
        width: 60,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 0,
        marginTop: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.neutral.black,
        textAlign: 'center',
    },
    headerLeft: {
        width: 24, // Balances the close button on the right
    },
    closeButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StandardBottomSheet;
