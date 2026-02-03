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

interface ContactSection {
  title: string;
  data: Contact[];
}

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
    }

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
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },

  addText: {
    fontSize: 16,
    color: Colors.primary.main,
    fontWeight: '600',
  },
});
