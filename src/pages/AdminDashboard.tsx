import { useEffect, useState } from "react";
import { GraduationCap, Users, UserRoundCheck, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../components/Card";
import Select from "../components/Select";
import Title from "../components/Title";
import type { IUsers } from "../interfaces/IUsers";
import { getTokenPayload } from "../utils/token";
import { mapUserRole, userRole } from "../utils/user";

function AdminDashboard() {
    const [users, setUsers] = useState<IUsers[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentYear] = useState(() => new Date().getFullYear());
    const [selectedYear, setSelectedYear] = useState(currentYear);
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

    const filteredUsers = users.filter((user) => {
        if (selectedStatus === "active") return user.ativo;
        if (selectedStatus === "inactive") return !user.ativo;
        return true;
    });

    const totalUsers = filteredUsers.length;
    const totalAdmins = filteredUsers.filter((user) => mapUserRole(user.role) === userRole.ADMIN).length;
    const totalTeachers = filteredUsers.filter((user) => mapUserRole(user.role) === userRole.PROFESSOR).length;
    const totalStudents = filteredUsers.filter((user) => mapUserRole(user.role) === userRole.ALUNO).length;

    const datedUsers = users.filter((user) => user.createdAt && !Number.isNaN(new Date(user.createdAt).getTime()));
    const usersWithoutDate = users.length - datedUsers.length;
    const years = [currentYear];

    for (const user of datedUsers) {
        const year = new Date(user.createdAt || "").getFullYear();
        if (!years.includes(year)) years.push(year);
    }
    years.sort((first, second) => second - first);

    const usersInYear = datedUsers.filter((user) => new Date(user.createdAt || "").getFullYear() === selectedYear);
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const chartData = months.map((month, index) => ({
        month,
        total: usersInYear.filter((user) => new Date(user.createdAt || "").getMonth() === index).length
    }));

    return (
        <>
            <Title>Dashboard</Title>
            <p className="text-normal text-border font-bold">Visão geral dos usuários cadastrados</p>
            {loading && <p role="status" className="mt-4 text-small">Carregando indicadores...</p>}
            {error && <p role="alert" className="mt-4 text-small text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <div className="mt-4 flex flex-col gap-2 sm:max-w-sm">
                        <label htmlFor="dashboard-status" className="text-normal font-bold">Situação dos usuários</label>
                        <Select id="dashboard-status" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                            <option value="all">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Total de usuários</h2>
                                <Users size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{totalUsers.toLocaleString("pt-BR")}</p>
                        </Card>
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Total de administradores</h2>
                                <ShieldCheck size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{totalAdmins.toLocaleString("pt-BR")}</p>
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
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-normal font-bold">Cadastros por mês</h2>
                            <div className="flex items-center gap-2">
                                <label htmlFor="dashboard-year" className="text-small font-bold">Ano</label>
                                <Select id="dashboard-year" value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
                                    {years.map((year) => <option key={year} value={year}>{year}</option>)}
                                </Select>
                            </div>
                        </div>
                        <p className="mt-2 text-small text-border">Considera usuários atualmente cadastrados com data de cadastro conhecida.</p>
                        {usersWithoutDate > 0 && (
                            <p className="mt-2 text-small text-border">{usersWithoutDate} usuários sem data de cadastro não entram no gráfico.</p>
                        )}
                        {usersInYear.length === 0 ? (
                            <p role="status" className="mt-4 text-small">Nenhum usuário com data de cadastro conhecida neste ano.</p>
                        ) : (
                            <>
                                <ul className="sr-only">
                                    {chartData.map((item) => <li key={item.month}>{item.month}: {item.total} cadastros.</li>)}
                                </ul>
                                <BarChart responsive accessibilityLayer data={chartData} style={{ width: "100%", height: 320 }} margin={{ top: 24, right: 16, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => Number(value).toLocaleString("pt-BR")} />
                                    <Bar dataKey="total" name="Cadastros" fill="#3C3295" radius={[4, 4, 0, 0]} maxBarSize={42} isAnimationActive={false}>
                                        <LabelList dataKey="total" position="top" fontSize={12} formatter={(value) => Number(value) > 0 ? Number(value).toLocaleString("pt-BR") : ""} />
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
