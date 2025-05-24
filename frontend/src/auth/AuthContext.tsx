import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { supabaseClient } from './lib';

interface AuthContextType {
  client: SupabaseClient;
  user: User | null;
  session: Session | null;
  loading: boolean;
  submitting: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProps> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    setSubmitting(true);

    try {
      await supabaseClient.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  useEffect(() => {
    try {
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // listen for changes to auth state
      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth state error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      client: supabaseClient,
      user,
      session,
      loading,
      submitting,
      signOut,
    }),
    [user, session, loading, submitting, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }

  return context;
};
