import { useEffect, useState } from "react";
import { GraduationCap, Users, UserRoundCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../components/Card";
import Title from "../components/Title";
import type { IUsers } from "../interfaces/IUsers";
import { getTokenPayload } from "../utils/token";
import { mapUserRole, userRole } from "../utils/user";

function AdminDashboard() {
    const [users, setUsers] = useState<IUsers[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = sessionStorage.getItem("token");

                if (!token) {
                    throw new Error("Sua sessão terminou. Faça login novamente.");
                }

                if (getTokenPayload(token)?.role !== userRole.ADMIN) {
                    throw new Error("Somente administradores podem consultar estes indicadores.");
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Não foi possível carregar os indicadores. Tente novamente.");
                }

                const data: IUsers[] = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Não foi possível carregar os indicadores.");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const totalUsers = users.length;
    const totalTeachers = users.filter((user) => mapUserRole(user.role) === userRole.PROFESSOR).length;
    const totalStudents = users.filter((user) => mapUserRole(user.role) === userRole.ALUNO).length;
    const totalAdmins = users.filter((user) => mapUserRole(user.role) === userRole.ADMIN).length;
    const chartData = [
        { role: "Administradores", total: totalAdmins },
        { role: "Professores", total: totalTeachers },
        { role: "Alunos", total: totalStudents },
    ];

    return (
        <>
            <Title>Dashboard</Title>
            <p className="text-normal text-border font-bold">Visão geral dos usuários cadastrados</p>
            {loading && <p role="status" className="mt-4 text-small">Carregando indicadores...</p>}
            {error && <p role="alert" className="mt-4 text-small text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Total de usuários</h2>
                                <Users size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{totalUsers.toLocaleString("pt-BR")}</p>
                        </Card>
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Total de professores</h2>
                                <UserRoundCheck size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{totalTeachers.toLocaleString("pt-BR")}</p>
                        </Card>
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Total de alunos</h2>
                                <GraduationCap size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{totalStudents.toLocaleString("pt-BR")}</p>
                        </Card>
                    </div>
                    <Card className="min-w-0 mt-4">
                        <h2 className="text-normal font-bold">Usuários por perfil</h2>
                        {totalUsers === 0 ? (
                            <p role="status" className="mt-4 text-small">Nenhum usuário cadastrado.</p>
                        ) : (
                            <>
                                <p className="sr-only">Administradores: {totalAdmins}. Professores: {totalTeachers}. Alunos: {totalStudents}.</p>
                                <BarChart responsive accessibilityLayer data={chartData} layout="vertical" style={{ width: "100%", height: 280 }} margin={{ top: 16, right: 48, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <YAxis type="category" dataKey="role" width={110} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="total" name="Usuários" fill="#3C3295" radius={[0, 4, 4, 0]} maxBarSize={42} isAnimationActive={false}>
                                        <LabelList dataKey="total" position="right" fontSize={12} />
                                    </Bar>
                                </BarChart>
                            </>
                        )}
                    </Card>
                </>
            )}
        </>
    );
}

export default AdminDashboard;