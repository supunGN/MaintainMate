import ContactCard, { Contact } from '@/components/molecules/ContactCard';
import { FilterOption } from '@/components/molecules/FilterBar';
import PageHeader from '@/components/molecules/PageHeader';
import ActionSheetModal from '@/components/organisms/ActionSheetModal';
import AddContactModal from '@/components/organisms/AddContactModal';
import CategoryFilterModal from '@/components/organisms/CategoryFilterModal';
import SearchFilterHeader from '@/components/organisms/SearchFilterHeader';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Sample data - replace with actual data later
const SAMPLE_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'James Automobile',
    specialty: 'General Service Center',
    phone: '+94 77 400 50 21',
    category: 'Vehicles',
  },
  {
    id: '2',
    name: 'James Automobile',
    specialty: 'General Service Center',
    phone: '+94 77 400 50 21',
    category: 'Vehicles',
  },
  {
    id: '3',
    name: 'Kumar abc',
    specialty: 'Engine Specialist',
    phone: '+94 77 400 50 21',
    category: 'Vehicles',
  },
];

// Category labels for display
const CATEGORY_LABELS: Record<string, string> = {
  home_appliances: 'Home Appliances',
  vehicles: 'Vehicles',
  entertainment: 'Entertainment',
  computing: 'Computing',
  security: 'Security & Smart',
  other: 'Other',
};

interface ContactSection {
  title: string;
  data: Contact[];
}

export default function ContactsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Contact[]>(SAMPLE_CONTACTS);
  
  // Action Sheet State
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Update filter labels based on selection
  const filters: FilterOption[] = [
    {
      id: 'category',
      label: selectedCategories.length > 0
        ? CATEGORY_LABELS[selectedCategories[0]]
        : 'Category',
      isActive: selectedCategories.length > 0,
    },
    { id: 'specialty', label: 'Specialty', isActive: false },
  ];

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let result = contacts;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort alphabetically
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, contacts]);

  // Group contacts by first letter
  const sectionedContacts = useMemo(() => {
    const sections: ContactSection[] = [];
    const grouped = filteredContacts.reduce((acc, contact) => {
      const firstLetter = contact.name[0].toUpperCase();
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

  const handleFilterPress = useCallback((filterId: string) => {
    if (filterId === 'category') {
      setShowCategoryModal(true);
    } else {
      // TODO: Implement other filter logic
      console.log('Filter pressed:', filterId);
    }
  }, []);

  const handleApplyCategories = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const handleRemoveFilter = useCallback((filterId: string) => {
    if (filterId === 'category') {
      setSelectedCategories([]);
    }
  }, []);

  const handleAddContact = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleSaveContact = useCallback((newContact: { name: string; place: string; phone: string }) => {
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      specialty: newContact.place,
      phone: newContact.phone,
    };
    setContacts((prev) => [...prev, contact]);
    Alert.alert('Success', 'Contact added successfully!');
  }, []);

  const handleContactPress = useCallback((contact: Contact) => {
    console.log('Contact pressed:', contact.name);
    // TODO: Navigate to contact details
  }, []);

  const handleMenuPress = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setShowActionSheet(true);
  }, []);

  const handleCloseActionSheet = useCallback(() => {
    setShowActionSheet(false);
  }, []);

  const handleCallContact = useCallback(() => {
    if (selectedContact) {
      console.log('Calling:', selectedContact.phone);
      // TODO: Implement phone call
      setShowActionSheet(false);
    }
  }, [selectedContact]);

  const handleEditContact = useCallback(() => {
    if (selectedContact) {
      console.log('Editing:', selectedContact.name);
      // TODO: Implement edit
      setShowActionSheet(false);
    }
  }, [selectedContact]);

  const handleDeleteContact = useCallback(() => {
    if (selectedContact) {
      Alert.alert('Delete Contact', `Are you sure you want to delete ${selectedContact.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            setContacts(prev => prev.filter(c => c.id !== selectedContact.id));
            setShowActionSheet(false);
          }
        }
      ]);
    }
  }, [selectedContact]);

  const handleAddPressAction = useCallback(() => {
    handleAddContact();
  }, [handleAddContact]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleCloseCategoryModal = useCallback(() => {
    setShowCategoryModal(false);
  }, []);

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

      {/* Search & Filter */}
      <SearchFilterHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search for Service"
        filters={filters}
        onFilterPress={handleFilterPress}
        onRemoveFilter={handleRemoveFilter}
      />

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
      />

      {/* Add Contact Modal */}
      <AddContactModal
        visible={showAddModal}
        onClose={handleCloseAddModal}
        onSave={handleSaveContact}
      />

      {/* Category Filter Modal */}
      <CategoryFilterModal
        visible={showCategoryModal}
        onClose={handleCloseCategoryModal}
        onApply={handleApplyCategories}
        initialSelected={selectedCategories}
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

  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h3,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
});
