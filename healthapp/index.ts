import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';
import { isNotNumber } from './utils.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (isNotNumber(height) || isNotNumber(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const heightCm = Number(height);
  const weightKg = Number(weight);
  try {
    res.json({
      weight: weightKg,
      height: heightCm,
      bmi: calculateBmi(heightCm, weightKg)
    });
  } catch {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  const body: unknown = req.body;
  if (!body || typeof body !== 'object' || !('daily_exercises' in body) || !('target' in body)) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  const { daily_exercises, target } = body;
  if (daily_exercises === undefined || daily_exercises === null || target === undefined || target === null) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!Array.isArray(daily_exercises)
    || daily_exercises.length === 0
    || daily_exercises.some((value: unknown) => isNotNumber(value))
    || isNotNumber(target)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const hours = (daily_exercises as unknown[]).map(Number);
  res.json(calculateExercises(hours, Number(target)));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
