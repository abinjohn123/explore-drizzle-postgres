import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';

import Home from './Home.tsx';
import './index.css';
import LogWorkout from './pages/log-workout/index.tsx';
import App from './App.tsx';
import GlobalError from './components/GlobalError.tsx';

export const TEST_USER_ID = 4;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/log-workout',
        element: <LogWorkout />,
      },
    ],
    errorElement: <GlobalError />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  </React.StrictMode>,
);
