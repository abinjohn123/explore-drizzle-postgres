import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';

import App from './App.tsx';
import './index.css';
import LogWorkout from './pages/log-workout/index.tsx';

export const TEST_USER_ID = 4;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/log-workout',
    element: <LogWorkout />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="mx-auto h-screen max-w-md bg-slate-50 p-4">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  </React.StrictMode>,
);
