import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountDetails from '../components/profile/AccountDetails';
import OrderHistory from '../components/profile/OrderHistory';
import SecuritySettings from '../components/profile/SecuritySettings';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account Details' },
    { id: 'orders', label: 'Order History' },
    { id: 'security', label: 'Security' },
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-inherit text-current pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex flex-col gap-8 shrink-0">
        {/* User Card */}
        <div className="flex items-center gap-4 border border-current border-opacity-20 p-4 rounded transition-transform hover:scale-[1.01]">
          <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center overflow-hidden shrink-0">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-2xl uppercase">{currentUser.email?.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-black uppercase truncate tracking-tight">{currentUser.displayName || 'User'}</span>
            <span className="text-xs opacity-60 truncate font-medium">{currentUser.email}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 font-bold uppercase tracking-widest transition-all duration-200 border-l-4 ${
                activeTab === tab.id 
                  ? 'border-current opacity-100 scale-[1.02]' 
                  : 'border-transparent opacity-50 hover:opacity-80 hover:border-current hover:border-opacity-30'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          <div className="h-px w-full bg-current opacity-10 my-4" />
          
          <button
            onClick={() => logout()}
            className="text-left px-4 py-3 font-bold uppercase tracking-widest transition-all duration-200 border-l-4 border-transparent opacity-50 hover:opacity-100 text-red-500 hover:border-red-500 hover:text-red-500"
          >
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex justify-start">
        {activeTab === 'account' && <AccountDetails />}
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'security' && <SecuritySettings />}
      </main>

    </div>
  );
};

export default Profile;
