import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AccessRestricted } from './AccessRestricted';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, platformUser, authLoading, platformUserLoading } = useAuth();

  if (authLoading || platformUserLoading) {
    return (
      <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#1C2E5A] border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  const isApproved = user && platformUser && platformUser.approval_status === 'approved' && platformUser.is_active;

  if (!isApproved) {
    return <AccessRestricted />;
  }

  return <>{children}</>;
};
