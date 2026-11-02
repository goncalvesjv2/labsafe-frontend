import Card from "../components/Card";
import Title from "../components/Title";
import Button from "../components/Button";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { IContent } from "../interfaces/IContent";

function Content() {
    const [contents, setContents] = useState<IContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchContents() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contents`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Não foi possível carregar os conteúdos");
                }
                const data: IContent[] = await response.json();
                setContents(data);
            } catch {
                setError("Não foi possível carregar os conteúdos");
            } finally {
                setLoading(false);
            }
        }

        fetchContents();
    }, []);

    return (
        <>
            <Title>Conteúdo</Title>
            <p className="text-normal text-border font-bold">Crie um conteúdo contendo título e descrição</p>
            <div className="flex justify-end mt-4">
                <Button>
                    Criar conteúdo
                </Button>
            </div>
            {loading && <p role="status" className="mt-4 text-small">Carregando conteúdos...</p>}
            {error && <p role="alert" className="mt-4 text-red-500 text-small">{error}</p>}
            {!loading && !error && contents.length === 0 && (
                <p className="mt-4 text-small">Nenhum conteúdo cadastrado.</p>
            )}
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 xl:grid-cols-3">
                {contents.map((content) => (
                    <Card key={content.id} className="min-w-0">
                        <p className="text-normal font-bold break-words">{content.title}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Button>Acessar</Button>
                            <Button variant="secondary">
                                <Pencil size={16} />
                                Editar
                            </Button>
                            <Button variant="secondary">
                                <Trash size={16} />
                                Excluir
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default Content;
