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
    <div className="min-h-screen bg-brand-900 text-white pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex flex-col gap-6 shrink-0">
        {/* User Card */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-lg backdrop-blur-xl transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="w-full h-full rounded-full bg-brand-900 flex items-center justify-center font-black text-2xl uppercase text-white">{currentUser.email?.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-lg truncate tracking-tight text-white">{currentUser.displayName || 'User'}</span>
            <span className="text-xs text-white/50 truncate font-medium">{currentUser.email}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-5 py-3 font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-white border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          <div className="h-px w-full bg-white/10 my-4" />
          
          <button
            onClick={() => logout()}
            className="text-left px-5 py-3 font-bold uppercase tracking-widest transition-all duration-300 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent"
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
