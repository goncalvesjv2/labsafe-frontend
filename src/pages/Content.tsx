import Card from "../components/Card";
import Title from "../components/Title";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { IContent } from "../interfaces/IContent";
import { useNavigate } from "react-router-dom";
import { getTokenPayload } from "../utils/token";
import { userRole } from "../utils/user";

function Content() {
    const [contents, setContents] = useState<IContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteContent, setDeleteContent] = useState<number | null>(null);
    const [contentToDelete, setContentToDelete] = useState<IContent | null>(null);
    const [deleteError, setDeleteError] = useState("");
    const navigate = useNavigate();
    const user = getTokenPayload();

    function handleCreate() {
        navigate("/contents/create");
    }

    function handleEdit(id: number) {
        navigate(`/contents/edit/${id}`);
    }

    function handleAccess(id: number) {
        navigate(`/contents/${id}`);
    }

    async function handleDelete(content: IContent) {
        if (deleteContent !== null) {
            return;
        }

        if (user?.role !== userRole.PROFESSOR || content.teacherId !== user.sub) {
            setDeleteError("Você pode excluir apenas seus próprios conteúdos.");
            return;
        }

        setError("");
        setDeleteError("");

        try {
            setDeleteContent(content.id);
            const token = sessionStorage.getItem("token");
            if (!token) {
                setDeleteError("Sua sessão terminou. Faça login novamente.");
                return;
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contents/${content.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setContents((currentContents) => currentContents.filter((item) => item.id !== content.id));
                setContentToDelete(null);
            } else {
                setDeleteError("Não foi possível excluir o conteúdo. Tente novamente.");
            }
        } catch {
            setDeleteError("Não foi possível excluir o conteúdo. Tente novamente.");
        } finally {
            setDeleteContent(null);
        }
    }

    useEffect(() => {
        async function fetchContents() {
            try {
                const token = sessionStorage.getItem("token");
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
            {user?.role === userRole.PROFESSOR && (
                <p className="text-normal text-border font-bold">Crie um conteúdo contendo título e descrição</p>
            )}
            {user?.role === userRole.PROFESSOR && (
                <div className="flex justify-end mt-4">
                    <Button onClick={handleCreate}>
                        Criar conteúdo
                    </Button>
                </div>
            )}
            {loading && <p role="status" className="mt-4 text-small">Carregando conteúdos...</p>}
            {error && <p role="alert" className="mt-4 text-red-500 text-small">{error}</p>}
            {!loading && !error && contents.length === 0 && (
                <p className="mt-4 text-small">Nenhum conteúdo cadastrado.</p>
            )}
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 xl:grid-cols-3">
                {contents.map((content) => (
                    <Card key={content.id} className="flex min-w-0 flex-col gap-4">
                        <p className="text-normal font-bold break-words">{content.title}</p>
                        <div className="mt-auto flex flex-wrap gap-2">
                            <Button onClick={() => handleAccess(content.id)} disabled={deleteContent === content.id}>Acessar</Button>
                            {user?.role === userRole.PROFESSOR && content.teacherId === user.sub && (
                                <>
                                    <Button variant="secondary" onClick={() => handleEdit(content.id)} disabled={deleteContent === content.id}>
                                        <Pencil size={16} />
                                        Editar
                                    </Button>
                                    <Button variant="secondary" onClick={() => { setDeleteError(""); setContentToDelete(content); }} disabled={deleteContent !== null}>
                                        <Trash size={16} />
                                        {deleteContent === content.id ? "Excluindo..." : "Excluir"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
            <Modal open={contentToDelete !== null} description={`Deseja excluir o conteúdo "${contentToDelete?.title ?? ""}"? Essa ação não pode ser desfeita.`} busy={deleteContent !== null} error={deleteError} onCancel={() => setContentToDelete(null)} onConfirm={async () => { if (contentToDelete) await handleDelete(contentToDelete); }} />
        </>
    )
}

export default Content;
