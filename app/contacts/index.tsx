import EmptyState from '@/components/atoms/EmptyState';
import SearchInput from '@/components/atoms/SearchInput';
import ContactCard, { Contact } from '@/components/molecules/ContactCard';
import PageHeader from '@/components/molecules/PageHeader';
import ActionSheetModal from '@/components/organisms/ActionSheetModal';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { deleteContact, getContacts } from '@/utils/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Action Sheet State
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Fetch contacts whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [])
  );

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    // Apply search filter (name or specialty)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(lowerQuery) ||
          (contact.specialty && contact.specialty.toLowerCase().includes(lowerQuery))
      );
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

    // Sort alphabetically
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, contacts]);

  // Group contacts by first letter
  const sectionedContacts = useMemo(() => {
    const sections: ContactSection[] = [];
    const grouped = filteredContacts.reduce((acc, contact) => {
      const firstLetter = contact.name[0]?.toUpperCase() || '#';
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {} as Record<string, Contact[]>);

    Object.keys(grouped)
      .sort()
      .forEach((letter) => {
        sections.push({
          title: letter,
          data: grouped[letter],
        });
      });

    return sections;
  }, [filteredContacts]);

  const handleAddPressAction = useCallback(() => {
    router.push('/contacts/add');
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // --- Call Functionality ---
  const makeCall = useCallback((phoneNumber: string) => {
    const url = `tel:${phoneNumber.replace(/\s/g, '')}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }, []);

  const handleContactPress = useCallback((contact: Contact) => {
    Alert.alert(
      'Call Contact',
      `Do you want to call ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => makeCall(contact.phone)
        }
      ]
    );
  }, [makeCall]);

  const handleMenuPress = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setShowActionSheet(true);
  }, []);

  const handleCloseActionSheet = useCallback(() => {
    setShowActionSheet(false);
  }, []);

  const handleCallContact = useCallback(() => {
    if (selectedContact) {
      makeCall(selectedContact.phone);
      setShowActionSheet(false);
    }
  }, [selectedContact, makeCall]);

  const handleEditContact = useCallback(() => {
    if (selectedContact) {
      setShowActionSheet(false);
      router.push({
        pathname: '/contacts/edit/[id]',
        params: {
          id: selectedContact.id,
          name: selectedContact.name,
          phone: selectedContact.phone,
          specialty: selectedContact.specialty,
        }
      });
    }
  }, [selectedContact, router]);

  const handleDeleteContact = useCallback(() => {
    if (selectedContact) {
      Alert.alert('Delete Contact', `Are you sure you want to delete ${selectedContact.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact(selectedContact.id);
              fetchContacts();
              setShowActionSheet(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete contact');
            }
          }
        }
      ]);
    }
  }, [selectedContact]);
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <PageHeader
        title="Service Contacts"
        showBackButton
        onBackPress={handleBack}
        rightAction={
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPressAction}
            activeOpacity={0.7}
          >
            <Plus size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        }
      />
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

      {/* Search Input Only */}
      <View style={styles.searchWrapper}>
        <SearchInput
          placeholder="Search for Contact"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Contact List */}
      <SectionList
        sections={sectionedContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onPress={() => handleContactPress(item)}
            onMenuPress={() => handleMenuPress(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="No contacts found"
              subtitle="Add your service providers and mechanics here"
            />
          ) : null
        }
      />

      {/* Action Sheet */}
      <ActionSheetModal
        visible={showActionSheet}
        onClose={handleCloseActionSheet}
        title={selectedContact?.name || 'Contact Actions'}
        actions={[
          {
            id: 'call',
            label: 'Call Contact',
            icon: 'call-outline',
            onPress: handleCallContact,
          },
          {
            id: 'edit',
            label: 'Edit Contact',
            icon: 'pencil-outline',
            onPress: handleEditContact,
          },
          {
            id: 'delete',
            label: 'Delete Contact',
            icon: 'trash-outline',
            variant: 'destructive',
            onPress: handleDeleteContact,
          },
        ]}
      />
    </View>
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
  searchWrapper: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
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
    padding: Spacing.screenHorizontal,
    paddingBottom: 120,
    flexGrow: 1,
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

  addText: {
    fontSize: 16,
    color: Colors.primary.main,
    fontWeight: '600',
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
