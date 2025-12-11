export interface User {
  id?: number;
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  createdAt?: string;
}

export interface Measurement {
  id?: number;
  userId: number;
  systolic: number; // Pressão sistólica (mmHg)
  diastolic: number; // Pressão diastólica (mmHg)
  heartRate: number; // BPM
  date: string;
  notes?: string;
}

export interface Statistics {
  avgSystolic: number;
  avgDiastolic: number;
  avgHeartRate: number;
  classification: BloodPressureClassification;
  imc: number;
  imcClassification: IMCClassification;
  totalMeasurements: number;
}

export type BloodPressureClassification =
  | 'Hypotension'
  | 'Normal'
  | 'Pre-Hypertension'
  | 'Hypertension Stage 1'
  | 'Hypertension Stage 2'
  | 'Hypertensive Crisis';

export type IMCClassification =
  | 'Underweight'
  | 'Normal weight'
  | 'Overweight'
  | 'Obesity Class I'
  | 'Obesity Class II'
  | 'Obesity Class III';
