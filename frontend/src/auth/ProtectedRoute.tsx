import { useAuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!session) {
    console.log('redirecting');

    return <Navigate to={ROUTES.AUTH} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
