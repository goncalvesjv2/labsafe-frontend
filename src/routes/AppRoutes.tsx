import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import Main from "../components/Main";
import Users from "../pages/Users";
import CreateUser from "../pages/CreateUser";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route element={<ProtectedRoutes />}>
                <Route element={<Main />}>
                    <Route path="/home" element={<Home/>} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/create" element={<CreateUser />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;