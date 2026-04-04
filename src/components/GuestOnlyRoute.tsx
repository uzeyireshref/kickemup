import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type GuestOnlyRouteProps = {
  children: ReactNode;
};

const GuestOnlyRoute = ({ children }: GuestOnlyRouteProps) => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      >
        <Loader2 className="spinning" size={36} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default GuestOnlyRoute;
