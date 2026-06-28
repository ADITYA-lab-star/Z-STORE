import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const AccountDetails = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      await updateProfile(currentUser, { displayName, photoURL });
      
      // Sync with our backend
      const token = await currentUser.getIdToken();
      await fetch("http://localhost:5000/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <h2 className="text-2xl font-black uppercase tracking-widest border-b border-current border-opacity-10 pb-4">
        Account Details
      </h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider opacity-60">Email Address (Read-Only)</label>
          <input 
            type="email" 
            value={currentUser?.email || ''} 
            disabled 
            className="p-3 border border-current border-opacity-20 rounded bg-transparent opacity-50 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider opacity-60">Display Name</label>
          <input 
            type="text" 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="John Doe"
            className="p-3 border border-current border-opacity-20 rounded bg-transparent focus:outline-none focus:border-opacity-100 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider opacity-60">Photo URL</label>
          <input 
            type="url" 
            value={photoURL} 
            onChange={(e) => setPhotoURL(e.target.value)}
            placeholder="https://example.com/avatar.png"
            className="p-3 border border-current border-opacity-20 rounded bg-transparent focus:outline-none focus:border-opacity-100 transition-colors"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-4 p-4 font-black tracking-widest uppercase border border-current hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AccountDetails;
