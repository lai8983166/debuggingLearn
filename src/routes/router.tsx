import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { HomePage } from '@/pages/HomePage';
import { LabsIndexPage } from '@/pages/LabsIndexPage';
import { LabPage } from '@/pages/LabPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'labs', element: <LabsIndexPage /> },
      { path: 'labs/:slug', element: <LabPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
