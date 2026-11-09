import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, ChartColumn, ClipboardList, GraduationCap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import Button from "../components/Button";
import Card from "../components/Card";
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
    return totalScore / attempts.length;
}

function formatPercentage(value: number) {
    return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

function TeacherDashboard() {
    const [quizzes, setQuizzes] = useState<QuizWithResults[]>([]);
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

    const latestAttempts = quizzes.flatMap((quiz) => quiz.attempts);
    const totalStudents = new Set(latestAttempts.map((attempt) => attempt.studentId)).size;
    const averageScore = getAverageScore(latestAttempts);
    const approvedCount = latestAttempts.filter((attempt) => attempt.approved).length;
    const approvalRate = latestAttempts.length > 0 ? (approvedCount / latestAttempts.length) * 100 : 0;
    const chartData = quizzes.filter((quiz) => quiz.attempts.length > 0).map((quiz) => ({
        quizId: quiz.id,
        title: quiz.title,
        average: Number(getAverageScore(quiz.attempts).toFixed(1)),
    }));

    return (
        <>
            <Title>Dashboard</Title>
            <p className="text-normal text-border font-bold">Acompanhe a participação e o desempenho nos seus quizzes</p>
            {loading && <p role="status" className="mt-4 text-small">Carregando indicadores...</p>}
            {error && <p role="alert" className="mt-4 text-small text-red-500">{error}</p>}
            {!loading && !error && (
                <>
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
                            <p className="mt-3 text-3xl font-bold text-primary">{latestAttempts.length > 0 ? formatPercentage(averageScore) : "—"}</p>
                        </Card>
                        <Card className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-normal font-bold">Taxa de aprovação</h2>
                                <Award size={24} className="shrink-0 text-primary" />
                            </div>
                            <p className="mt-3 text-3xl font-bold text-primary">{latestAttempts.length > 0 ? formatPercentage(approvalRate) : "—"}</p>
                        </Card>
                    </div>
                    <p className="mt-3 text-small text-border">A média e a aprovação consideram apenas a última tentativa de cada aluno em cada quiz.</p>
                    <Card className="min-w-0 mt-4">
                        <h2 className="text-normal font-bold">Média das notas por quiz</h2>
                        {chartData.length === 0 ? (
                            <p role="status" className="mt-4 text-small">
                                {quizzes.length === 0 ? "Você ainda não criou quizzes." : "Nenhum aluno respondeu aos seus quizzes ainda."}
                            </p>
                        ) : (
                            <>
                                <p className="mt-2 text-small text-border">Selecione uma barra para consultar o desempenho. Apenas quizzes com respostas são exibidos.</p>
                                <ul className="sr-only">
                                    {chartData.map((quiz) => <li key={quiz.quizId}>{quiz.title}: {formatPercentage(quiz.average)}</li>)}
                                </ul>
                                <BarChart responsive accessibilityLayer data={chartData} layout="vertical" style={{ width: "100%", height: Math.max(280, chartData.length * 64) }} margin={{ top: 16, right: 48, bottom: 8, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={formatPercentage} tick={{ fontSize: 12 }} />
                                    <YAxis type="category" dataKey="title" width={130} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(title: string) => title.length > 18 ? `${title.slice(0, 18)}...` : title} />
                                    <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                                    <Bar dataKey="average" name="Média" fill="#3C3295" radius={[0, 4, 4, 0]} maxBarSize={42} isAnimationActive={false} className="cursor-pointer" onClick={(data) => navigate(`/quiz/${data.payload.quizId}/performance`)}>
                                        <LabelList dataKey="average" position="right" fontSize={12} formatter={(value) => formatPercentage(Number(value))} />
                                    </Bar>
                                </BarChart>
                            </>
                        )}
                        <div className="flex justify-end mt-4">
                            <Button variant="secondary" onClick={() => navigate("/quiz")}>Ver quizzes</Button>
                        </div>
                    </Card>
                </>
            )}
        </>
    );
}

export default TeacherDashboard;