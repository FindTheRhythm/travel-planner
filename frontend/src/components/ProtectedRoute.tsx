import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  const location = useLocation();

  if (!user) {
    // Сохраняем URL, с которого пользователь был перенаправлен
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div role="main" aria-label="Защищенный контент">
      {children}
    </div>
  );
};

export default ProtectedRoute; 