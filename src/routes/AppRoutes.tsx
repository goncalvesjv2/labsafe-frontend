import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import Main from "../components/Main";
import Users from "../pages/Users";
import CreateUser from "../pages/CreateUser";
import EditUser from "../pages/EditUser";
import AdminRoutes from "./AdminRoutes";
import Reagent from "../pages/Reagent";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ContentRoutes from "./ContentRoutes";
import Content from "../pages/Content";
import CreateContent from "../pages/CreateContent";
import TeacherRoutes from "./TeacherRoutes";
import EditContent from "../pages/EditContent";
import ViewContent from "../pages/ViewContent";
import StudentRoutes from "./StudentRoutes";
import Quiz from "../pages/Quiz";
import CreateQuiz from "../pages/CreateQuiz";
import EditQuiz from "../pages/EditQuiz";
import ViewQuiz from "../pages/ViewQuiz";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/forgot-password" element={<ForgotPassword />}/>
            <Route path="/reset-password" element={<ResetPassword />}/>
            <Route path="/privacy-policies" element={<Privacy />}/>
            <Route path="/terms-of-use" element={<Terms />}/>
            <Route element={<ProtectedRoutes />}>
                <Route element={<Main />}>
                    <Route path="/home" element={<Home/>} />
                    <Route element={<StudentRoutes />}>
                        <Route path="/reagents" element={<Reagent />}/>
                    </Route>
                    <Route element={<AdminRoutes />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/create" element={<CreateUser />} />
                        <Route path="/users/edit/:id" element={<EditUser />} />
                    </Route>
                    <Route element={<ContentRoutes />}>
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/quiz/:id" element={<ViewQuiz />} />
                        <Route path="/contents" element={<Content />} />
                        <Route path="/contents/:id" element={<ViewContent />} />
                        <Route element={<TeacherRoutes />}>
                            <Route path="/quiz/create" element={<CreateQuiz />} />
                            <Route path="/quiz/edit/:id" element={<EditQuiz />} />
                            <Route path="/contents/create" element={<CreateContent />} />
                            <Route path="/contents/edit/:id" element={<EditContent />} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;
