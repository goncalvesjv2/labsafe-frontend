import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, ChartColumn, ClipboardList, GraduationCap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Title from "../components/Title";
import type { IAttempt } from "../interfaces/IAttempt";
import type { IContent } from "../interfaces/IContent";
import type { IQuiz } from "../interfaces/IQuiz";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";

type QuizWithResults = IQuiz & { title: string; attempts: IAttempt[] };

function getLatestAttempts(attempts: IAttempt[]) {
    const sortedAttempts = [...attempts].sort((first, second) => {
        const dateDifference = new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
        return dateDifference || second.id - first.id;
    });
    const latestAttempts: IAttempt[] = [];

    for (const attempt of sortedAttempts) {
        const alreadyAdded = latestAttempts.some((item) =>
            item.studentId === attempt.studentId && item.quizId === attempt.quizId
        );

        if (!alreadyAdded) {
            latestAttempts.push(attempt);
        }
    }

    return latestAttempts;
}

function getAverageScore(attempts: IAttempt[]) {
    if (attempts.length === 0) return 0;
    const totalScore = attempts.reduce((total, attempt) => total + attempt.score, 0);
    return totalScore / attempts.length / 10;
}

function formatScore(value: number) {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatPercentage(value: number) {
    return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

function formatInputDate(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

function TeacherDashboard() {
    const [quizzes, setQuizzes] = useState<QuizWithResults[]>([]);
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [startDate, setStartDate] = useState(() => `${new Date().getFullYear()}-01-01`);
    const [endDate, setEndDate] = useState(() => formatInputDate(new Date()));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const token = sessionStorage.getItem("token");

                if (!token) {
                    throw new Error("Sua sessão terminou. Faça login novamente.");
                }

                const user = getTokenPayload(token);

                if (user?.role !== userRole.PROFESSOR) {
                    throw new Error("Somente professores podem consultar estes indicadores.");
                }

                const headers = { Authorization: `Bearer ${token}` };
                const [quizzesResponse, contentsResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/quizzes`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/contents`, { headers }),
                ]);

                if (!quizzesResponse.ok || !contentsResponse.ok) {
                    throw new Error("Não foi possível carregar os dados do dashboard. Tente novamente.");
                }

                const quizzesData: IQuiz[] = await quizzesResponse.json();
                const contents: IContent[] = await contentsResponse.json();
                const ownQuizzes = quizzesData.filter((quiz) => quiz.teacherId === user.sub);
                const quizzesWithResults = await Promise.all(ownQuizzes.map(async (quiz) => {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${quiz.id}/attempts`, { headers });

                    if (!response.ok) {
                        throw new Error("Não foi possível carregar os resultados dos quizzes. Tente novamente.");
                    }

                    const attempts: IAttempt[] = await response.json();
                    return {
                        ...quiz,
                        title: contents.find((content) => content.id === quiz.contentId)?.title ?? `Quiz #${quiz.id}`,
                        attempts: getLatestAttempts(attempts),
                    };
                }));

                setQuizzes(quizzesWithResults);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Não foi possível carregar os indicadores.");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    const selectedQuiz = quizzes.find((quiz) => String(quiz.id) === selectedQuizId);
    const filteredQuizzes = selectedQuiz ? [selectedQuiz] : quizzes;
    const latestAttempts = filteredQuizzes.flatMap((quiz) => quiz.attempts);
    const totalStudents = new Set(latestAttempts.map((attempt) => attempt.studentId)).size;
    const averageScore = getAverageScore(latestAttempts);
    const approvedCount = latestAttempts.filter((attempt) => attempt.approved).length;
    const approvalRate = latestAttempts.length > 0 ? (approvedCount / latestAttempts.length) * 100 : 0;
    const chartData = filteredQuizzes.filter((quiz) => quiz.attempts.length > 0).map((quiz) => ({
        quizId: quiz.id,
        title: quiz.title,
        approved: quiz.attempts.filter((attempt) => attempt.approved).length,
        notApproved: quiz.attempts.filter((attempt) => !attempt.approved).length,
    }));
    const emptyChartMessage = quizzes.length === 0
        ? "Você ainda não criou quizzes."
        : selectedQuiz ? "Nenhum aluno respondeu a este quiz ainda." : "Nenhum aluno respondeu aos seus quizzes ainda.";

    const periodError = !startDate || !endDate
        ? "Informe a data inicial e a data final."
        : startDate > endDate ? "A data inicial deve ser anterior ou igual à data final." : "";
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    end.setDate(end.getDate() + 1);
    const quizzesInPeriod = quizzes.filter((quiz) => {
        if (!quiz.createdAt) return false;
        const date = new Date(quiz.createdAt).getTime();
        return date >= start.getTime() && date < end.getTime();
    });
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthlyQuizzes: { month: string; total: number }[] = [];

    if (!periodError) {
        const month = new Date(start.getFullYear(), start.getMonth(), 1);
        while (month.getTime() < end.getTime()) {
            const total = quizzesInPeriod.filter((quiz) => {
                const date = new Date(quiz.createdAt || "");
                return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
            }).length;

            monthlyQuizzes.push({ month: `${months[month.getMonth()]}/${month.getFullYear()}`, total });
            month.setMonth(month.getMonth() + 1);
        }
    }

    return (
        <>
            <Title>Dashboard</Title>
            <p className="text-normal text-border font-bold">Acompanhe a participação e o desempenho nos seus quizzes</p>
            {loading && <p role="status" className="mt-4 text-small">Carregando indicadores...</p>}
            {error && <p role="alert" className="mt-4 text-small text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <div className="mt-4 flex flex-col gap-2 sm:max-w-sm">
                        <label htmlFor="dashboard-quiz" className="text-normal font-bold">Filtrar por quiz</label>
                        <Select id="dashboard-quiz" value={selectedQuizId} onChange={(event) => setSelectedQuizId(event.target.value)} disabled={quizzes.length === 0}>
                            <option value="">Todos os quizzes</option>
                            {quizzes.map((quiz) => (
                                <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 xl:grid-cols-4">
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Quizzes criados</h2>
                                <ClipboardList size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{quizzes.length.toLocaleString("pt-BR")}</p>
                        </Card>
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Alunos participantes</h2>
                                <GraduationCap size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{totalStudents.toLocaleString("pt-BR")}</p>
                        </Card>
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Média das notas</h2>
                                <ChartColumn size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{latestAttempts.length > 0 ? formatScore(averageScore) : "—"}</p>
                        </Card>
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Taxa de aprovação</h2>
                                <Award size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{latestAttempts.length > 0 ? formatPercentage(approvalRate) : "—"}</p>
                        </Card>
                    </div>
                    <Card className="min-w-0 mt-4">
                        <h2 className="text-normal font-bold">Quizzes criados por mês</h2>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2 min-w-0">
                                <label htmlFor="quiz-start-date" className="text-normal font-bold">Data inicial</label>
                                <Input id="quiz-start-date" type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2 min-w-0">
                                <label htmlFor="quiz-end-date" className="text-normal font-bold">Data final</label>
                                <Input id="quiz-end-date" type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} />
                            </div>
                        </div>
                        {periodError ? (
                            <p role="alert" className="mt-4 text-small text-red-500">{periodError}</p>
                        ) : quizzesInPeriod.length === 0 ? (
                            <p role="status" className="mt-4 text-small">Nenhum quiz com data de criação registrada neste período.</p>
                        ) : (
                            <>
                                <ul className="sr-only">
                                    {monthlyQuizzes.map((item) => <li key={item.month}>{item.month}: {item.total} quizzes criados.</li>)}
                                </ul>
                                <LineChart responsive accessibilityLayer data={monthlyQuizzes} style={{ width: "100%", height: 320 }} margin={{ top: 24, right: 24, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => Number(value).toLocaleString("pt-BR")} />
                                    <Line type="linear" dataKey="total" name="Quizzes criados" stroke="#3C3295" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
                                </LineChart>
                            </>
                        )}
                    </Card>
                    <Card className="min-w-0 mt-4">
                        <h2 className="text-normal font-bold">Aprovados e não aprovados por quiz</h2>
                        {chartData.length === 0 ? (
                            <p role="status" className="mt-4 text-small">{emptyChartMessage}</p>
                        ) : (
                            <>
                                <p className="mt-2 text-small text-border">Clique em uma barra para ver o desempenho dos alunos naquele quiz.</p>
                                <ul className="sr-only">
                                    {chartData.map((quiz) => (
                                        <li key={quiz.quizId}>{quiz.title}: {quiz.approved} aprovados e {quiz.notApproved} não aprovados.</li>
                                    ))}
                                </ul>
                                <BarChart responsive accessibilityLayer barGap={0} data={chartData} style={{ width: "100%", height: 320 }} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis type="category" dataKey="title" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(title: string) => title.length > 18 ? `${title.slice(0, 18)}...` : title} />
                                    <YAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => Number(value).toLocaleString("pt-BR")} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="approved" name="Aprovados" fill="#3C3295" maxBarSize={42} isAnimationActive={false} className="cursor-pointer" onClick={(data) => navigate(`/quiz/${data.payload.quizId}/performance`)}>
                                        <LabelList dataKey="approved" position="inside" fill="white" fontSize={12} formatter={(value) => Number(value) > 0 ? Number(value).toLocaleString("pt-BR") : ""} />
                                    </Bar>
                                    <Bar dataKey="notApproved" name="Não aprovados" fill="#2563eb" maxBarSize={42} isAnimationActive={false} className="cursor-pointer" onClick={(data) => navigate(`/quiz/${data.payload.quizId}/performance`)}>
                                        <LabelList dataKey="notApproved" position="inside" fill="white" fontSize={12} formatter={(value) => Number(value) > 0 ? Number(value).toLocaleString("pt-BR") : ""} />
                                    </Bar>
                                </BarChart>
                            </>
                        )}
                        <div className="flex flex-wrap justify-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => navigate("/quiz")}>Ver quizzes</Button>
                        </div>
                    </Card>
                </>
            )}
        </>
    );
}

export default TeacherDashboard;
