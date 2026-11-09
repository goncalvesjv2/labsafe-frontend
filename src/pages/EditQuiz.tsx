import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import QuizQuestionFields from "../components/QuizQuestionFields";
import Select from "../components/Select";
import Title from "../components/Title";
import type { IContent } from "../interfaces/IContent";
import type { IAlternative, IQuestion, IQuiz, IQuizQuestion } from "../interfaces/IQuiz";
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

function EditQuizForm({ id }: { id: number }) {
    const form = useForm<QuizFormData>({
        resolver: zodResolver(quizSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: { contentId: "", questions: [emptyQuestion()] },
    });
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "questions" });
    const [contents, setContents] = useState<IContent[]>([]);
    const [quiz, setQuiz] = useState<IQuiz | null>(null);
    const [savedQuestions, setSavedQuestions] = useState<IQuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [canEdit, setCanEdit] = useState(false);
    const [error, setError] = useState("");
    const [reloadCount, setReloadCount] = useState(0);
    const navigate = useNavigate();
    const disabled = loading || isSubmitting || !canEdit;

    useEffect(() => {
        async function fetchQuiz() {
            try {
                if (!Number.isInteger(id) || id <= 0) {
                    throw new Error("ID do quiz inválido.");
                }

                const headers = getHeaders();
                const quizResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}`, { headers });

                if (!quizResponse.ok) {
                    throw new Error("Não foi possível carregar o quiz.");
                }

                const quizData: IQuiz = await quizResponse.json();
                const user = getTokenPayload();

                if (quizData.teacherId !== user?.sub) {
                    throw new Error("Você pode editar apenas seus próprios quizzes.");
                }

                const contentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/contents`, { headers });
                const quizzesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes`, { headers });
                const questionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}/questions`, { headers });

                if (!contentsResponse.ok || !quizzesResponse.ok || !questionsResponse.ok) {
                    throw new Error("Não foi possível carregar os dados do quiz.");
                }

                const contentsData: IContent[] = await contentsResponse.json();
                const quizzesData: IQuiz[] = await quizzesResponse.json();
                const questionsData: IQuestion[] = await questionsResponse.json();
                const loadedQuestions: IQuizQuestion[] = [];
                const formQuestions: QuizQuestionFormData[] = [];

                for (const question of questionsData) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/${question.id}/alternatives`, { headers });

                    if (!response.ok) {
                        throw new Error("Não foi possível carregar as alternativas.");
                    }

                    const alternatives: IAlternative[] = await response.json();
                    const correctIndex = alternatives.findIndex((alternative) => alternative.correct);

                    loadedQuestions.push({ ...question, alternatives });
                    formQuestions.push({
                        questionId: question.id,
                        statement: question.statement,
                        alternatives: alternatives.length > 0
                            ? alternatives.map((alternative) => ({ alternativeId: alternative.id, text: alternative.text }))
                            : emptyQuestion().alternatives,
                        correctAlternative: correctIndex >= 0 ? String(correctIndex) : "",
                    });
                }

                const availableContents = contentsData.filter((content) => {
                    const belongsToUser = content.teacherId === user.sub;
                    const hasAnotherQuiz = quizzesData.some((item) => item.contentId === content.id && item.id !== id);
                    return belongsToUser && !hasAnotherQuiz;
                });

                reset({
                    contentId: String(quizData.contentId),
                    questions: formQuestions.length > 0 ? formQuestions : [emptyQuestion()],
                });
                setQuiz(quizData);
                setContents(availableContents);
                setSavedQuestions(loadedQuestions);
                setCanEdit(true);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Não foi possível carregar o quiz.");
            } finally {
                setLoading(false);
            }
        }

        fetchQuiz();
    }, [id, reset, reloadCount]);

    function addQuestion() {
        append(emptyQuestion(), { focusName: `questions.${fields.length}.statement` });
    }

    function reloadQuiz() {
        setLoading(true);
        setCanEdit(false);
        setError("");
        setReloadCount(reloadCount + 1);
    }

    async function saveContent(contentId: number) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${id}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ contentId }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível atualizar o conteúdo do quiz.");
        }
    }

    async function saveQuestion(question: QuizQuestionFormData) {
        const isNew = question.questionId === undefined;
        const url = isNew ? "/api/questions" : `/api/questions/${question.questionId}`;
        const body = isNew ? { quizId: id, statement: question.statement } : { statement: question.statement };
        const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
            method: isNew ? "POST" : "PATCH",
            headers: getHeaders(),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível salvar a questão.");
        }

        const savedQuestion: IQuestion = await response.json();
        return savedQuestion;
    }

    async function saveAlternativeText(id: number, text: string) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alternatives/${id}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível atualizar a alternativa.");
        }
    }

    async function addAlternatives(questionId: number, alternatives: { text: string; correct: boolean }[]) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alternatives`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(alternatives.map((alternative) => ({ ...alternative, questionId }))),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível adicionar as alternativas.");
        }

        const savedAlternatives: IAlternative[] = await response.json();
        return savedAlternatives;
    }

    async function changeCorrectAlternative(alternatives: IAlternative[], correctId: number) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alternatives/${correctId}/correct`, {
            method: "PATCH",
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível alterar a resposta correta.");
        }

        return alternatives.map((alternative) => ({ ...alternative, correct: alternative.id === correctId }));
    }

    async function deleteQuestion(questionId: number) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/${questionId}`, {
            method: "DELETE",
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível remover a questão. Ela pode possuir respostas de alunos.");
        }
    }

    async function deleteAlternative(alternativeId: number) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alternatives/${alternativeId}`, {
            method: "DELETE",
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || "Não foi possível remover a alternativa. Ela pode possuir respostas de alunos.");
        }
    }

    async function updateAlternatives(savedQuestion: IQuizQuestion, question: QuizQuestionFormData) {
        let currentAlternatives = savedQuestion.alternatives.map((alternative) => ({ ...alternative }));
        const selectedAlternative = question.alternatives[Number(question.correctAlternative)];
        let correctId = selectedAlternative.alternativeId;

        if (currentAlternatives.length === 0) {
            await addAlternatives(savedQuestion.id, question.alternatives.map((alternative, index) => ({
                text: alternative.text,
                correct: index === Number(question.correctAlternative),
            })));
            return;
        }

        const keptIds = question.alternatives.map((alternative) => alternative.alternativeId);
        const removedAlternatives = currentAlternatives.filter((alternative) => !keptIds.includes(alternative.id));
        let newAlternatives = question.alternatives.filter((alternative) => alternative.alternativeId === undefined);

        for (const alternative of question.alternatives) {
            if (alternative.alternativeId === undefined) continue;
            const savedAlternative = currentAlternatives.find((item) => item.id === alternative.alternativeId);

            if (!savedAlternative) {
                throw new Error("Alternativa não encontrada neste quiz. Recarregue os dados.");
            }

            if (savedAlternative.text !== alternative.text) {
                await saveAlternativeText(savedAlternative.id, alternative.text);
            }
        }

        let temporaryCorrect = currentAlternatives.find((alternative) => alternative.id === correctId);
        if (!temporaryCorrect) temporaryCorrect = currentAlternatives.find((alternative) => alternative.correct && keptIds.includes(alternative.id));
        if (!temporaryCorrect) temporaryCorrect = currentAlternatives.find((alternative) => keptIds.includes(alternative.id));
        if (!temporaryCorrect) temporaryCorrect = currentAlternatives[0];

        const correctCount = currentAlternatives.filter((alternative) => alternative.correct).length;
        if (!temporaryCorrect.correct || correctCount !== 1) {
            currentAlternatives = await changeCorrectAlternative(currentAlternatives, temporaryCorrect.id);
        }

        for (const alternative of removedAlternatives) {
            const current = currentAlternatives.find((item) => item.id === alternative.id);
            if (currentAlternatives.length > 2 && current && !current.correct) {
                await deleteAlternative(alternative.id);
                currentAlternatives = currentAlternatives.filter((item) => item.id !== alternative.id);
            }
        }

        if (correctId === undefined) {
            const created = await addAlternatives(savedQuestion.id, [{ text: selectedAlternative.text, correct: false }]);
            correctId = created[0].id;
            currentAlternatives.push(...created);
            newAlternatives = newAlternatives.filter((alternative) => alternative !== selectedAlternative);
        }

        const availableSlots = 4 - currentAlternatives.length;
        const firstNewAlternatives = newAlternatives.slice(0, availableSlots);
        if (firstNewAlternatives.length > 0) {
            const created = await addAlternatives(savedQuestion.id, firstNewAlternatives.map((alternative) => ({ text: alternative.text, correct: false })));
            currentAlternatives.push(...created);
            newAlternatives = newAlternatives.slice(firstNewAlternatives.length);
        }

        if (!currentAlternatives.some((alternative) => alternative.id === correctId && alternative.correct)) {
            currentAlternatives = await changeCorrectAlternative(currentAlternatives, correctId);
        }

        for (const alternative of removedAlternatives) {
            if (currentAlternatives.some((item) => item.id === alternative.id)) {
                await deleteAlternative(alternative.id);
                currentAlternatives = currentAlternatives.filter((item) => item.id !== alternative.id);
            }
        }

        if (newAlternatives.length > 0) {
            await addAlternatives(savedQuestion.id, newAlternatives.map((alternative) => ({ text: alternative.text, correct: false })));
        }
    }

    async function updateQuiz(data: QuizFormData) {
        if (loading || !canEdit || !quiz) return;
        setError("");
        const contentId = Number(data.contentId);

        if (!contents.some((content) => content.id === contentId)) {
            setError("Selecione um dos seus conteúdos disponíveis.");
            return;
        }

        try {
            if (contentId !== quiz.contentId) {
                await saveContent(contentId);
            }

            for (const question of savedQuestions) {
                const stillExists = data.questions.some((item) => item.questionId === question.id);
                if (!stillExists) await deleteQuestion(question.id);
            }

            for (const question of data.questions) {
                if (question.questionId === undefined) {
                    const created = await saveQuestion(question);
                    await updateAlternatives({ ...created, alternatives: [] }, question);
                } else {
                    const savedQuestion = savedQuestions.find((item) => item.id === question.questionId);
                    if (!savedQuestion) throw new Error("Questão não encontrada neste quiz. Recarregue os dados.");
                    if (savedQuestion.statement !== question.statement) await saveQuestion(question);
                    await updateAlternatives(savedQuestion, question);
                }
            }

            navigate("/quiz");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Não foi possível atualizar o quiz.";
            setError(`${message} Algumas alterações podem ter sido salvas. Recarregue os dados antes de tentar novamente.`);
            setCanEdit(false);
        }
    }

    function handleInvalidSubmit() {
        if (!disabled) setError("");
    }

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] min-w-0 flex-col">
            <Title>Editar quiz</Title>
            <p className="text-normal text-border font-bold">Atualize o conteúdo, as questões e as alternativas do quiz</p>
            <Card className="flex flex-1 flex-col w-full min-w-0 mt-4">
                <form onSubmit={handleSubmit(updateQuiz, handleInvalidSubmit)} noValidate className="flex flex-1 flex-col gap-6">
                    {loading && <p role="status" className="text-small">Carregando quiz...</p>}
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    {!loading && !canEdit && <div><Button variant="secondary" onClick={reloadQuiz}>Recarregar dados</Button></div>}
                    <FormField label="Conteúdo:" htmlFor="quiz-content" className="text-small">
                        <Select id="quiz-content" {...register("contentId")} disabled={disabled} aria-invalid={!!errors.contentId}>
                            <option value="">Selecione um conteúdo</option>
                            {contents.map((content) => <option key={content.id} value={content.id}>{content.title}</option>)}
                        </Select>
                        {errors.contentId && <p role="alert" className="text-small text-red-500">{errors.contentId.message}</p>}
                    </FormField>
                    <div className="flex flex-col gap-6 divide-y divide-background">
                        {fields.map((field, index) => (
                            <div key={field.id} className={index > 0 ? "pt-6" : ""}>
                                <QuizQuestionFields
                                    index={index}
                                    form={form}
                                    disabled={disabled}
                                    canAdd={fields.length < 10}
                                    canRemove={fields.length > 1}
                                    onAdd={addQuestion}
                                    onRemove={() => remove(index)}
                                />
                            </div>
                        ))}
                    </div>
                    {fields.length === 10 && <p role="status" className="text-small text-border">Limite de 10 questões atingido.</p>}
                    {errors.questions?.root && <p role="alert" className="text-small text-red-500">{errors.questions.root.message}</p>}
                    <div className="flex flex-wrap gap-2 justify-end mt-auto pt-4">
                        <Button variant="secondary" disabled={isSubmitting} onClick={() => navigate("/quiz")}>Cancelar</Button>
                        <Button type="submit" disabled={disabled || contents.length === 0}>{isSubmitting ? "Salvando..." : "Salvar alterações"}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

function EditQuiz() {
    const { id } = useParams();
    return <EditQuizForm key={id} id={Number(id)} />;
}

export default EditQuiz;