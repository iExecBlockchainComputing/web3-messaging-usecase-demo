import { BookOpen, MessageSquare } from 'react-feather';
import MyDataIcon from '../icons/MyDataIcon';

// navigationItems.js
export const navigationItems = [
  {
    name: 'My data',
    path: '/my-data',
    icon: <MyDataIcon />,
  },
  {
    name: 'Send Messages',
    path: '/contacts',
    icon: <MessageSquare size={20} />,
  },
  {
    name: 'Resources',
    path: '/resources',
    icon: <BookOpen size={20} />,
  },
];
