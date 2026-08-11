import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface PlatformUser {
  auth_user_id: string;
  email: string;
  full_name: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_active: boolean;
}

interface AuthContextType {
  user: any;
  platformUser: PlatformUser | null;
  authLoading: boolean;
  platformUserLoading: boolean;
  statusMessage: { ar: string, en: string } | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [platformUserLoading, setPlatformUserLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ ar: string, en: string } | null>(null);
  const fetchingUserIdRef = useRef<string | null>(null);

  const fetchPlatformUser = async (sessionUser: any) => {
    if (!sessionUser) {
      setPlatformUser(null);
      setStatusMessage(null);
      fetchingUserIdRef.current = null;
      setPlatformUserLoading(false);
      return;
    }

    if (fetchingUserIdRef.current === sessionUser.id) {
      return; // Already fetched or fetching for this user
    }
    fetchingUserIdRef.current = sessionUser.id;
    setPlatformUserLoading(true);

    console.time('platform-user-fetch');
    try {
      const { data, error } = await supabase
        .from('platform_users')
        .select('*')
        .eq('auth_user_id', sessionUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching platform user:', error);
        setPlatformUser(null);
        setStatusMessage({
          ar: 'تعذر جلب بيانات المستخدم، يرجى المحاولة لاحقاً',
          en: 'Failed to fetch user data, please try again later'
        });
        return;
      }

      if (data) {
        setPlatformUser(data as PlatformUser);
        setStatusMessage(null);
      } else {
        const newUser = {
          auth_user_id: sessionUser.id,
          email: sessionUser.email,
          full_name: sessionUser.user_metadata?.full_name || '',
          approval_status: 'pending',
          is_active: true
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('platform_users')
          .insert(newUser)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating platform user:', insertError);
          setPlatformUser(null);
          setStatusMessage({
            ar: 'تعذر تهيئة حسابك، يرجى التواصل مع الدعم',
            en: 'Could not initialize your account, please contact support'
          });
        } else {
          setPlatformUser(insertedData as PlatformUser);
          setStatusMessage(null);
        }
      }
    } catch (err) {
      console.error('Unexpected error in fetchPlatformUser:', err);
      setPlatformUser(null);
      setStatusMessage({
        ar: 'حدث خطأ غير متوقع',
        en: 'An unexpected error occurred'
      });
    } finally {
      setPlatformUserLoading(false);
      console.timeEnd('platform-user-fetch');
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      console.time('auth-init');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session error:', error.message);
        }
        
        if (isMounted) {
          setUser(session?.user ?? null);
          setAuthLoading(false);
          await fetchPlatformUser(session?.user);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
          setPlatformUserLoading(false);
        }
        console.timeEnd('auth-init');
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        // Only fetch if it's a signed in event or user changed
        if (currentUser && currentUser.id !== fetchingUserIdRef.current) {
           await fetchPlatformUser(currentUser);
        } else if (!currentUser) {
           fetchingUserIdRef.current = null;
           setPlatformUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Signout error:', err);
    } finally {
      setUser(null);
      setPlatformUser(null);
      fetchingUserIdRef.current = null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
       user, 
       platformUser,
       authLoading,
       platformUserLoading,
       statusMessage,
       signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
