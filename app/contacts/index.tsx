import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { Edit2, Phone, Plus, Trash2 } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    Alert,
    SafeAreaView,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// Alphabetical grouping helper
const groupContactsByLetter = (contacts: Contact[]) => {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  const grouped: Record<string, Contact[]> = {};

  sorted.forEach((contact) => {
    const letter = contact.name[0]?.toUpperCase() || "#";
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(contact);
  });

  return Object.keys(grouped)
    .sort()
    .map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));
};
export default function ContactsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load contacts from storage
  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem("contacts");
      const loaded = stored ? JSON.parse(stored) : [];
      setContacts(loaded);
      updateFilteredContacts(loaded, "");
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update filtered and grouped contacts
  const updateFilteredContacts = (list: Contact[], search: string) => {
    let filtered = list;
    if (search.trim()) {
      filtered = list.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search),
      );
    }
    setFilteredContacts(filtered.sort((a, b) => a.name.localeCompare(b.name)));
  };

  // Load contacts on screen focus
  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts]),
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilteredContacts(contacts, query);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Contact", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = contacts.filter((c) => c.id !== id);
          setContacts(updated);
          updateFilteredContacts(updated, searchQuery);
          await AsyncStorage.setItem("contacts", JSON.stringify(updated));
        },
      },
    ]);
  };

  const handleEdit = (contact: Contact) => {
    router.push({
      pathname: "/contacts/addContact",
      params: { contact: JSON.stringify(contact) },
    });
  };

  const groupedContacts = groupContactsByLetter(filteredContacts);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/contacts/addContact")}
          activeOpacity={0.7}
        >
          <Plus size={28} color={Colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={Colors.text.secondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Contact List */}
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Phone size={48} color={Colors.text.secondary} />
          <Text style={styles.emptyText}>No contacts found</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push("/contacts/addContact")}
          >
            <Text style={styles.emptyButtonText}>Add a contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={groupedContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <TouchableOpacity
                style={styles.contactInfo}
                onPress={() => router.push(`/contacts/${item.id}`)}
              >
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{item.phone}</Text>
                  {item.email && (
                    <Text style={styles.contactEmail}>{item.email}</Text>
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(item)}
                >
                  <Edit2 size={20} color={Colors.primary.main} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Trash2 size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  title: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  addButton: {
    padding: Spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.text.primary,
    backgroundColor: Colors.neutral.gray100,
  },
  listContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.default,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  contactInfo: {
    flex: 1,
  },
  contactDetails: {
    gap: Spacing.xs,
  },
  contactName: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  contactPhone: {
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
  },
  contactEmail: {
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
  },
  contactActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },
  actionButton: {
    padding: Spacing.sm,
    borderRadius: 6,
    backgroundColor: Colors.neutral.gray100,
  },
  deleteButton: {
    backgroundColor: "#FEE8E8",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary.main,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
});
