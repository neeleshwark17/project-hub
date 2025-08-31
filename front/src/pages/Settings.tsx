import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';

export default function Settings() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-surface">
      <Header 
        title="Settings"
        subtitle="Manage your account and organization preferences"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">
              Welcome, {user?.name || 'User'}!
            </p>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
