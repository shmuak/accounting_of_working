import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: string; 
}


const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  console.log(user,token)
  if (!user || !token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user.role.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
