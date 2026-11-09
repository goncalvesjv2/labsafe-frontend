import Card from "../components/Card";
import Title from "../components/Title";
import Button from "../components/Button";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { IQuiz } from "../interfaces/IQuiz";
import type { IContent } from "../interfaces/IContent";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";
import { useNavigate } from "react-router-dom";

type QuizWithTitle = IQuiz & { title: string };

function Quiz() {
    const [quizzes, setQuizzes] = useState<QuizWithTitle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingQuizId, setDeletingQuizId] = useState<number | null>(null);
    const user = getTokenPayload();
    const isTeacher = user?.role === userRole.PROFESSOR;
    const navigate = useNavigate();

    async function handleDelete(quiz: QuizWithTitle) {
        if (deletingQuizId !== null) {
            return;
        }

        if (!isTeacher || quiz.teacherId !== user?.sub) {
            setError("Você pode excluir apenas seus próprios quizzes.");
            return;
        }

        if (!window.confirm(`Deseja excluir o quiz "${quiz.title}"? As questões, alternativas e tentativas dos alunos também serão excluídas.`)) {
            return;
        }

        setError("");

        try {
            setDeletingQuizId(quiz.id);
            const token = sessionStorage.getItem("token");

            if (!token) {
                setError("Sua sessão terminou. Faça login novamente.");
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
            } else {
                setError("Não foi possível excluir o quiz. Tente novamente.");
            }
        } catch {
            setError("Não foi possível excluir o quiz. Tente novamente.");
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

                setQuizzes(quizzesData.map((quiz) => ({
                    ...quiz,
                    title: contentsData.find((content) => content.id === quiz.contentId)?.title
                        ?? `Quiz do conteúdo #${quiz.contentId}`,
                })));
            } catch {
                setError("Não foi possível carregar os quizzes");
            } finally {
                setLoading(false);
            }
        }

        fetchQuizzes();
    }, []);

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
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 xl:grid-cols-3">
                {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="min-w-0">
                        <p className="text-normal font-bold break-words">{quiz.title}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Button disabled title="Acesso ao quiz em breve">Acessar</Button>
                            {isTeacher && quiz.teacherId === user?.sub && (
                                <>
                                    <Button variant="secondary" onClick={() => navigate(`/quiz/edit/${quiz.id}`)} disabled={deletingQuizId === quiz.id}>
                                        <Pencil size={16} />
                                        Editar
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleDelete(quiz)} disabled={deletingQuizId !== null}>
                                        <Trash size={16} />
                                        {deletingQuizId === quiz.id ? "Excluindo..." : "Excluir"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default Quiz;
