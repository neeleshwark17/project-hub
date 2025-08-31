import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}