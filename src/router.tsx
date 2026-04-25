import { createHashRouter } from 'react-router-dom';
import { LauncherPage } from './launcher/LauncherPage';
import { ChoresLayout } from './apps/chores/ChoresLayout';
import { FamilyBoardPage } from './apps/chores/pages/FamilyBoardPage';
import { ChoreListPage } from './apps/chores/pages/ChoreListPage';
import { RewardsPage } from './apps/chores/pages/RewardsPage';
import { ParentDashboard } from './apps/chores/pages/ParentDashboard';

export const router = createHashRouter([
  { path: '/', element: <LauncherPage /> },
  {
    path: '/apps/chores',
    element: <ChoresLayout />,
    children: [
      { index: true, element: <FamilyBoardPage /> },
      { path: ':kidId', element: <ChoreListPage /> },
      { path: ':kidId/rewards', element: <RewardsPage /> },
      { path: 'parent', element: <ParentDashboard /> },
    ],
  },
]);
