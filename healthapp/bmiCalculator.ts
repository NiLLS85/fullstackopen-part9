import { isNotNumber, errorMessage } from './utils.ts';

interface BmiValues {
  height: number;
  weight: number;
}

// Categorías de la OMS (https://en.wikipedia.org/wiki/Body_mass_index)
export const calculateBmi = (heightCm: number, weightKg: number): string => {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be positive numbers');
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 16) return 'Underweight (Severe thinness)';
  if (bmi < 17) return 'Underweight (Moderate thinness)';
  if (bmi < 18.5) return 'Underweight (Mild thinness)';
  if (bmi < 25) return 'Normal range';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese (Class I)';
  if (bmi < 40) return 'Obese (Class II)';
  return 'Obese (Class III)';
};

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  if (isNotNumber(args[2]) || isNotNumber(args[3])) {
    throw new Error('Provided values were not numbers!');
  }
  return {
    height: Number(args[2]),
    weight: Number(args[3])
  };
};

// Solo se leen los argumentos si el archivo se ejecuta directamente
if (process.argv[1] === import.meta.filename) {
  try {
    if (process.argv.length === 2) {
      console.log(calculateBmi(180, 74));
    } else {
      const { height, weight } = parseArguments(process.argv);
      console.log(calculateBmi(height, weight));
    }
  } catch (error: unknown) {
    console.log(errorMessage(error));
  }
}
