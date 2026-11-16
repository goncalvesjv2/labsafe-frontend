import { Navigate, Outlet } from "react-router-dom";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";
import { useState, useEffect } from "react";

function AdminRoutes() {
    const [checkAcess, setCheckAcess] = useState(true);
    const token = sessionStorage.getItem("token");
    
    useEffect(() => {
        let active = true;
        async function registerAcess() {
            try {
                const user = getTokenPayload(token);
                if (user && user.role !== userRole.ADMIN) {
                    await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            } catch {
                // A restrição por perfil permanece ativa se o registro de acesso falhar.
            } finally {
                if (active) setCheckAcess(false);
            }
        }
        registerAcess();
        return () => { active = false; };
    }, [token]);


    const user = getTokenPayload(token);

    if (!user) {
        return <Navigate to="/" replace state={{ sessionExpired: !!token }} />;
    }

    if (checkAcess) {
        return <p>Verificando acesso...</p>
    }

    if (user.role !== userRole.ADMIN) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />;
}

export default AdminRoutes;
