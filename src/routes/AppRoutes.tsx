import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import Main from "../components/Main";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route element={<ProtectedRoutes />}>
                <Route element={<Main />}>
                    <Route path="/home" element={<Home/>} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;