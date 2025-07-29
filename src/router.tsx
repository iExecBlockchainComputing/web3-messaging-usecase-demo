import Resources from '@/views/resources';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import { getBasename } from './utils/getBasename.ts';
import ContactList from './views/contact/contactList.tsx';
import SendMessage from './views/contact/sendMessage.tsx';
import AddProtectedData from './views/myData/addProtectedData.tsx';
import ProtectedData from './views/myData/protectedData.tsx';
import ProtectedDataList from './views/myData/protectedDataList.tsx';

export const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        {
          index: true,
          path: '*',
          element: <Navigate to="/my-data" />,
        },
        {
          path: '/my-data',
          element: <ProtectedDataList />,
        },
        {
          path: '/my-data/add-protected-data',
          element: <AddProtectedData />,
        },
        {
          path: '/my-data/:protectedDataAddress',
          element: <ProtectedData />,
        },
        {
          path: '/contacts',
          element: <ContactList />,
        },
        {
          path: '/contacts/:protectedDataAddress/send-message',
          element: <SendMessage />,
        },
        {
          path: '/resources',
          element: <Resources />,
        },
      ],
    },
  ],
  {
    basename: getBasename(),
  }
);
