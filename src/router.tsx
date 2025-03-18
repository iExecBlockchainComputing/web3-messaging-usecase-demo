import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import AddProtectedData from './views/profile/addProtectedData.tsx';
import ProtectedDataList from './views/profile/protectedDataList.tsx';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/" />,
      },
      {
        path: '/profile',
        element: <ProtectedDataList />,
      },
      {
        path: '/profile/add-protected-data',
        element: <AddProtectedData />,
      },
    ],
  },
]);
