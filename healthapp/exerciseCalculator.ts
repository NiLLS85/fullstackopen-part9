import { isNotNumber, errorMessage } from './utils.ts';

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

// La nota depende de qué parte del objetivo se ha cumplido de media:
// 3 si se llega, 2 si se llega al 75 % y 1 si se queda por debajo.
export const calculateExercises = (dailyHours: number[], target: number): Result => {
  if (dailyHours.length === 0) {
    throw new Error('At least one day of exercise hours is needed');
  }
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(hours => hours > 0).length;
  const average = dailyHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success = average >= target;
  const ratio = target > 0 ? average / target : 1;

  let rating: Result['rating'];
  let ratingDescription: string;
  if (ratio >= 1) {
    rating = 3;
    ratingDescription = 'great, the target was reached';
  } else if (ratio >= 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// Primer argumento: el objetivo diario; después, las horas de cada día
const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments: give the target and at least one day');
  const values = args.slice(2);
  if (values.some(value => isNotNumber(value))) {
    throw new Error('Provided values were not numbers!');
  }
  const [target, ...dailyHours] = values.map(Number);
  return { target, dailyHours };
};

if (process.argv[1] === import.meta.filename) {
  try {
    if (process.argv.length === 2) {
      console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
    } else {
      const { target, dailyHours } = parseArguments(process.argv);
      console.log(calculateExercises(dailyHours, target));
    }
  } catch (error: unknown) {
    console.log(errorMessage(error));
  }
}
