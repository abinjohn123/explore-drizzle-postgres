import customSWR from './api';
import { Exercise } from './types';

const USER_ID = 2;

const EXERCISE = {
  id: 1,
  created_at: '2021-06-25T16:18:22.939Z',
  created_by: 2,
  name: 'Bench Press',
  type: 'Strength',
  sets: [
    {
      id: 1,
      created_at: '2021-06-25T16:18:22.939Z',
      reps: 10,
      weight: 200,
    },
    {
      id: 2,
      created_at: '2021-06-25T16:18:22.939Z',
      reps: 10,
      weight: 200,
    },
  ],
};

function App() {
  return (
    <div className="flex flex-col">
      <header>
        <h1 className="text-4xl font-semibold line-clamp-2 text-white">
          Bench press and some more stuff that this text should truncate
        </h1>
      </header>
    </div>
  );
}

export default App;
