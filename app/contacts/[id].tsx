import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    Edit2,
    Mail,
    MapPin,
    Phone,
    Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export default function ContactDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const stored = await AsyncStorage.getItem("contacts");
        if (stored) {
          const contacts: Contact[] = JSON.parse(stored);
          const found = contacts.find((c) => c.id === id);
          setContact(found || null);
        }
      } catch (error) {
        console.error("Error loading contact:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem("contacts");
              if (stored) {
                const contacts: Contact[] = JSON.parse(stored);
                const updated = contacts.filter((c) => c.id !== id);
                await AsyncStorage.setItem("contacts", JSON.stringify(updated));
                Alert.alert("Deleted", "Contact deleted successfully", [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]);
              }
            } catch (error) {
              console.error("Error deleting contact:", error);
              Alert.alert("Error", "Failed to delete contact");
            }
          },
        },
      ],
    );
  };

  const handleCall = async () => {
    if (!contact?.phone) return;
    try {
      await Linking.openURL(`tel:${contact.phone}`);
    } catch (error) {
      Alert.alert("Error", "Could not open phone app");
    }
  };

  const handleEmail = async () => {
    if (!contact?.email) return;
    try {
      await Linking.openURL(`mailto:${contact.email}`);
    } catch (error) {
      Alert.alert("Error", "Could not open email app");
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/contacts/addContact",
      params: { contact: JSON.stringify(contact) },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!contact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Contact not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Details</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleEdit}
          activeOpacity={0.7}
        >
          <Edit2 size={24} color={Colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Contact Info Card */}
      <View style={styles.infoCard}>
        {/* Name */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {contact.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Text>
        </View>

        <Text style={styles.contactName}>{contact.name}</Text>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Phone size={24} color={Colors.primary.main} />
            <Text style={styles.actionButtonLabel}>Call</Text>
          </TouchableOpacity>

          {contact.email && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEmail}
              activeOpacity={0.7}
            >
              <Mail size={24} color={Colors.primary.main} />
              <Text style={styles.actionButtonLabel}>Email</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={24} color={Colors.error} />
            <Text style={[styles.actionButtonLabel, styles.deleteLabel]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        {/* Phone */}
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Phone size={20} color={Colors.primary.main} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{contact.phone}</Text>
          </View>
        </View>

        {/* Email */}
        {contact.email && (
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Mail size={20} color={Colors.primary.main} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{contact.email}</Text>
            </View>
          </View>
        )}

        {/* Address */}
        {contact.address && (
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MapPin size={20} color={Colors.primary.main} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{contact.address}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.text.secondary,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.text.secondary,
  },
  infoCard: {
    marginHorizontal: Spacing.screenHorizontal,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.primary.light,
    borderRadius: 12,
    alignItems: "center",
    gap: Spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  contactName: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.background.default,
    borderRadius: 8,
  },
  deleteActionButton: {
    backgroundColor: "#FEE8E8",
  },
  actionButtonLabel: {
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.main,
  },
  deleteLabel: {
    color: Colors.error,
  },
  detailsSection: {
    marginHorizontal: Spacing.screenHorizontal,
    gap: Spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
    gap: Spacing.md,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.neutral.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  detailContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  detailLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  detailValue: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
});
