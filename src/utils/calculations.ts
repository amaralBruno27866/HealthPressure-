import {BloodPressureClassification, IMCClassification} from '../models';

/**
 * Calcula o IMC (Índice de Massa Corporal)
 * @param weight Peso em kg
 * @param height Altura em cm
 * @returns IMC calculado
 */
export const calculateIMC = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

/**
 * Classifica o IMC de acordo com os padrões da OMS
 * @param imc Valor do IMC
 * @returns Classificação do IMC
 */
export const classifyIMC = (imc: number): IMCClassification => {
  if (imc < 18.5) {
    return 'Baixo peso';
  } else if (imc >= 18.5 && imc < 25) {
    return 'Peso normal';
  } else if (imc >= 25 && imc < 30) {
    return 'Sobrepeso';
  } else if (imc >= 30 && imc < 35) {
    return 'Obesidade Grau I';
  } else if (imc >= 35 && imc < 40) {
    return 'Obesidade Grau II';
  } else {
    return 'Obesidade Grau III';
  }
};

/**
 * Classifica a pressão arterial de acordo com os padrões da OMS/AHA
 * @param systolic Pressão sistólica (mmHg)
 * @param diastolic Pressão diastólica (mmHg)
 * @returns Classificação da pressão arterial
 */
export const classifyBloodPressure = (
  systolic: number,
  diastolic: number,
): BloodPressureClassification => {
  if (systolic < 90 || diastolic < 60) {
    return 'Hipotensão';
  } else if (systolic < 120 && diastolic < 80) {
    return 'Normal';
  } else if (
    (systolic >= 120 && systolic < 130) ||
    (diastolic >= 80 && diastolic < 85)
  ) {
    return 'Pré-Hipertensão';
  } else if (
    (systolic >= 130 && systolic < 140) ||
    (diastolic >= 85 && diastolic < 90)
  ) {
    return 'Hipertensão Estágio 1';
  } else if (
    (systolic >= 140 && systolic < 180) ||
    (diastolic >= 90 && diastolic < 120)
  ) {
    return 'Hipertensão Estágio 2';
  } else {
    return 'Crise Hipertensiva';
  }
};

/**
 * Formata a data para exibição
 * @param date String de data
 * @returns Data formatada (dd/mm/yyyy HH:MM)
 */
export const formatDate = (date: string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Retorna a cor baseada na classificação da pressão arterial
 */
export const getColorForClassification = (
  classification: BloodPressureClassification,
): string => {
  switch (classification) {
    case 'Hipotensão':
      return '#3498db'; // Azul
    case 'Normal':
      return '#2ecc71'; // Verde
    case 'Pré-Hipertensão':
      return '#f39c12'; // Amarelo
    case 'Hipertensão Estágio 1':
      return '#e67e22'; // Laranja
    case 'Hipertensão Estágio 2':
      return '#e74c3c'; // Vermelho
    case 'Crise Hipertensiva':
      return '#c0392b'; // Vermelho escuro
    default:
      return '#95a5a6'; // Cinza
  }
};
