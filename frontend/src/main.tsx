import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';

import Home from './Home.tsx';
import './index.css';
import LogWorkout from './pages/log-workout/index.tsx';
import App from './App.tsx';
import GlobalError from './components/GlobalError.tsx';
import { ROUTES } from './routes/index.ts';

export const TEST_USER_ID = 4;

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.NEW_WORKOUT,
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
