import PageHeading from '@/components/atoms/PageHeading';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { getServiceRecords, ServiceRecord, updateServiceRecord, deleteServiceRecord } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Switch,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useRouter } from 'expo-router';

export default function UpcomingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upcomingServices, setUpcomingServices] = useState<ServiceRecord[]>([]);
  
  // Modal states
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Edit form states
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');

  const loadData = useCallback(async () => {
    try {
      const data = await getServiceRecords();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = data
        .filter(s => {
          const [month, day, year] = s.date.split(' - ').map(Number);
          return new Date(year, month - 1, day) > today;
        })
        .sort((a, b) => {
          const dateA = a.date.split(' - ').map(Number);
          const dateB = b.date.split(' - ').map(Number);
          return new Date(dateA[2], dateA[0] - 1, dateA[1]).getTime() - 
                 new Date(dateB[2], dateB[0] - 1, dateB[1]).getTime();
        });

      setUpcomingServices(filtered);
    } catch (error) {
      console.error('Error loading upcoming services:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const calculateDaysLeft = (dateStr: string) => {
    const [month, day, year] = dateStr.split(' - ').map(Number);
    const serviceDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = serviceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleOpenActions = (service: ServiceRecord) => {
    setSelectedService(service);
    setShowActions(true);
  };

  const handleOpenDetails = (service: ServiceRecord) => {
    setSelectedService(service);
    setShowDetails(true);
  };

  const handleMarkAsComplete = async () => {
    if (!selectedService) return;
    
    try {
      setLoading(true);
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')} - ${String(today.getDate()).padStart(2, '0')} - ${today.getFullYear()}`;
      
      await updateServiceRecord(selectedService.id, { date: formattedDate });
      setShowActions(false);
      await loadData();
      Alert.alert('Success', 'Service marked as complete and moved to history.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update service.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!selectedService) return;
    setEditName(selectedService.repairType);
    setEditDate(selectedService.date);
    setShowActions(false);
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedService) return;
    
    try {
      setLoading(true);
      await updateServiceRecord(selectedService.id, {
        repairType: editName,
        date: editDate,
      });
      setShowEdit(false);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update service.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!selectedService) return;

    const performDelete = async () => {
      try {
        setLoading(true);
        await deleteServiceRecord(selectedService.id);
        setShowActions(false);
        setSelectedService(null);
        await loadData();
      } catch (error) {
        Alert.alert('Error', 'Failed to delete service.');
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this service record?');
      if (confirmed) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Service',
        'Are you sure you want to delete this service record?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: performDelete
          },
        ]
      );
    }
  };

  if (loading && upcomingServices.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Upcoming Maintenance</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {upcomingServices.length > 0 ? (
          upcomingServices.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.serviceCard}
              onPress={() => handleOpenDetails(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#000" />
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.itemName}>{item.repairType}</Text>
                <Text style={styles.itemSubName}>{item.itemName}</Text>
                <Text style={styles.itemDate}>
                  {item.date.split(' - ').slice(1, 2).join('')} {new Date(Number(item.date.split(' - ')[2]), Number(item.date.split(' - ')[0]) - 1).toLocaleString('default', { month: 'short' })} • In {calculateDaysLeft(item.date)} days
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.menuButton} 
                onPress={() => handleOpenActions(item)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Upcoming Events</Text>
            <Text style={styles.placeholderSubtext}>
              Your scheduled maintenance will appear here
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Actions Bottom Sheet */}
      <Modal
        visible={showActions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActions(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={styles.bottomSheet}>
             <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>{selectedService?.repairType} Service</Text>
                <TouchableOpacity onPress={() => setShowActions(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
             </View>

             <TouchableOpacity style={styles.actionItem} onPress={handleMarkAsComplete}>
                <Text style={styles.actionText}>Mark as Complete</Text>
                <Ionicons name="checkbox-outline" size={24} color="#000" />
             </TouchableOpacity>

             <View style={styles.actionItem}>
                <Text style={styles.actionText}>Set Remainder</Text>
                <Switch 
                  value={true} 
                  onValueChange={() => {}} 
                  trackColor={{ false: '#E0E0E0', true: '#E0E0E0' }}
                  thumbColor="#FFFFFF"
                />
             </View>

             <TouchableOpacity style={styles.actionItem} onPress={handleEdit}>
                <Text style={styles.actionText}>Edit</Text>
                <Ionicons name="pencil-outline" size={24} color="#000" />
             </TouchableOpacity>

             <TouchableOpacity style={[styles.actionItem, { borderBottomWidth: 0 }]} onPress={handleDelete}>
                <Text style={[styles.actionText, { color: '#E53935' }]}>Delete</Text>
                <Ionicons name="trash-outline" size={24} color="#E53935" />
             </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEdit}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEdit(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>Edit Service</Text>
                <TouchableOpacity onPress={() => setShowEdit(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
             </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name of Service</Text>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Name"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date of Service</Text>
              <TextInput
                style={styles.textInput}
                value={editDate}
                onChangeText={setEditDate}
                placeholder="MM - DD - YYYY"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, (!editName || !editDate) && styles.disabledButton]} 
              onPress={handleSaveEdit}
              disabled={!editName || !editDate}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal
        visible={showDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.fullModalOverlay}>
          <View style={styles.detailsContainer}>
             <View style={styles.detailsHeader}>
                <TouchableOpacity onPress={() => setShowDetails(false)}>
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.detailsTitle}>{selectedService?.itemName}</Text>
                <View style={{ width: 24 }} />
             </View>
             
             <ScrollView showsVerticalScrollIndicator={false}>
               <Image 
                 source={selectedService?.image ? { uri: selectedService.image } : require('@/assets/images/onboarding/onboarding_1.png')} 
                 style={styles.detailsImage}
               />
               
               <View style={styles.indicatorRow}>
                  <View style={[styles.indicator, styles.activeIndicator]} />
                  <View style={styles.indicator} />
               </View>

               <View style={styles.detailsInfoRow}>
                  <View>
                    <Text style={styles.detailsItemName}>{selectedService?.itemName}</Text>
                    <Text style={styles.detailsRepairType}>{selectedService?.repairType} service</Text>
                  </View>
                  <View style={styles.daysBadge}>
                    <Text style={styles.daysBadgeText}>In {selectedService ? calculateDaysLeft(selectedService.date) : 0} days</Text>
                  </View>
               </View>

               <View style={styles.detailsCard}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>
                      {selectedService && `${selectedService.date.split(' - ')[1]} ${new Date(Number(selectedService.date.split(' - ')[2]), Number(selectedService.date.split(' - ')[0]) - 1).toLocaleString('default', { month: 'short' })} ${selectedService.date.split(' - ')[2]}`}
                    </Text>
                  </View>
                  
                  <View style={styles.detailDivider} />
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Notes</Text>
                    <Text style={styles.detailNotes}>{selectedService?.note || 'No notes added'}</Text>
                  </View>
               </View>
             </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light gray background like image
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    backgroundColor: '#E0E0E0', // Gray card like image
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  itemSubName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#777',
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  fullModalOverlay: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  editModal: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#F5F5F5', // Matches image gray style
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999', // Matches disabled/inactive gray text
  },
  disabledButton: {
    opacity: 0.7,
  },
  detailsContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  detailsImage: {
    width: '90%',
    height: 220,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  indicator: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  activeIndicator: {
    width: 20,
    backgroundColor: '#2F7D5A',
  },
  detailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  detailsItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  detailsRepairType: {
    fontSize: 14,
    color: '#777',
    textTransform: 'capitalize',
  },
  daysBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  daysBadgeText: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  detailSection: {
    marginTop: 4,
  },
  detailNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
