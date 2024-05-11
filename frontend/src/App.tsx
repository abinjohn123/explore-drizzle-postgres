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

import customSWR from './api';
import { Exercise } from './types';
import Header from './components/Header';

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
      <Header title="Bench Press" />
      <div className="relative">
        <p className="text-slate-300 text-sm absolute right-4 bottom-12">
          Last 30 days' progress
        </p>
        <ResponsiveContainer width="100%" height={300}>
          {/* <LineChart data={CHART_DATA}>
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        </LineChart> */}

          <AreaChart data={CHART_DATA}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip />
            <XAxis dataKey="date" className="text-xs" tickLine={false} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <hr className="border border-solid border-slate-800" />
      <Calendar aria-label="Appointment date" className="w-full">
        <header className="flex items-center justify-between">
          <Button slot="previous">
            <span className="material-symbols-rounded text-2xl text-slate-600 flex items-center size-6">
              arrow_back
            </span>
          </Button>
          <Heading className="text-sm font-semibold text-slate-400" />
          <Button slot="next">
            <span className="material-symbols-rounded text-2xl text-slate-600 flex items-center size-6">
              arrow_forward
            </span>
          </Button>
        </header>
        <CalendarGrid className="w-full text-xs font-semibold text-slate-500">
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="text-xs font-bold text-center">
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <CalendarCell
                date={date}
                className={clsx(
                  'p-1 text-center rounded-full size-6 mx-auto outline-violet-300',
                  Math.random() > 0.8 && 'bg-violet-800 text-slate-300'
                )}
              />
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    </div>
  );
}

export default App;
