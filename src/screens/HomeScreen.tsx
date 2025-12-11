import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
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

  const loadData = useCallback(async () => {
    try {
      const userData = await DatabaseService.getUserById(userId);
      const measurementsData = await DatabaseService.getMeasurementsByUserId(userId);
      setUser(userData);
      setMeasurements(measurementsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleDeleteMeasurement = (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta medição?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deleteMeasurement(id);
              loadData();
            } catch (error) {
              console.error('Error deleting measurement:', error);
              Alert.alert('Erro', 'Não foi possível excluir a medição');
            }
          },
        },
      ],
    );
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
            <Text style={styles.dataLabel}>Sistólica</Text>
            <Text style={styles.dataValue}>{item.systolic} mmHg</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Diastólica</Text>
            <Text style={styles.dataValue}>{item.diastolic} mmHg</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>BPM</Text>
            <Text style={styles.dataValue}>{item.heartRate}</Text>
          </View>
        </View>

        {item.notes && (
          <Text style={styles.notes}>Obs: {item.notes}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, {user?.name}!</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserSelection')}>
          <Text style={styles.changeUserText}>Trocar usuário</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={measurements}
        renderItem={renderMeasurement}
        keyExtractor={item => item.id!.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma medição registrada. Adicione sua primeira medição!
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMeasurement')}>
        <Text style={styles.addButtonText}>+ Nova Medição</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  changeUserText: {
    fontSize: 14,
    color: '#fff',
    textDecorationLine: 'underline',
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
});

export default HomeScreen;
