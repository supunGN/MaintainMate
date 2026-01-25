import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@maintainmate_services';

export interface ServiceRecord {
  id: string;
  category: string;
  itemName: string;
  repairType: string;
  date: string; // MM - DD - YYYY
  cost: string;
  note?: string;
  image?: string;
  createdAt: string;
}

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

export const clearServiceRecords = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing service records:', error);
  }
};
