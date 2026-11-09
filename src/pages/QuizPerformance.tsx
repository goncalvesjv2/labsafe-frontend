import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Title from "../components/Title";
import type { IAttemptWithStudent } from "../interfaces/IAttempt";
import type { IContent } from "../interfaces/IContent";
import type { IQuiz } from "../interfaces/IQuiz";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";

function QuizPerformancePage({ id }: { id: number }) {
    const [title, setTitle] = useState("");
    const [attempts, setAttempts] = useState<IAttemptWithStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPerformance() {
            try {
                if (!Number.isInteger(id) || id <= 0) {
                    throw new Error("ID do quiz inválido.");
                }

                const token = sessionStorage.getItem("token");

                if (!token) {
                    throw new Error("Sua sessão terminou. Faça login novamente.");
                }

                const user = getTokenPayload(token);

                if (user?.role !== userRole.PROFESSOR) {
                    throw new Error("Somente professores podem consultar o desempenho dos alunos.");
                }

                const headers = { Authorization: `Bearer ${token}` };
                const quizResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}`, { headers });

                if (quizResponse.status === 404) {
                    throw new Error("Quiz não encontrado.");
                }

                if (!quizResponse.ok) {
                    throw new Error("Não foi possível carregar o quiz.");
                }

                const quiz: IQuiz = await quizResponse.json();

                if (quiz.teacherId !== user.sub) {
                    throw new Error("Você pode consultar apenas o desempenho dos seus próprios quizzes.");
                }

                const [contentResponse, attemptsResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/contents/${quiz.contentId}`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}/attempts`, { headers }),
                ]);

                if (!contentResponse.ok || !attemptsResponse.ok) {
                    throw new Error("Não foi possível carregar o desempenho dos alunos. Tente novamente.");
                }

                const content: IContent = await contentResponse.json();
                const attemptsData: IAttemptWithStudent[] = await attemptsResponse.json();
                setTitle(content.title);
                setAttempts(attemptsData.sort((first, second) => second.id - first.id));
            } catch (error) {
                setError(error instanceof Error ? error.message : "Não foi possível carregar o desempenho dos alunos.");
            } finally {
                setLoading(false);
            }
        }

        fetchPerformance();
    }, [id]);

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] min-w-0 flex-col">
            <Title>Desempenho dos alunos</Title>
            <p className="text-normal text-border font-bold">Consulte os resultados enviados neste quiz</p>
            <Card className="flex flex-1 flex-col gap-4 w-full min-w-0 mt-4">
                {loading && <p role="status" className="text-small">Carregando desempenho...</p>}
                {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                {!loading && !error && (
                    <>
                        <h2 className="text-normal font-bold [overflow-wrap:anywhere]">{title}</h2>
                        {attempts.length === 0 ? (
                            <p role="status" className="text-small">Nenhum aluno respondeu a este quiz ainda.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <caption className="text-small text-border text-left pb-3">
                                        Cada linha corresponde a uma tentativa. Os envios mais recentes aparecem primeiro.
                                    </caption>
                                    <thead>
                                        <tr className="border-b border-background">
                                            <th scope="col" className="text-normal p-2">Aluno</th>
                                            <th scope="col" className="text-normal p-2">Tentativa</th>
                                            <th scope="col" className="text-normal p-2">Nota</th>
                                            <th scope="col" className="text-normal p-2">Resultado</th>
                                            <th scope="col" className="text-normal p-2">Data e hora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((attempt) => (
                                            <tr key={attempt.id} className="border-b border-background">
                                                <td className="text-small p-2 [overflow-wrap:anywhere]">{attempt.studentName}</td>
                                                <td className="text-small p-2">#{attempt.id}</td>
                                                <td className="text-small p-2">{attempt.score.toLocaleString("pt-BR")}%</td>
                                                <td className={`text-small p-2 font-bold ${attempt.approved ? "text-green-700" : "text-red-500"}`}>
                                                    {attempt.approved ? "Aprovado" : "Não aprovado"}
                                                </td>
                                                <td className="text-small p-2 whitespace-nowrap">
                                                    <time dateTime={attempt.createdAt}>{new Date(attempt.createdAt).toLocaleString("pt-BR")}</time>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
                <div className="flex justify-end mt-auto pt-4">
                    <Button variant="secondary" onClick={() => navigate("/quiz")}>Voltar</Button>
                </div>
            </Card>
        </div>
    );
}

function QuizPerformance() {
    const { id } = useParams();
    return <QuizPerformancePage key={id} id={Number(id)} />;
}

export default QuizPerformance;