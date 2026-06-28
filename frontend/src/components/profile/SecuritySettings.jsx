import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const SecuritySettings = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast.success(`Password reset email sent to ${currentUser.email}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <h2 className="text-2xl font-black uppercase tracking-widest border-b border-current border-opacity-10 pb-4">
        Security & Settings
      </h2>
      <div className="flex flex-col gap-4 border border-current border-opacity-20 p-6 rounded">
        <div>
          <h3 className="font-bold uppercase tracking-widest mb-1">Reset Password</h3>
          <p className="text-sm opacity-60 mb-4">
            We will send a password reset link to your registered email address securely via Firebase.
          </p>
        </div>
        <button 
          onClick={handlePasswordReset}
          disabled={isLoading}
          className="w-fit p-3 font-bold uppercase tracking-widest border border-current hover:bg-current hover:text-white transition-colors duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
