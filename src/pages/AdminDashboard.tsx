import { useEffect, useState } from "react";
import { GraduationCap, Users, UserRoundCheck, ShieldCheck } from "lucide-react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Title from "../components/Title";
import type { IUsers } from "../interfaces/IUsers";
import { getTokenPayload } from "../utils/token";
import { mapUserRole, userRole } from "../utils/user";

function formatInputDate(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

function AdminDashboard() {
    const [users, setUsers] = useState<IUsers[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [startDate, setStartDate] = useState(() => `${new Date().getFullYear()}-01-01`);
    const [endDate, setEndDate] = useState(() => formatInputDate(new Date()));
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

    const usersByStatus = users.filter((user) => {
        if (selectedStatus === "active") return user.ativo;
        if (selectedStatus === "inactive") return !user.ativo;
        return true;
    });

    const datedUsers = usersByStatus.filter((user) => user.createdAt && !Number.isNaN(new Date(user.createdAt).getTime()));
    const periodError = !startDate || !endDate
        ? "Informe a data inicial e a data final."
        : startDate > endDate ? "A data inicial deve ser anterior ou igual à data final." : "";
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    end.setDate(end.getDate() + 1);

    const filteredUsers = datedUsers.filter((user) => {
        const date = new Date(user.createdAt || "").getTime();
        return date >= start.getTime() && date < end.getTime();
    });

    const totalUsers = filteredUsers.length;
    const totalAdmins = filteredUsers.filter((user) => mapUserRole(user.role) === userRole.ADMIN).length;
    const totalTeachers = filteredUsers.filter((user) => mapUserRole(user.role) === userRole.PROFESSOR).length;
    const totalStudents = filteredUsers.filter((user) => mapUserRole(user.role) === userRole.ALUNO).length;

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const chartData: { month: string; total: number }[] = [];
    let accumulated = 0;

    if (!periodError) {
        const month = new Date(start.getFullYear(), start.getMonth(), 1);
        while (month.getTime() < end.getTime()) {
            const registrations = filteredUsers.filter((user) => {
                const date = new Date(user.createdAt || "");
                return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
            }).length;

            accumulated += registrations;
            chartData.push({ month: `${months[month.getMonth()]}/${month.getFullYear()}`, total: accumulated });
            month.setMonth(month.getMonth() + 1);
        }
    }

    return (
        <>
            <Title>Dashboard</Title>
            <p className="text-normal text-border font-bold">Visão geral dos usuários</p>
            {loading && <p role="status" className="mt-4 text-small">Carregando indicadores...</p>}
            {error && <p role="alert" className="mt-4 text-small text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="dashboard-start-date" className="text-normal font-bold">Data inicial</label>
                            <Input id="dashboard-start-date" type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="dashboard-end-date" className="text-normal font-bold">Data final</label>
                            <Input id="dashboard-end-date" type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="dashboard-status" className="text-normal font-bold">Situação atual dos usuários</label>
                            <Select id="dashboard-status" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                                <option value="all">Todos</option>
                                <option value="active">Ativos</option>
                                <option value="inactive">Inativos</option>
                            </Select>
                        </div>
                    </div>
                    {periodError && <p role="alert" className="mt-4 text-small text-red-500">{periodError}</p>}
                    {!periodError && (
                        <>
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
                                <h2 className="text-normal font-bold">Crescimento de usuários no período</h2>
                                {totalUsers === 0 ? (
                                    <p role="status" className="mt-4 text-small">Nenhum cadastro encontrado neste período.</p>
                                ) : (
                                    <>
                                        <ul className="sr-only">
                                            {chartData.map((item) => <li key={item.month}>{item.month}: {item.total} cadastros acumulados.</li>)}
                                        </ul>
                                        <LineChart responsive accessibilityLayer data={chartData} style={{ width: "100%", height: 320 }} margin={{ top: 24, right: 24, bottom: 8, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <Tooltip formatter={(value) => Number(value).toLocaleString("pt-BR")} />
                                            <Line type="linear" dataKey="total" name="Cadastros acumulados" stroke="#3C3295" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
                                        </LineChart>
                                    </>
                                )}
                            </Card>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default AdminDashboard;
