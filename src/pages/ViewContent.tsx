import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Title from "../components/Title";
import type { IContent } from "../interfaces/IContent";

function ViewContent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<IContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchContent() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contents/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    setNotFound(true);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Não foi possível carregar o conteúdo");
                }

                const data: IContent = await response.json();
                setContent(data);
            } catch {
                setError("Não foi possível carregar o conteúdo. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }

        fetchContent();
    }, [id]);

    if (notFound) {
        return (
            <div className="flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center gap-4 text-center">
                <p role="alert" className="text-normal">Conteúdo não encontrado.</p>
                <Button variant="secondary" onClick={() => navigate("/contents")}>
                    Voltar
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100dvh-2rem)] min-w-0 flex-col">
            <Card className="flex flex-1 flex-col gap-4 w-full min-w-0">
                {loading && <p role="status" className="text-small">Carregando conteúdo...</p>}
                {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                {!loading && !error && content && (
                    <>
                        <Title className="[overflow-wrap:anywhere]">{content.title}</Title>
                        <p className="text-normal whitespace-pre-wrap [overflow-wrap:anywhere]">{content.description}</p>
                    </>
                )}
                <div className="flex justify-end mt-auto pt-4">
                    <Button variant="secondary" onClick={() => navigate("/contents")}>
                        Voltar
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default ViewContent;
