import { Navigate, Outlet } from "react-router-dom";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";

function ContentRoutes() {
    const user = getTokenPayload();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== userRole.PROFESSOR && user.role !== userRole.ALUNO) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default ContentRoutes;