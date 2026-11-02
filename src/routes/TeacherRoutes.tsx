import { Navigate, Outlet } from "react-router-dom";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";

function TeacherRoutes() {
    const user = getTokenPayload();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== userRole.PROFESSOR) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default TeacherRoutes;
