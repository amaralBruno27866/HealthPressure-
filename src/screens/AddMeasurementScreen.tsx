import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DatabaseService from '../services/DatabaseService';
import {classifyBloodPressure, getColorForClassification} from '../utils/calculations';

interface AddMeasurementScreenProps {
  route: any;
  navigation: any;
}

const AddMeasurementScreen: React.FC<AddMeasurementScreenProps> = ({
  route,
  navigation,
}) => {
  const {userId} = route.params;
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');

  const classification =
    systolic && diastolic
      ? classifyBloodPressure(parseInt(systolic, 10), parseInt(diastolic, 10))
      : null;

  const handleSave = async () => {
    if (!systolic || !diastolic || !heartRate) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const systolicValue = parseInt(systolic, 10);
    const diastolicValue = parseInt(diastolic, 10);
    const heartRateValue = parseInt(heartRate, 10);

    if (
      systolicValue < 50 ||
      systolicValue > 250 ||
      diastolicValue < 30 ||
      diastolicValue > 150 ||
      heartRateValue < 30 ||
      heartRateValue > 220
    ) {
      Alert.alert('Erro', 'Os valores informados estão fora do intervalo normal');
      return;
    }

    try {
      await DatabaseService.addMeasurement({
        userId,
        systolic: systolicValue,
        diastolic: diastolicValue,
        heartRate: heartRateValue,
        date: new Date().toISOString(),
        notes: notes || undefined,
      });

      Alert.alert('Sucesso', 'Medição registrada com sucesso!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error saving measurement:', error);
      Alert.alert('Erro', 'Não foi possível salvar a medição');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Nova Medição</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pressão Sistólica (mmHg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="120"
            keyboardType="numeric"
            value={systolic}
            onChangeText={setSystolic}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pressão Diastólica (mmHg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="80"
            keyboardType="numeric"
            value={diastolic}
            onChangeText={setDiastolic}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequência Cardíaca (BPM) *</Text>
          <TextInput
            style={styles.input}
            placeholder="70"
            keyboardType="numeric"
            value={heartRate}
            onChangeText={setHeartRate}
          />
        </View>

        {classification && (
          <View
            style={[
              styles.classificationBadge,
              {backgroundColor: getColorForClassification(classification)},
            ]}>
            <Text style={styles.classificationText}>{classification}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observações (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Medição após exercício"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Medição</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  classificationBadge: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  classificationText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddMeasurementScreen;
