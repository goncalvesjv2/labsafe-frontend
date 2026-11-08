import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Title from "../components/Title";
import { contentSchema, type ContentFormData } from "../schemas/contentSchema";

function CreateContent() {
    const { register, handleSubmit, clearErrors, formState: { errors, isSubmitting } } = useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function createContent(content: ContentFormData) {
        setError("");

        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(content)
            });

            if (response.ok) {
                navigate("/contents");
            } else {
                setError("Não foi possível criar o conteúdo. Tente novamente.");
            }
        } catch {
            setError("Não foi possível criar o conteúdo. Tente novamente.");
        }
    }

    function handleInvalidSubmit() {
        setError("");
    }

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] flex-col">
            <Title>Criar conteúdo</Title>
            <p className="text-normal text-border font-bold">Preencha o título e a descrição do conteúdo</p>
            <Card className="flex flex-1 flex-col w-full mt-4">
                <form onSubmit={handleSubmit(createContent, handleInvalidSubmit)} noValidate className="flex flex-1 flex-col gap-4">
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    <FormField className="text-small" label="Título:" htmlFor="content-title">
                        <Input id="content-title" placeholder="Segurança no laboratório" {...register("title", {
                            onChange: () => {
                                clearErrors("title");
                                setError("");
                            },
                        })} maxLength={150} required disabled={isSubmitting} />
                        {errors.title && <p role="alert" className="text-small text-red-500">{errors.title.message}</p>}
                    </FormField>
                    <FormField className="text-small flex-1" label="Descrição:" htmlFor="content-description">
                        <textarea id="content-description" placeholder="Escreva o conteúdo aqui" {...register("description", {
                            onChange: () => {
                                clearErrors("description");
                                setError("");
                            },
                        })} rows={8} className="flex-1 min-h-48 border border-border rounded-md p-2 bg-white text-small" required disabled={isSubmitting} />
                        {errors.description && <p role="alert" className="text-small text-red-500">{errors.description.message}</p>}
                    </FormField>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="secondary" onClick={() => navigate("/contents")} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar conteúdo"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default CreateContent;
