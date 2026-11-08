import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import QuizQuestionFields from "../components/QuizQuestionFields";
import Select from "../components/Select";
import Title from "../components/Title";
import type { IContent } from "../interfaces/IContent";
import type { IQuiz } from "../interfaces/IQuiz";
import { quizSchema, type QuizFormData, type QuizQuestionFormData } from "../schemas/quizSchema";
import { getTokenPayload } from "../utils/token";

function emptyQuestion() {
    return {
        statement: "",
        alternatives: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctAlternative: "",
    };
}

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

function CreateQuiz() {
    const form = useForm<QuizFormData>({
        resolver: zodResolver(quizSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            contentId: "",
            questions: [emptyQuestion()],
        },
    });
    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "questions" });
    const [contents, setContents] = useState<IContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [error, setError] = useState("");
    const [incompleteQuizId, setIncompleteQuizId] = useState<number | null>(null);
    const [discarding, setDiscarding] = useState(false);
    const navigate = useNavigate();
    const hasIncompleteQuiz = incompleteQuizId !== null;
    const busy = isSubmitting || discarding;
    const disabled = busy || hasIncompleteQuiz;
    const contentDisabled = disabled || loading || loadError !== "" || contents.length === 0;

    useEffect(() => {
        async function fetchContents() {
            try {
                const headers = getHeaders();
                const contentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/contents`, { headers });

                if (!contentsResponse.ok) {
                    throw new Error("Não foi possível carregar os conteúdos.");
                }

                const contentsData: IContent[] = await contentsResponse.json();
                const quizzesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes`, { headers });

                if (!quizzesResponse.ok) {
                    throw new Error("Não foi possível carregar os quizzes.");
                }

                const quizzesData: IQuiz[] = await quizzesResponse.json();
                const user = getTokenPayload();
                const availableContents: IContent[] = [];

                for (const content of contentsData) {
                    const belongsToUser = content.teacherId === user?.sub;
                    const hasQuiz = quizzesData.some((quiz) => quiz.contentId === content.id);

                    if (belongsToUser && !hasQuiz) {
                        availableContents.push(content);
                    }
                }

                setContents(availableContents);
            } catch {
                setLoadError("Não foi possível carregar os conteúdos disponíveis.");
            } finally {
                setLoading(false);
            }
        }
        fetchContents();
    }, []);

    function addQuestion() {
        append(emptyQuestion(), {
            focusName: `questions.${fields.length}.statement`,
        });
    }

    async function saveQuiz(contentId: number) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ contentId }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível criar o quiz. Tente novamente.");
        }

        const quiz: IQuiz = await response.json();
        return quiz;
    }

    async function saveQuestion(quizId: number, statement: string) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ quizId, statement }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível salvar a questão. Tente novamente.");
        }

        const question: { id: number } = await response.json();
        return question;
    }

    async function saveAlternatives(questionId: number, question: QuizQuestionFormData) {
        const correctIndex = Number(question.correctAlternative);
        const alternatives = question.alternatives.map((alternative, index) => ({
            questionId,
            text: alternative.text,
            correct: index === correctIndex,
        }));

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alternatives`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(alternatives),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível salvar as alternativas. Tente novamente.");
        }
    }

    async function handleCreate(data: QuizFormData) {
        if (hasIncompleteQuiz || discarding || loading || loadError) {
            return;
        }

        setError("");
        const contentId = Number(data.contentId);
        const selectedContent = contents.find((content) => content.id === contentId);

        if (!selectedContent) {
            setError("Selecione um dos seus conteúdos disponíveis.");
            return;
        }

        let createdQuizId: number | null = null;

        try {
            const quiz = await saveQuiz(contentId);
            createdQuizId = quiz.id;

            for (const question of data.questions) {
                const savedQuestion = await saveQuestion(quiz.id, question.statement);
                await saveAlternatives(savedQuestion.id, question);
            }

            navigate("/quiz");
        } catch (error) {
            await handleSaveError(error, createdQuizId);
        }
    }

    async function handleSaveError(error: unknown, quizId: number | null) {
        const message = error instanceof Error ? error.message : "Não foi possível salvar o quiz. Tente novamente.";

        if (quizId !== null) {
            try {
                await deleteQuiz(quizId);
            } catch {
                setIncompleteQuizId(quizId);
                setError("O cadastro ficou incompleto. Descarte este cadastro antes de tentar novamente. Suas respostas serão mantidas no formulário.");
                return;
            }
        }

        setError(message);
    }

    async function deleteQuiz(id: number) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error("Não foi possível descartar o cadastro incompleto. Tente novamente.");
        }
    }

    async function discardIncompleteQuiz() {
        if (incompleteQuizId === null || discarding) {
            return false;
        }

        setDiscarding(true);
        try {
            await deleteQuiz(incompleteQuizId);
            setIncompleteQuizId(null);
            setError("");
            return true;
        } catch {
            setError("Não foi possível descartar o cadastro incompleto. Tente novamente.");
            return false;
        } finally {
            setDiscarding(false);
        }
    }

    async function handleCancel() {
        if (hasIncompleteQuiz) {
            const discarded = await discardIncompleteQuiz();

            if (!discarded) {
                return;
            }
        }

        navigate("/quiz");
    }

    function handleInvalidSubmit() {
        setError("");
    }

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] min-w-0 flex-col">
            <Title>Criar quiz</Title>
            <p className="text-normal text-border font-bold">Selecione o conteúdo e cadastre as questões com suas alternativas</p>
            <Card className="flex flex-1 flex-col w-full min-w-0 mt-4">
                <form onSubmit={handleSubmit(handleCreate, handleInvalidSubmit)} noValidate className="flex flex-1 flex-col gap-6">
                    {loading && <p role="status" className="text-small">Carregando conteúdos...</p>}
                    {loadError && <p role="alert" className="text-small text-red-500">{loadError}</p>}
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    <FormField label="Conteúdo:" htmlFor="quiz-content" className="text-small">
                        <Select id="quiz-content" {...register("contentId")} disabled={contentDisabled} aria-invalid={!!errors.contentId}>
                            <option value="">Selecione um conteúdo</option>
                            {contents.map((content) => (
                                <option key={content.id} value={content.id}>{content.title}</option>
                            ))}
                        </Select>
                        {errors.contentId && <p role="alert" className="text-red-500">{errors.contentId.message}</p>}
                    </FormField>
                    <div className="flex flex-col gap-6 divide-y divide-background">
                        {fields.map((field, index) => (
                            <div key={field.id} className={index > 0 ? "pt-6" : ""}>
                                <QuizQuestionFields index={index} form={form} disabled={disabled} canAdd={fields.length < 10} canRemove={fields.length > 1} onAdd={addQuestion} onRemove={() => remove(index)} />
                            </div>
                        ))}
                    </div>
                    {fields.length === 10 && <p role="status" className="text-small text-border">Limite de 10 questões atingido.</p>}
                    {errors.questions?.root && <p role="alert" className="text-small text-red-500">{errors.questions.root.message}</p>}
                    <div className="flex flex-wrap gap-2 justify-end mt-auto pt-4">
                        <Button variant="secondary" disabled={busy} onClick={handleCancel}>
                            Cancelar
                        </Button>
                        {hasIncompleteQuiz ? (
                            <Button disabled={discarding} onClick={discardIncompleteQuiz}>
                                {discarding ? "Descartando..." : "Descartar cadastro"}
                            </Button>
                        ) : (
                            <Button type="submit" disabled={contentDisabled}>
                                {isSubmitting ? "Salvando..." : "Salvar quiz"}
                            </Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default CreateQuiz;