import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { supabase } from '../lib/supabase';

export interface PlatformUser {
  auth_user_id: string;
  email?: string;
  full_name: string;
  phone?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_active: boolean;
  pts_hash?: string;
}

interface AuthContextType {
  user: any;
  platformUser: PlatformUser | null;
  authLoading: boolean;
  platformUserLoading: boolean;
  statusMessage: { ar: string; en: string } | null;
  signOut: () => Promise<void>;
  fetchPlatformUser: (userId: string) => Promise<PlatformUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<any>(null);
  const [platformUser, setPlatformUser] =
    useState<PlatformUser | null>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [platformUserLoading, setPlatformUserLoading] = useState(false);

  const [statusMessage, setStatusMessage] =
    useState<{ ar: string; en: string } | null>(null);

  const mountedRef = useRef(true);
  const lastFetchedUserIdRef = useRef<string | null>(null);
  const fetchSequenceRef = useRef(0);

  const fetchPlatformUser = useCallback(
    async (userId: string): Promise<PlatformUser | null> => {
      if (!userId) {
        if (mountedRef.current) {
          setPlatformUser(null);
          setPlatformUserLoading(false);
          setStatusMessage(null);
        }
        return null;
      }

      const sequence = ++fetchSequenceRef.current;
      lastFetchedUserIdRef.current = userId;

      if (mountedRef.current) {
        setPlatformUserLoading(true);
      }

      try {
        const { data, error } = await supabase
          .from('platform_users')
          .select(
            'auth_user_id, full_name, approval_status, is_active, pts_hash'
          )
          .eq('auth_user_id', userId)
          .maybeSingle();

        if (!mountedRef.current || sequence !== fetchSequenceRef.current) {
          return null;
        }

        if (error) {
          console.error('[AUTH] platform user fetch failed:', error.message);

          setPlatformUser(null);
          setStatusMessage({
            ar: 'تعذر تحميل بيانات الحساب. يرجى المحاولة مرة أخرى.',
            en: 'Unable to load account profile. Please try again.'
          });

          return null;
        }

        if (!data) {
          setPlatformUser(null);
          setStatusMessage({
            ar: 'لم يتم العثور على ملف تعريف مرتبط بهذا الحساب.',
            en: 'No profile is linked to this account.'
          });

          return null;
        }

        const mappedUser: PlatformUser = {
          auth_user_id: data.auth_user_id,
          full_name: data.full_name || '',
          approval_status: data.approval_status,
          is_active: data.is_active,
          pts_hash: data.pts_hash
        };

        setPlatformUser(mappedUser);
        setStatusMessage(null);

        return mappedUser;
      } catch (err: any) {
        if (!mountedRef.current || sequence !== fetchSequenceRef.current) {
          return null;
        }

        console.error(
          '[AUTH] unexpected platform user error:',
          err?.message || err
        );

        setPlatformUser(null);
        setStatusMessage({
          ar: 'حدث خطأ أثناء تحميل بيانات حساب الشركة.',
          en: 'An error occurred while loading the company account.'
        });

        return null;
      } finally {
        if (
          mountedRef.current &&
          sequence === fetchSequenceRef.current
        ) {
          setPlatformUserLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    const applySession = (
      session: any,
      shouldFetchProfile: boolean = true
    ) => {
      if (!mountedRef.current) return;

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (!currentUser) {
        fetchSequenceRef.current += 1;
        lastFetchedUserIdRef.current = null;

        setPlatformUser(null);
        setPlatformUserLoading(false);
        setStatusMessage(null);
        setAuthLoading(false);

        return;
      }

      setAuthLoading(false);

      if (
        shouldFetchProfile &&
        lastFetchedUserIdRef.current !== currentUser.id
      ) {
        /*
         * مهم:
         * لا نعمل await لاستدعاء Supabase داخل
         * onAuthStateChange.
         *
         * نفصل عملية جلب platformUser عن callback
         * حتى لا يحدث deadlock في supabase-js.
         */
        window.setTimeout(() => {
          if (!mountedRef.current) return;
          void fetchPlatformUser(currentUser.id);
        }, 0);
      }
    };

    /*
     * المصدر الأول لتهيئة الجلسة عند فتح التطبيق.
     */
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mountedRef.current) return;

        if (error) {
          console.error('[AUTH] getSession error:', error.message);
        }

        const session = data.session;

        if (!session?.user) {
          applySession(null);
          return;
        }

        /*
         * هنا لسنا داخل onAuthStateChange،
         * لذلك يمكننا جلب platformUser بشكل طبيعي.
         */
        setUser(session.user);
        setAuthLoading(false);

        void fetchPlatformUser(session.user.id);
      })
      .catch((err) => {
        if (!mountedRef.current) return;

        console.error('[AUTH] initialization error:', err);

        setUser(null);
        setPlatformUser(null);
        setAuthLoading(false);
        setPlatformUserLoading(false);
      });

    /*
     * مهم:
     * callback هنا ليس async.
     * لا يوجد await لأي Supabase call داخله.
     */
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mountedRef.current) return;

      if (event === 'SIGNED_OUT') {
        applySession(null);
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED' ||
        event === 'INITIAL_SESSION'
      ) {
        /*
         * TOKEN_REFRESHED لن يحتاج إعادة جلب الملف
         * إذا كان لنفس المستخدم وموجود بالفعل.
         */
        const shouldFetchProfile =
          !!session?.user &&
          (
            lastFetchedUserIdRef.current !== session.user.id ||
            !platformUser
          );

        applySession(session, shouldFetchProfile);
      }
    });

    return () => {
      mountedRef.current = false;
      fetchSequenceRef.current += 1;
      subscription.unsubscribe();
    };
  }, [fetchPlatformUser]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('[AUTH] signOut error:', error.message);
      }
    } catch (err) {
      console.error('[AUTH] signOut unexpected error:', err);
    } finally {
      fetchSequenceRef.current += 1;
      lastFetchedUserIdRef.current = null;

      if (mountedRef.current) {
        setUser(null);
        setPlatformUser(null);
        setPlatformUserLoading(false);
        setAuthLoading(false);
        setStatusMessage(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        platformUser,
        authLoading,
        platformUserLoading,
        statusMessage,
        signOut,
        fetchPlatformUser
      }}
    >
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