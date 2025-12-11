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
  | 'Hipotensão'
  | 'Normal'
  | 'Pré-Hipertensão'
  | 'Hipertensão Estágio 1'
  | 'Hipertensão Estágio 2'
  | 'Crise Hipertensiva';

export type IMCClassification =
  | 'Baixo peso'
  | 'Peso normal'
  | 'Sobrepeso'
  | 'Obesidade Grau I'
  | 'Obesidade Grau II'
  | 'Obesidade Grau III';
