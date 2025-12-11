import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatabaseService from '../services/DatabaseService';
import {Measurement} from '../models';
import {formatDate, classifyBloodPressure, getColorForClassification} from '../utils/calculations';

interface HistoryScreenProps {
  route: any;
}

interface WeekGroup {
  weekStart: string;
  weekEnd: string;
  measurements: Measurement[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({route}) => {
  const {userId} = route.params;
  const [loading, setLoading] = useState(true);
  const [groupedData, setGroupedData] = useState<WeekGroup[]>([]);

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Sunday as start of week
    return new Date(d.setDate(diff));
  };

  const groupByWeeks = useCallback((measurements: Measurement[]): WeekGroup[] => {
    const now = new Date();
    const currentWeekStart = getWeekStart(now);
    
    // Filter out current week
    const historicalMeasurements = measurements.filter(m => {
      const measurementDate = new Date(m.date);
      return measurementDate < currentWeekStart;
    });

    // Sort by date descending
    historicalMeasurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Group by week
    const weeks: Map<string, Measurement[]> = new Map();
    
    historicalMeasurements.forEach(measurement => {
      const date = new Date(measurement.date);
      const weekStart = getWeekStart(date);
      const weekKey = weekStart.toISOString();
      
      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, []);
      }
      weeks.get(weekKey)!.push(measurement);
    });

    // Convert to array
    const result: WeekGroup[] = [];
    weeks.forEach((weekMeasurements, weekStartStr) => {
      const weekStart = new Date(weekStartStr);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      result.push({
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        measurements: weekMeasurements,
      });
    });

    return result;
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const allMeasurements = await DatabaseService.getAllMeasurementsByUserId(userId);
      
      // Group by weeks (excluding current week)
      const grouped = groupByWeeks(allMeasurements);
      setGroupedData(grouped);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, groupByWeeks]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const formatWeekRange = (weekStart: string, weekEnd: string): string => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    const startStr = start.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    const endStr = end.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
    return `${startStr} - ${endStr}`;
  };

  const renderMeasurement = (item: Measurement) => {
    const classification = classifyBloodPressure(item.systolic, item.diastolic);
    const color = getColorForClassification(classification);

    return (
      <View style={[styles.measurementItem, {borderLeftColor: color}]}>
        <View style={styles.measurementRow}>
          <Text style={styles.measurementDate}>{formatDate(item.date)}</Text>
          <View style={[styles.badge, {backgroundColor: color}]}>
            <Text style={styles.badgeText}>{classification}</Text>
          </View>
        </View>
        <View style={styles.measurementValues}>
          <Text style={styles.measurementText}>
            {item.systolic}/{item.diastolic} mmHg • {item.heartRate} BPM
          </Text>
        </View>
        {item.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>
    );
  };

  const renderWeekGroup = ({item}: {item: WeekGroup}) => {
    const avgSystolic = Math.round(
      item.measurements.reduce((sum, m) => sum + m.systolic, 0) / item.measurements.length
    );
    const avgDiastolic = Math.round(
      item.measurements.reduce((sum, m) => sum + m.diastolic, 0) / item.measurements.length
    );

    return (
      <View style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <View>
            <Text style={styles.weekTitle}>{formatWeekRange(item.weekStart, item.weekEnd)}</Text>
            <Text style={styles.weekSubtitle}>
              {item.measurements.length} measurement{item.measurements.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.weekStats}>
            <Text style={styles.weekAverage}>Avg: {avgSystolic}/{avgDiastolic}</Text>
          </View>
        </View>
        
        <View style={styles.measurementsList}>
          {item.measurements.map((measurement, index) => (
            <View key={measurement.id || index}>
              {renderMeasurement(measurement)}
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>History</Text>
          </View>
        </SafeAreaView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
        </View>
      </SafeAreaView>

      {groupedData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No historical data yet</Text>
          <Text style={styles.emptySubtext}>
            Measurements from previous weeks will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupedData}
          renderItem={renderWeekGroup}
          keyExtractor={(item, index) => item.weekStart + index}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  weekCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weekSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  weekStats: {
    alignItems: 'flex-end',
  },
  weekAverage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
  measurementsList: {
    gap: 8,
  },
  measurementItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  measurementDate: {
    fontSize: 13,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  measurementValues: {
    marginBottom: 4,
  },
  measurementText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  notes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HistoryScreen;
