import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const VisitorTracker = () => {
  // Visitor count tracking has been moved to useVisitorTracking (site_visits table)
  // We no longer attempt to update platform_settings directly from the frontend
  // to prevent RLS security issues.
  return null;
};
