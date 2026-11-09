import { lazy, Suspense } from "react";
import Title from "../components/Title";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";

const AdminDashboard = lazy(() => import("./AdminDashboard"));
const TeacherDashboard = lazy(() => import("./TeacherDashboard"));

function Dashboard() {
    const user = getTokenPayload();

    if (user?.role === userRole.ADMIN) {
        return (
            <Suspense fallback={<p role="status" className="text-small">Carregando dashboard...</p>}>
                <AdminDashboard />
            </Suspense>
        );
    }

    if (user?.role === userRole.PROFESSOR) {
        return (
            <Suspense fallback={<p role="status" className="text-small">Carregando dashboard...</p>}>
                <TeacherDashboard />
            </Suspense>
        );
    }

    return <Title>Dashboard</Title>;
}

export default Dashboard;
