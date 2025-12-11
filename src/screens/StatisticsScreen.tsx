import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DatabaseService from '../services/DatabaseService';
import {Statistics} from '../models';
import {getColorForClassification} from '../utils/calculations';

interface StatisticsScreenProps {
  route: any;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({route}) => {
  const {userId} = route.params;
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await DatabaseService.getStatistics(userId);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!statistics) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Não foi possível carregar as estatísticas</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Estatísticas</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medições Totais</Text>
          <Text style={styles.cardValue}>{statistics.totalMeasurements}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>IMC (Índice de Massa Corporal)</Text>
          <Text style={styles.cardValue}>{statistics.imc}</Text>
          <Text style={styles.cardSubtitle}>{statistics.imcClassification}</Text>
        </View>

        {statistics.totalMeasurements > 0 && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Pressão Arterial Média</Text>
              <View style={styles.pressureContainer}>
                <View style={styles.pressureItem}>
                  <Text style={styles.pressureLabel}>Sistólica</Text>
                  <Text style={styles.pressureValue}>
                    {statistics.avgSystolic} mmHg
                  </Text>
                </View>
                <View style={styles.pressureItem}>
                  <Text style={styles.pressureLabel}>Diastólica</Text>
                  <Text style={styles.pressureValue}>
                    {statistics.avgDiastolic} mmHg
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Frequência Cardíaca Média</Text>
              <Text style={styles.cardValue}>{statistics.avgHeartRate} BPM</Text>
            </View>

            <View
              style={[
                styles.classificationCard,
                {
                  backgroundColor: getColorForClassification(
                    statistics.classification,
                  ),
                },
              ]}>
              <Text style={styles.classificationTitle}>Classificação Geral</Text>
              <Text style={styles.classificationValue}>
                {statistics.classification}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Sobre as Classificações</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Hipotensão:</Text> {'<'}90/60 mmHg
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Normal:</Text> {'<'}120/80 mmHg
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Pré-Hipertensão:</Text> 120-129/80-84 mmHg
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Hipertensão Estágio 1:</Text> 130-139/85-89 mmHg
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Hipertensão Estágio 2:</Text> 140-179/90-119 mmHg
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Crise Hipertensiva:</Text> {'>'}180/120 mmHg
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 18,
    color: '#3498db',
    marginTop: 4,
    fontWeight: '600',
  },
  pressureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  pressureItem: {
    alignItems: 'center',
  },
  pressureLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  pressureValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  classificationCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  classificationTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  classificationValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  infoBold: {
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});

export default StatisticsScreen;
