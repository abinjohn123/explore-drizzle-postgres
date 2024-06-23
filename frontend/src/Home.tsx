import {
  ResponsiveContainer,
  LineChart,
  YAxis,
  Line,
  XAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  Heading,
} from 'react-aria-components';
import clsx from 'clsx';

import useCustomSWR from './api';
import { Exercise } from './types';
import Header from './components/Header';
import { getGreeting } from './utils';
import DatePill from './components/DatePill';

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

const CHART_DATA = [
  { date: '2024-01-01', value: 150 },
  { date: '2024-01-15', value: 180 },
  { date: '2024-02-01', value: 160 },
  { date: '2024-02-15', value: 200 },
  { date: '2024-03-01', value: 220 },
  { date: '2024-03-15', value: 210 },
  { date: '2024-04-01', value: 250 },
  { date: '2024-04-15', value: 270 },
  { date: '2024-05-01', value: 260 },
  { date: '2024-05-15', value: 300 },
];

function App() {
  return (
    <div className="flex flex-col gap-4">
      <Header title={getGreeting()}>
        <DatePill />
      </Header>
    </div>
  );
}

export default App;
