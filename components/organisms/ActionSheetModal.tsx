import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import StandardBottomSheet from './StandardBottomSheet';

export interface ActionSheetItem {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'destructive';
  type?: 'button' | 'toggle';
  value?: boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
  iconColor?: string;
  textColor?: string;
}

interface ActionSheetModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  actions: ActionSheetItem[];
}

export default function ActionSheetModal({
  visible,
  onClose,
  title,
  actions,
}: ActionSheetModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const isPresenting = useRef(false);

  // Sync visible prop with imperative API
  useEffect(() => {
    if (visible && !isPresenting.current) {
      bottomSheetModalRef.current?.present();
      isPresenting.current = true;
    } else if (!visible && isPresenting.current) {
      bottomSheetModalRef.current?.dismiss();
      isPresenting.current = false;
    }
  }, [visible]);

  const handleDismiss = () => {
    isPresenting.current = false;
    onClose();
  };

  return (
    <StandardBottomSheet
      ref={bottomSheetModalRef}
      title={title}
      onClose={handleDismiss}
      enableDynamicSizing
    >
      {actions.map((action, index) => {
        const isLast = index === actions.length - 1;
        const isDestructive = action.variant === 'destructive';
        const textColor = action.textColor || (isDestructive ? Colors.errorDark : Colors.neutral.black);
        const iconColor = action.iconColor || (isDestructive ? Colors.errorDark : Colors.neutral.black);

        if (action.type === 'toggle') {
          return (
            <View key={action.id} style={[styles.actionItem, isLast && styles.lastItem]}>
              <Text style={[styles.actionText, { color: textColor }]}>{action.label}</Text>
              <Switch
                value={action.value}
                onValueChange={action.onValueChange}
                trackColor={{ false: Colors.neutral.gray300, true: Colors.primary.main }}
                thumbColor={Colors.neutral.white}
              />
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionItem, isLast && styles.lastItem]}
            onPress={() => {
              if (action.onPress) {
                action.onPress();
              }
              bottomSheetModalRef.current?.dismiss();
            }}
          >
            <Text style={[styles.actionText, { color: textColor }]}>{action.label}</Text>
            {action.icon && (
              <Ionicons name={action.icon} size={24} color={iconColor} />
            )}
          </TouchableOpacity>
        );
      })}
    </StandardBottomSheet>
  );
}

const styles = StyleSheet.create({
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
  },
  lastItem: {
    marginBottom: 0,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.black,
  },
});
