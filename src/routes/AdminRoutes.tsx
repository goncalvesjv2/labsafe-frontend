import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import type { IPayload } from "../interfaces/IPayload";
import { userRole } from "../utils/user";

function AdminRoutes() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />
    }

    const user = jwtDecode<IPayload>(token);

    if (user.role !== userRole.ADMIN) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />;
}

export default AdminRoutes;