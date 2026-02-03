import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@maintainmate_services';
const CONTACTS_STORAGE_KEY = '@maintainmate_contacts';

export interface ServiceRecord {
  id: string;
  category: string;
  itemName: string;
  repairType: string;
  date: string; // MM - DD - YYYY
  cost: string;
  note?: string;
  image?: string;
  reminderId?: string | null; // ID of the scheduled local notification
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  category?: string;
  image?: any;
}

// --- Service Functions ---

export const saveServiceRecord = async (record: Omit<ServiceRecord, 'id' | 'createdAt'>) => {
  try {
    const existingData = await getServiceRecords();
    const newRecord: ServiceRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedData = [newRecord, ...existingData];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return newRecord;
  } catch (error) {
    console.error('Error saving service record:', error);
    throw error;
  }
};

export const getServiceRecords = async (): Promise<ServiceRecord[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error fetching service records:', error);
    return [];
  }
};

export const updateServiceRecord = async (id: string, updatedFields: Partial<ServiceRecord>) => {
  try {
    const records = await getServiceRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    const updatedRecord = { ...records[index], ...updatedFields };
    records[index] = updatedRecord;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return updatedRecord;
  } catch (error) {
    console.error('Error updating service record:', error);
    throw error;
  }
};

export const deleteServiceRecord = async (id: string) => {
  try {
    const records = await getServiceRecords();
    const filteredRecords = records.filter(r => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
  } catch (error) {
    console.error('Error deleting service record:', error);
    throw error;
  }
};

export const clearServiceRecords = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing service records:', error);
  }
};

// --- Contact Functions ---

export const saveContact = async (contact: Omit<Contact, 'id'>) => {
  try {
    const existingContacts = await getContacts();
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
    };
    const updatedContacts = [newContact, ...existingContacts];
    await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
    return newContact;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};

export const updateContact = async (id: string, updatedFields: Partial<Contact>) => {
  try {
    const contacts = await getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedContact = { ...contacts[index], ...updatedFields };
    contacts[index] = updatedContact;

    await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContact = async (id: string) => {
  try {
    const contacts = await getContacts();
    const filteredContacts = contacts.filter(c => c.id !== id);
    await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(filteredContacts));
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};
