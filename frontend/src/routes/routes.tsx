import App from "../App";
import { lazy } from "react";
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import SuspenseWrapper from "./SuspendWrapper.tsx";
import Home from "../pages/protected-pages/Home.tsx";
import ProtectedAuth from "./auth-protect/ProtectedAuth.tsx";
import { ProtectedRoute } from "./routes-protect/ProtectedRoute.tsx";

const AuthPage = lazy(() => import("../pages/auth-pages/Auth.tsx"));

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [{ path: "", element: <Navigate to="/auth" replace /> }],
    },
    {
        path: "/auth",
        element: <App />,
        children: [
            {
                path: "",
                element: (
                    <ProtectedAuth>
                        <SuspenseWrapper>
                            <AuthPage />
                        </SuspenseWrapper>
                    </ProtectedAuth>
                ),
            },
        ],
    },
    {
        path: "/home",
        element: <App />,
        children: [
            {
                path: "",
                element: (
                    <ProtectedRoute>
                        <SuspenseWrapper>
                            <Home />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                ),
            },
        ],
    },
];

export const AuthRouter = createBrowserRouter(routes);
export default AuthRouter;
