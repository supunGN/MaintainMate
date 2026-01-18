import Text from "@/components/atoms/Text";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  item: {
    title: string;
    category: string;
    date: string;
    cost: number;
    image?: string; // optional image URI
  };
  onPressMore: () => void;
}

export default function ServiceHistoryCard({ item, onPressMore }: Props) {
  return (
    <View style={styles.card}>
      {/* Main row: image left, details right */}
      <View style={styles.rowMain}>
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
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <View style={styles.textColumn}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>

            <TouchableOpacity onPress={onPressMore} style={styles.moreButton}>
              <Feather
                name="more-vertical"
                size={24}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.cost}>Rs. {item.cost.toLocaleString()}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F2F2", // light grey card
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
    flexDirection: "row", // make card a row container
    alignItems: "center",
  },

  rowMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: Spacing.md,
  },

  details: {
    flex: 1, // fill remaining space
    justifyContent: "space-between",
    height: 100, // match image height
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  textColumn: {
    flex: 1,
  },

  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "#000",
    marginBottom: 2,
  },

  category: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },

  moreButton: {
    paddingLeft: 10,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cost: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2E7D32", // dark green
  },

  dateText: {
    color: "#757575",
    fontSize: 14,
  },
});
