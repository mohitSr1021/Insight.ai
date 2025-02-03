import { Navigate } from "react-router-dom";
import { RootState, useAppSelector } from "../../redux/store/rootStore";

const ProtectedAuth = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, accessToken } = useAppSelector((state: RootState) => state.auth)
    const isUserAuthenticated = isAuthenticated && Boolean(accessToken);

    return isUserAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>;
};

export default ProtectedAuth;
