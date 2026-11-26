import { useState } from 'react';
import { Visibility, Weather, type NewDiaryEntry } from '../types';

interface DiaryFormProps {
  onSubmit: (entry: NewDiaryEntry) => Promise<boolean>;
}

const DiaryForm = ({ onSubmit }: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const ok = await onSubmit({ date, visibility, weather, comment });
    if (ok) {
      setDate('');
      setComment('');
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={(event) => { void submit(event); }}>
        <div>
          date{' '}
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          visibility{' '}
          {Object.values(Visibility).map(value => (
            <label key={value}>
              <input
                type="radio"
                name="visibility"
                value={value}
                checked={visibility === value}
                onChange={() => setVisibility(value)}
              />
              {value}{' '}
            </label>
          ))}
        </div>
        <div>
          weather{' '}
          {Object.values(Weather).map(value => (
            <label key={value}>
              <input
                type="radio"
                name="weather"
                value={value}
                checked={weather === value}
                onChange={() => setWeather(value)}
              />
              {value}{' '}
            </label>
          ))}
        </div>
        <div>
          comment{' '}
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default DiaryForm;
