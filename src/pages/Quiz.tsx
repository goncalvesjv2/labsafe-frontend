import Card from "../components/Card";
import Title from "../components/Title";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { BookOpen, ChartColumn, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { IQuiz } from "../interfaces/IQuiz";
import type { IContent } from "../interfaces/IContent";
import type { IQuizResult, IStudentQuizResult } from "../interfaces/IAttempt";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";
import { useNavigate } from "react-router-dom";

type QuizWithTitle = IQuiz & { title: string; result: IQuizResult | null; resultError?: boolean };

function Quiz() {
    const [quizzes, setQuizzes] = useState<QuizWithTitle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingQuizId, setDeletingQuizId] = useState<number | null>(null);
    const [quizToDelete, setQuizToDelete] = useState<QuizWithTitle | null>(null);
    const [deleteError, setDeleteError] = useState("");
    const user = getTokenPayload();
    const isTeacher = user?.role === userRole.PROFESSOR;
    const isStudent = user?.role === userRole.ALUNO;
    const navigate = useNavigate();

    async function handleDelete(quiz: QuizWithTitle) {
        if (deletingQuizId !== null) {
            return;
        }

        if (!isTeacher || quiz.teacherId !== user?.sub) {
            setDeleteError("Você pode excluir apenas seus próprios quizzes.");
            return;
        }

        setError("");
        setDeleteError("");

        try {
            setDeletingQuizId(quiz.id);
            const token = sessionStorage.getItem("token");

            if (!token) {
                setDeleteError("Sua sessão terminou. Faça login novamente.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${quiz.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setQuizzes((currentQuizzes) => currentQuizzes.filter((item) => item.id !== quiz.id));
                setQuizToDelete(null);
            } else {
                setDeleteError("Não foi possível excluir o quiz. Tente novamente.");
            }
        } catch {
            setDeleteError("Não foi possível excluir o quiz. Tente novamente.");
        } finally {
            setDeletingQuizId(null);
        }
    }

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const token = sessionStorage.getItem("token");
                const options = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const [quizzesResponse, contentsResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/quizzes`, options),
                    fetch(`${import.meta.env.VITE_API_URL}/api/contents`, options),
                ]);

                if (!quizzesResponse.ok || !contentsResponse.ok) {
                    throw new Error("Não foi possível carregar os quizzes");
                }

                const [quizzesData, contentsData]: [IQuiz[], IContent[]] = await Promise.all([
                    quizzesResponse.json(),
                    contentsResponse.json(),
                ]);

                const quizzesWithResults = await Promise.all(quizzesData.map(async (quiz): Promise<QuizWithTitle> => {
                    const quizWithTitle: QuizWithTitle = {
                        ...quiz,
                        title: contentsData.find((content) => content.id === quiz.contentId)?.title
                            ?? `Quiz do conteúdo #${quiz.contentId}`,
                        result: null,
                    };

                    if (!isStudent) return quizWithTitle;

                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${quiz.id}/result`, options);

                        if (!response.ok) {
                            throw new Error("Não foi possível carregar a nota.");
                        }

                        const data: IStudentQuizResult = await response.json();
                        return { ...quizWithTitle, result: data.result };
                    } catch {
                        return { ...quizWithTitle, resultError: true };
                    }
                }));

                setQuizzes(quizzesWithResults);
            } catch {
                setError("Não foi possível carregar os quizzes");
            } finally {
                setLoading(false);
            }
        }

        fetchQuizzes();
    }, [isStudent]);

    return (
        <>
            <Title>Quizzes</Title>
            <p className="text-normal text-border font-bold">Quizzes vinculados aos conteúdos da plataforma</p>
            {isTeacher && (
                <div className="flex justify-end mt-4">
                    <Button onClick={() => navigate("/quiz/create")}>
                        Criar quiz
                    </Button>
                </div>
            )}
            {loading && <p role="status" className="mt-4 text-small">Carregando quizzes...</p>}
            {error && <p role="alert" className="mt-4 text-red-500 text-small">{error}</p>}
            {!loading && !error && quizzes.length === 0 && (
                <p className="mt-4 text-small">Nenhum quiz cadastrado.</p>
            )}
            <div className={`gap-4 mt-4 ${isTeacher ? "flex flex-wrap items-stretch" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {quizzes.map((quiz) => (
                    <Card key={quiz.id} className={`@container flex min-w-0 flex-col gap-4 ${isTeacher ? "w-full max-w-sm" : ""}`}>
                        <p className="text-normal font-bold break-words">{quiz.title}</p>
                        {isStudent && quiz.result?.attempt.approved && (
                            <div className="flex flex-col gap-1">
                                <p className="text-small font-bold text-green-700">Aprovado</p>
                                <p className="text-normal">
                                    Nota: {quiz.result.correctCount !== null && quiz.result.totalQuestions !== null
                                        ? `${quiz.result.correctCount}/${quiz.result.totalQuestions}`
                                        : `${quiz.result.attempt.score.toLocaleString("pt-BR")}%`}
                                </p>
                            </div>
                        )}
                        {isStudent && quiz.resultError && (
                            <p role="status" className="text-small text-border">Não foi possível carregar a nota.</p>
                        )}
                        <div className="mt-auto flex flex-nowrap gap-1 whitespace-nowrap">
                            <Button className="shrink-0 px-1.5" title="Acessar quiz" aria-label="Acessar quiz" onClick={() => navigate(`/quiz/${quiz.id}`)} disabled={deletingQuizId === quiz.id}>
                                <BookOpen size={16} className="@3xs:hidden" />
                                <span className="hidden @3xs:inline">Acessar</span>
                            </Button>
                            {isTeacher && quiz.teacherId === user?.sub && (
                                <>
                                    <Button className="shrink-0 px-1.5 gap-1!" title="Desempenho" aria-label="Desempenho" variant="secondary" onClick={() => navigate(`/quiz/${quiz.id}/performance`)} disabled={deletingQuizId === quiz.id}>
                                        <ChartColumn size={16} />
                                        <span className="hidden @3xs:inline">Desempenho</span>
                                    </Button>
                                    <Button className="shrink-0 px-1.5 gap-1!" title="Editar quiz" aria-label="Editar quiz" variant="secondary" onClick={() => navigate(`/quiz/edit/${quiz.id}`)} disabled={deletingQuizId === quiz.id}>
                                        <Pencil size={16} />
                                        <span className="hidden @[22rem]:inline">Editar</span>
                                    </Button>
                                    <Button className="shrink-0 px-1.5 gap-1!" title={deletingQuizId === quiz.id ? "Excluindo..." : "Excluir quiz"} aria-label={deletingQuizId === quiz.id ? "Excluindo..." : "Excluir quiz"} variant="secondary" onClick={() => { setDeleteError(""); setQuizToDelete(quiz); }} disabled={deletingQuizId !== null}>
                                        <Trash size={16} />
                                        <span className="hidden @[22rem]:inline">{deletingQuizId === quiz.id ? "Excluindo..." : "Excluir"}</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
            <Modal open={quizToDelete !== null} description={`Deseja excluir o quiz "${quizToDelete?.title ?? ""}"? As questões, alternativas e tentativas dos alunos também serão excluídas. Essa ação não pode ser desfeita.`} busy={deletingQuizId !== null} error={deleteError} onCancel={() => setQuizToDelete(null)} onConfirm={async () => { if (quizToDelete) await handleDelete(quizToDelete); }} />
        </>
    );
}

export default Quiz;
