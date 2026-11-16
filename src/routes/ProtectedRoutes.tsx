import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getTokenPayload } from "../utils/token";

function ProtectedRoutes() {
    const location = useLocation();
    const token = sessionStorage.getItem("token");
    const validSession = getTokenPayload(token) !== null;

    useEffect(() => {
        if (token && !validSession) {
            sessionStorage.removeItem("token");
        }
    }, [token, validSession, location.key]);

    if (!validSession) {
        return <Navigate to="/" replace state={{ sessionExpired: !!token }} />;
    }

    return <Outlet />
}

export default ProtectedRoutes;
