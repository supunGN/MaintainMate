import React from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

import Text from "@/components/atoms/Text";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Feather } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  item: any;
  onClose: () => void;
}

export default function ServiceHistoryDetailsModal({
  visible,
  item,
  onClose,
}: Props) {
  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            {/* Left */}
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>

            {/* Center */}
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>

            {/* Right spacer (balances left icon) */}
            <View style={styles.rightSpacer} />
          </View>

          {/* Image */}
          <Image
            source={
              item.image
                ? { uri: item.image }
                : require("../../assets/images/icon.png")
            }
            style={styles.image}
          />
          {/* Details */}
          <View style={styles.tab}>
            <View style={styles.row}>
              <Text style={styles.rowTitle} color="muted">
                Date
              </Text>
              <Text>{item.date}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.rowTitle} color="muted">
                Category
              </Text>
              <Text>{item.category}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.rowTitle} color="muted">
                Cost
              </Text>
              <Text>Rs. {item.cost}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.notes}>
              <Text style={styles.rowTitle} color="muted">
                Notes
              </Text>
              <Text style={styles.noteText}>{item.notes}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Colors.background.default,
    padding: Spacing.lg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    //position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  rightSpacer: {
    width: 40,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginVertical: Spacing.md,
  },
  tab: {
    backgroundColor: Colors.background.paper,
    borderRadius: 22,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginBottom: Spacing.sm,
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "gray",
    opacity: 0.2,
  },
  notes: {
    marginTop: Spacing.md,
  },
  noteText: {
    color: "#6B7280",
  },
  rowTitle: {
    fontWeight: "bold",
  },
});
