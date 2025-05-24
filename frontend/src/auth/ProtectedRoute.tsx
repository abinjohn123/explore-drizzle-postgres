import { useAuthContext } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { REDIRECT_PATH_SESSION_KEY } from '@/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!session) {
    const intendedPath = location.pathname + location.search;
    sessionStorage.setItem(REDIRECT_PATH_SESSION_KEY, intendedPath);

    return <Navigate to={ROUTES.AUTH} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
