import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Title from "../components/Title";
import { z } from "zod";
import { contentSchema, type ContentFormData } from "../schemas/contentSchema";

function CreateContent() {
    useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({ title: "", description: "" });
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (saving) {
            return;
        }
        setError("");
        setErrors({ title: "", description: "" });
        const result = contentSchema.safeParse({ title, description });

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            setErrors({
                title: fieldErrors.title?.[0] || "",
                description: fieldErrors.description?.[0] || "",
            });
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(result.data)
            });

            if (response.ok) {
                navigate("/contents");
            } else {
                setError("Não foi possível criar o conteúdo. Tente novamente.");
            }
        } catch {
            setError("Não foi possível criar o conteúdo. Tente novamente.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] flex-col">
            <Title>Criar conteúdo</Title>
            <p className="text-normal text-border font-bold">Preencha o título e a descrição do conteúdo</p>
            <Card className="flex flex-1 flex-col w-full mt-4">
                <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-4">
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    <FormField className="text-small" label="Título:" htmlFor="content-title">
                        <Input id="content-title" placeholder="Segurança no laboratório" value={title} onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors({ ...errors, title: "" });
                            setError("");
                        }} maxLength={150} required disabled={saving} />
                        {errors.title && <p role="alert" className="text-small text-red-500">{errors.title}</p>}
                    </FormField>
                    <FormField className="text-small flex-1" label="Descrição:" htmlFor="content-description">
                        <textarea id="content-description" placeholder="Escreva o conteúdo aqui" value={description} onChange={(e) => {
                            setDescription(e.target.value);
                            setErrors({ ...errors, description: "" });
                            setError("");
                        }} rows={8} className="flex-1 min-h-48 border border-border rounded-md p-2 bg-white text-small" required disabled={saving} />
                        {errors.description && <p role="alert" className="text-small text-red-500">{errors.description}</p>}
                    </FormField>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="secondary" onClick={() => navigate("/contents")} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Salvando..." : "Salvar conteúdo"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default CreateContent;
