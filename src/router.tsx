import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
]);
