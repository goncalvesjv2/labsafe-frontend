import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Title from "../components/Title";

function CreateContent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const content = {
            title: title.trim(),
            description: description.trim()
        };

        if (!content.title || !content.description) {
            setError("Preencha o título e a descrição.");
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
                body: JSON.stringify(content)
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
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    <FormField className="text-small" label="Título:" htmlFor="content-title">
                        <Input id="content-title" placeholder="Segurança no laboratório" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required disabled={saving} />
                    </FormField>
                    <FormField className="text-small flex-1" label="Descrição:" htmlFor="content-description">
                        <textarea id="content-description" placeholder="Escreva o conteúdo aqui" value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="flex-1 min-h-48 border border-border rounded-md p-2 bg-white text-small" required disabled={saving} />
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