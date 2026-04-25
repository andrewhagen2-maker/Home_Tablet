import { Outlet } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';

export function ChoresLayout() {
  return (
    <>
      <BackButton />
      <Outlet />
    </>
  );
}
