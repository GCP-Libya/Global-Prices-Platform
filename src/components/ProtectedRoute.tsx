import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { AccessRestricted } from './AccessRestricted';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, loading: settingsLoading } = useSettings();
  const { user, platformUser, authLoading, platformUserLoading } = useAuth();

  // If settings are still loading, show a clean fast spinner to prevent flashing
  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#1C2E5A] border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  // When auth_ui_enabled is false, the sign in system is temporarily paused.
  // Access to reports and analytics is open to everyone without login or platformUser restrictions.
  if (!settings.authUiEnabled) {
    return <>{children}</>;
  }

  // When auth_ui_enabled is true, auth and approval restrictions are strictly enforced
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
