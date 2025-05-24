import { Navigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { useAuthContext } from './AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = ROUTES.HOME,
}) => {
  const { session, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-800"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to protected area
  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
