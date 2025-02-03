import { Navigate, useLocation } from "react-router-dom";
import { RootState, useAppSelector } from "../../redux/store/rootStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isPublic?: boolean;
}

export const ProtectedRoute = ({ children, isPublic = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, accessToken } = useAppSelector((state: RootState) => state.auth)
  const isUserAuthenticated = isAuthenticated && Boolean(accessToken);
  const hasVisitedHome = localStorage.getItem("hasVisitedHome");
  if (isPublic && isUserAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  if (isUserAuthenticated && !hasVisitedHome) {
    localStorage.setItem("hasVisitedHome", "true");
    return <Navigate to="/home" replace />;
  }
  return isUserAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth" state={{ from: location.pathname }} replace />
  );
};
