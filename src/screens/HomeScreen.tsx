import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatabaseService from '../services/DatabaseService';
import {Measurement, User} from '../models';
import {formatDate, classifyBloodPressure, getColorForClassification} from '../utils/calculations';

interface HomeScreenProps {
  route: any;
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({route, navigation}) => {
  const {userId} = route.params;
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
  });

  const loadData = useCallback(async () => {
    try {
      const userData = await DatabaseService.getUserById(userId);
      const measurementsData = await DatabaseService.getCurrentWeekMeasurements(userId);
      setUser(userData);
      setMeasurements(measurementsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Could not load data');
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleDeleteMeasurement = (id: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Do you really want to delete this measurement?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deleteMeasurement(id);
              loadData();
            } catch (error) {
              console.error('Error deleting measurement:', error);
              Alert.alert('Error', 'Could not delete measurement');
            }
          },
        },
      ],
    );
  };

  const handleEditUser = () => {
    if (!user) return;
    setFormData({
      name: user.name,
      age: user.age.toString(),
      weight: user.weight.toString(),
      height: user.height.toString(),
    });
    setEditModalVisible(true);
  };

  const handleSaveUser = async () => {
    if (!formData.name || !formData.age || !formData.weight || !formData.height) {
      Alert.alert('Error', 'Fill in all fields');
      return;
    }

    try {
      await DatabaseService.updateUser({
        id: userId,
        name: formData.name,
        age: parseInt(formData.age, 10),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
      });
      
      setEditModalVisible(false);
      loadData();
      Alert.alert('Success', 'Data updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Could not update data');
    }
  };

  const handleDeleteUser = () => {
    Alert.alert(
      'Confirm Deletion',
      `Do you really want to delete user ${user?.name}? All measurements will also be deleted.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deleteUser(userId);
              Alert.alert('Success', 'User deleted!', [
                {text: 'OK', onPress: () => navigation.navigate('UserSelection')},
              ]);
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Could not delete user');
            }
          },
        },
      ],
    );
  };

  const handleShareReport = async () => {
    if (!user || measurements.length === 0) {
      Alert.alert('Warning', 'At least one measurement is required to generate the report');
      return;
    }

    try {
      const stats = await DatabaseService.getStatistics(userId);
      if (!stats) return;

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US');
      const timeStr = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});

      let report = '═══════════════════════════════\n';
      report += '   BLOOD PRESSURE REPORT\n';
      report += '═══════════════════════════════\n\n';

      report += '👤 PATIENT\n';
      report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      report += `Name: ${user.name}\n`;
      report += `Age: ${user.age} years\n`;
      report += `Weight: ${user.weight} kg\n`;
      report += `Height: ${user.height} cm\n`;
      report += `BMI: ${stats.imc.toFixed(1)} (${stats.imcClassification})\n\n`;

      report += '📊 GENERAL STATISTICS\n';
      report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      report += `Total measurements: ${stats.totalMeasurements}\n`;
      report += `Average pressure: ${Math.round(stats.avgSystolic)}/${Math.round(stats.avgDiastolic)} mmHg\n`;
      report += `Average heart rate: ${Math.round(stats.avgHeartRate)} BPM\n`;
      report += `General classification: ${stats.classification}\n\n`;

      const recentMeasurements = measurements.slice(0, 10);
      report += `📋 LAST ${recentMeasurements.length} MEASUREMENTS\n`;
      report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      
      recentMeasurements.forEach((m, index) => {
        const classification = classifyBloodPressure(m.systolic, m.diastolic);
        const date = new Date(m.date);
        const dateFormatted = date.toLocaleDateString('en-US');
        const timeFormatted = date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
        
        report += `${index + 1}. ${dateFormatted} at ${timeFormatted}\n`;
        report += `   ${m.systolic}/${m.diastolic} mmHg - ${m.heartRate} BPM\n`;
        report += `   ${classification}\n`;
        if (m.notes) {
          report += `   Note: ${m.notes}\n`;
        }
        report += '\n';
      });

      report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
      report += `Report generated on: ${dateStr} at ${timeStr}\n`;
      report += 'App: Health Pressure\n';
      report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
      report += '⚠️ IMPORTANT: This report is for\n';
      report += 'personal monitoring purposes. Always\n';
      report += 'consult a qualified healthcare professional.\n';

      await Share.share({
        message: report,
        title: `Blood Pressure Report - ${user.name}`,
      });
    } catch (error) {
      console.error('Error sharing report:', error);
      Alert.alert('Error', 'Could not share the report');
    }
  };

  const renderMeasurement = ({item}: {item: Measurement}) => {
    const classification = classifyBloodPressure(item.systolic, item.diastolic);
    const color = getColorForClassification(classification);

    return (
      <TouchableOpacity
        style={[styles.measurementCard, {borderLeftColor: color}]}
        onLongPress={() => handleDeleteMeasurement(item.id!)}>
        <View style={styles.measurementHeader}>
          <Text style={styles.measurementDate}>{formatDate(item.date)}</Text>
          <View style={[styles.badge, {backgroundColor: color}]}>
            <Text style={styles.badgeText}>{classification}</Text>
          </View>
        </View>

        <View style={styles.measurementData}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Systolic</Text>
            <Text style={styles.dataValue}>{item.systolic} mmHg</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Diastolic</Text>
            <Text style={styles.dataValue}>{item.diastolic} mmHg</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>BPM</Text>
            <Text style={styles.dataValue}>{item.heartRate}</Text>
          </View>
        </View>

        {item.notes && (
          <Text style={styles.notes}>Note: {item.notes}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hello, {user?.name}!</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleShareReport}>
              <Icon name="share" size={22} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleEditUser}>
              <Icon name="edit" size={22} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleDeleteUser}>
              <Icon name="delete" size={22} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('UserSelection')}>
              <Icon name="people" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.weekIndicator}>
        <Icon name="calendar-today" size={16} color="#666" />
        <Text style={styles.weekIndicatorText}>Current Week Measurements</Text>
      </View>

      <FlatList
        data={measurements}
        renderItem={renderMeasurement}
        keyExtractor={item => item.id!.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No measurement recorded this week. Add your first measurement!
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMeasurement', {userId})}>
        <Text style={styles.addButtonText}>+ New Measurement</Text>
      </TouchableOpacity>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={formData.name}
                onChangeText={text => setFormData({...formData, name: text})}
              />

              <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={text => setFormData({...formData, age: text})}
              />

              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="decimal-pad"
                value={formData.weight}
                onChangeText={text => setFormData({...formData, weight: text})}
              />

              <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                keyboardType="numeric"
                value={formData.height}
                onChangeText={text => setFormData({...formData, height: text})}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveUser}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSafeArea: {
    backgroundColor: '#3498db',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekIndicator: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekIndicatorText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  measurementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  measurementDate: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  measurementData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dataItem: {
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notes: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
