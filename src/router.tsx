import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import AddProtectedData from './views/myData/addProtectedData.tsx';
import ProtectedDataList from './views/myData/protectedDataList.tsx';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/" />,
      },
      {
        path: '/my-data',
        element: <ProtectedDataList />,
      },
      {
        path: '/my-data/add-protected-data',
        element: <AddProtectedData />,
      },
    ],
  },
]);
