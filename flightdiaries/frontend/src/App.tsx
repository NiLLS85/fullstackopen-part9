import { useEffect, useState } from 'react';
import axios from 'axios';
import diaryService from './services/diaryService';
import DiaryForm from './components/DiaryForm';
import DiaryList from './components/DiaryList';
import Notification from './components/Notification';
import type { NewDiaryEntry, NonSensitiveDiaryEntry } from './types';

interface ValidationIssue {
  path?: (string | number)[];
  message: string;
}

const isIssueList = (value: unknown): value is ValidationIssue[] =>
  Array.isArray(value) && value.every(item =>
    typeof item === 'object' && item !== null && 'message' in item
  );

const errorText = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (data && typeof data === 'object' && 'error' in data) {
      if (typeof data.error === 'string') {
        return data.error;
      }
      if (isIssueList(data.error)) {
        return data.error
          .map(issue => issue.path && issue.path.length > 0
            ? `${issue.path.join('.')}: ${issue.message}`
            : issue.message)
          .join('; ');
      }
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
};

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    diaryService.getAll()
      .then(data => setDiaries(data))
      .catch((error: unknown) => setErrorMessage(errorText(error)));
  }, []);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const addDiary = async (entry: NewDiaryEntry): Promise<boolean> => {
    try {
      const added = await diaryService.create(entry);
      setDiaries(diaries.concat({
        id: added.id,
        date: added.date,
        weather: added.weather,
        visibility: added.visibility,
      }));
      setErrorMessage(null);
      return true;
    } catch (error: unknown) {
      showError(`Error: ${errorText(error)}`);
      return false;
    }
  };

  return (
    <div>
      <Notification message={errorMessage} />
      <DiaryForm onSubmit={addDiary} />
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
