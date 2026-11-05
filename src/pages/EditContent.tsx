import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Title from "../components/Title";
import type { IContent } from "../interfaces/IContent";
import { getTokenPayload } from "../utils/token";
import { contentSchema, type ContentFormData } from "../schemas/contentSchema";

function EditContent() {
    const { register, handleSubmit, reset, clearErrors, formState: { errors, isSubmitting } } = useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        async function fetchContent() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contents/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Não foi possível carregar o conteúdo");
                }

                const data: IContent = await response.json();
                const user = getTokenPayload();

                if (data.teacherId !== user?.sub) {
                    setError("Você pode editar apenas seus próprios conteúdos.");
                    return;
                }

                reset({
                    title: data.title,
                    description: data.description,
                });
                setCanEdit(true);
            } catch {
                setError("Não foi possível carregar o conteúdo.");
            } finally {
                setLoading(false);
            }
        }

        fetchContent();
    }, [id, reset]);

    async function updateContent(content: ContentFormData) {
        if (loading || !canEdit) {
            return;
        }

        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contents/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(content)
            });

            if (response.ok) {
                navigate("/contents");
            } else {
                setError("Não foi possível atualizar o conteúdo. Tente novamente.");
            }
        } catch {
            setError("Não foi possível atualizar o conteúdo. Tente novamente.");
        }
    }

    function handleInvalidSubmit() {
        if (loading || !canEdit) {
            return;
        }

        setError("");
    }

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] flex-col">
            <Title>Editar conteúdo</Title>
            <p className="text-normal text-border font-bold">Atualize o título e a descrição do conteúdo</p>
            <Card className="flex flex-1 flex-col w-full mt-4">
                <form onSubmit={handleSubmit(updateContent, handleInvalidSubmit)} noValidate className="flex flex-1 flex-col gap-4">
                    {loading && <p role="status" className="text-small">Carregando conteúdo...</p>}
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    <FormField className="text-small" label="Título:" htmlFor="content-title">
                        <Input id="content-title" placeholder="Segurança no laboratório" {...register("title", {
                            onChange: () => {
                                clearErrors("title");
                                setError("");
                            },
                        })} maxLength={150} required disabled={loading || isSubmitting || !canEdit} />
                        {errors.title && <p role="alert" className="text-small text-red-500">{errors.title.message}</p>}
                    </FormField>
                    <FormField className="text-small flex-1" label="Descrição:" htmlFor="content-description">
                        <textarea id="content-description" placeholder="Escreva o conteúdo aqui" {...register("description", {
                            onChange: () => {
                                clearErrors("description");
                                setError("");
                            },
                        })} rows={8} className="flex-1 min-h-48 border border-border rounded-md p-2 bg-white text-small" required disabled={loading || isSubmitting || !canEdit} />
                        {errors.description && <p role="alert" className="text-small text-red-500">{errors.description.message}</p>}
                    </FormField>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="secondary" onClick={() => navigate("/contents")} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || isSubmitting || !canEdit}>
                            {isSubmitting ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default EditContent;
