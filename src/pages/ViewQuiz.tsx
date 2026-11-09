import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Title from "../components/Title";
import type { IContent } from "../interfaces/IContent";
import type { IQuizResult } from "../interfaces/IAttempt";
import type { IQuestion, IQuiz } from "../interfaces/IQuiz";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";

type QuizQuestion = IQuestion & {
    alternatives: { id: number; text: string; correct?: boolean }[];
};

type AnswersFormData = {
    answers: { alternativeId: string }[];
};

function getHeaders() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        throw new Error("Sua sessão terminou. Faça login novamente.");
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

function QuizPage({ id }: { id: number }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AnswersFormData>({
        defaultValues: { answers: [] },
    });
    const [quiz, setQuiz] = useState<IQuiz | null>(null);
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [result, setResult] = useState<IQuizResult | null>(null);
    const isStudent = getTokenPayload()?.role === userRole.ALUNO;
    const navigate = useNavigate();
    const canAnswer = questions.length > 0 && questions.length <= 10
        && questions.every((question) => question.alternatives.length >= 2 && question.alternatives.length <= 4);

    useEffect(() => {
        async function fetchQuiz() {
            try {
                if (!Number.isInteger(id) || id <= 0) {
                    throw new Error("ID do quiz inválido.");
                }

                const headers = getHeaders();
                const quizResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}`, { headers });

                if (quizResponse.status === 404) {
                    throw new Error("Quiz não encontrado.");
                }

                if (!quizResponse.ok) {
                    throw new Error("Não foi possível carregar o quiz.");
                }

                const quizData: IQuiz = await quizResponse.json();
                const [contentResponse, questionsResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/contents/${quizData.contentId}`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}/questions`, { headers }),
                ]);

                if (!contentResponse.ok || !questionsResponse.ok) {
                    throw new Error("Não foi possível carregar os dados do quiz.");
                }

                const content: IContent = await contentResponse.json();
                const questionsData: IQuestion[] = await questionsResponse.json();
                const loadedQuestions: QuizQuestion[] = [];

                for (const question of questionsData) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/${question.id}/alternatives`, { headers });

                    if (!response.ok) {
                        throw new Error("Não foi possível carregar as alternativas.");
                    }

                    loadedQuestions.push({ ...question, alternatives: await response.json() });
                }

                reset({ answers: loadedQuestions.map(() => ({ alternativeId: "" })) });
                setTitle(content.title);
                setQuestions(loadedQuestions);
                setQuiz(quizData);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Não foi possível carregar o quiz.");
            } finally {
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [id, reset]);

    async function submitAnswers(data: AnswersFormData) {
        if (!isStudent || !quiz || !canAnswer || result) return;
        setError("");

        const answers = questions.map((question, index) => ({
            questionId: question.id,
            alternativeId: Number(data.answers[index]?.alternativeId),
        }));

        const allAnswered = questions.every((question, index) =>
            question.alternatives.some((alternative) => alternative.id === answers[index].alternativeId)
        );

        if (!allAnswered) {
            setError("Selecione uma alternativa para cada questão.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ quizId: quiz.id, answers }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => null);
                throw new Error(error?.message || "Não foi possível enviar as respostas. Tente novamente.");
            }

            const quizResult: IQuizResult = await response.json();
            setResult(quizResult);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Não foi possível enviar as respostas. Tente novamente.");
        }
    }

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] min-w-0 flex-col">
            <Card className="flex flex-1 flex-col gap-6 w-full min-w-0">
                {loading && <p role="status" className="text-small">Carregando quiz...</p>}
                {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                {!loading && quiz && (
                    <>
                        <Title className="[overflow-wrap:anywhere]">{title}</Title>
                        {result ? (
                            <div role="status" className="flex flex-col gap-3 rounded-md border border-border p-4">
                                <h2 className="text-normal font-bold">Seu resultado</h2>
                                <p className="text-normal">Acertos: {result.correctCount} de {result.totalQuestions}</p>
                                <p className="text-normal">Nota: {result.attempt.score.toLocaleString("pt-BR")}%</p>
                                <p className={`text-normal font-bold ${result.attempt.approved ? "text-green-700" : "text-red-500"}`}>
                                    {result.attempt.approved ? "Aprovado" : "Não aprovado"}
                                </p>
                                <p className="text-small text-border">Para ser aprovado, é necessário acertar pelo menos 60% das questões.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(submitAnswers)} noValidate className="flex flex-col gap-6">
                                <p className="text-normal text-border">
                                    {isStudent ? "Selecione uma alternativa em cada questão e envie suas respostas." : "Visualização do quiz. As respostas corretas estão indicadas abaixo."}
                                </p>
                                {!canAnswer && <p role="status" className="text-small">Este quiz ainda não está pronto para ser respondido.</p>}
                                {questions.map((question, index) => (
                                    <fieldset key={question.id} disabled={isSubmitting} className="min-w-0">
                                        <legend className="text-normal font-bold mb-2">Questão {index + 1}</legend>
                                        <p className="text-normal whitespace-pre-wrap [overflow-wrap:anywhere] mb-3">{question.statement}</p>
                                        <div className="flex flex-col gap-2">
                                            {question.alternatives.map((alternative) => (
                                                <label key={alternative.id} className="flex items-start gap-3 rounded-md border border-border p-3 text-normal">
                                                    {isStudent && (
                                                        <input
                                                            type="radio"
                                                            value={alternative.id}
                                                            {...register(`answers.${index}.alternativeId`, { required: "Selecione uma alternativa." })}
                                                            disabled={!canAnswer}
                                                            aria-invalid={!!errors.answers?.[index]?.alternativeId}
                                                            aria-describedby={errors.answers?.[index]?.alternativeId ? `question-${question.id}-error` : undefined}
                                                            className="mt-1 shrink-0 accent-primary"
                                                        />
                                                    )}
                                                    <span className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">{alternative.text}</span>
                                                    {!isStudent && alternative.correct && <span className="ml-auto shrink-0 text-small font-bold text-green-700">Correta</span>}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.answers?.[index]?.alternativeId && (
                                            <p id={`question-${question.id}-error`} role="alert" className="mt-2 text-small text-red-500">{errors.answers[index].alternativeId.message}</p>
                                        )}
                                    </fieldset>
                                ))}
                                {isStudent && <div className="flex justify-end"><Button type="submit" disabled={!canAnswer || isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar respostas"}</Button></div>}
                            </form>
                        )}
                    </>
                )}
                <div className="flex justify-end mt-auto pt-4">
                    <Button variant="secondary" disabled={isSubmitting} onClick={() => navigate("/quiz")}>Voltar</Button>
                </div>
            </Card>
        </div>
    );
}

function ViewQuiz() {
    const { id } = useParams();
    return <QuizPage key={id} id={Number(id)} />;
}

export default ViewQuiz;
