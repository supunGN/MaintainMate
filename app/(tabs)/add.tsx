import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AddScreen() {
  // This screen is never actually shown because the tab press
  // listener in _layout.tsx navigates to /add-service
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
});
