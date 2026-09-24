import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route element={<ProtectedRoutes />}>
                <Route path="/home" element={<Home/>} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;