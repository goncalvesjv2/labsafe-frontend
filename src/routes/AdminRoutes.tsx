import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import type { IPayload } from "../interfaces/IPayload";
import { userRole } from "../utils/user";
import { useState, useEffect } from "react";

function AdminRoutes() {
    const [checkAcess, setCheckAcess] = useState(true);
    const token = localStorage.getItem("token");
    
    useEffect(() => {
        async function registerAcess() {
            if (!token) {
                return;
            }
            const user = jwtDecode<IPayload>(token);
            
            if (user.role !== userRole.ADMIN) {
                await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            }
            setCheckAcess(false);
        }
        registerAcess();
    }, [token]);


    if (!token) {
        return <Navigate to="/login" replace />
    }

    const user = jwtDecode<IPayload>(token);

    if (checkAcess) {
        return <p>Verificando acesso...</p>
    }

    if (user.role !== userRole.ADMIN) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />;
}

export default AdminRoutes;