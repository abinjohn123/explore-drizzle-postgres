import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import './index.css';
import LogWorkout from './pages/log-workout/index.tsx';

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
    <div className="max-w-md bg-slate-50 min-h-screen mx-auto p-4">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
