import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface AuthContextType {
  client: SupabaseClient;
  user: User | null;
  session: Session | null;
  loading: boolean;
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

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      client: supabase,
      user,
      session,
      loading,
      signOut,
    }),
    [user, session, loading, signOut],
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
