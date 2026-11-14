import { User } from "lucide-react";
import { useEffect, useState } from "react";
import type { IUsers } from "../interfaces/IUsers";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Title from "../components/Title";
import Status from "../components/Status";
import { getTokenPayload } from "../utils/token";

function Users() {
    const [users, setUsers] = useState<IUsers[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingIds, setUpdatingIds] = useState<number[]>([]);
    const [loggedUserId] = useState(() => {
        try {
            return getTokenPayload()?.sub ?? null;
        } catch {
            return null;
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = sessionStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.status === 401) {
                    sessionStorage.removeItem("token");
                    navigate("/", { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error("Não foi possível carregar os usuários");
                }

                const data: IUsers[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
                setError("Não foi possível carregar os usuários");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [navigate]);

    async function handleChangeStatus(user: IUsers) {
        if (updatingIds.includes(user.id)) {
            return;
        }

        if (loggedUserId === null) {
            sessionStorage.removeItem("token");
            navigate("/", { replace: true });
            return;
        }

        if (user.id === loggedUserId && user.ativo) {
            setError("Você não pode desativar sua própria conta");
            return;
        }

        const ativo = !user.ativo;

        setError("");
        setUpdatingIds((current) => [...current, user.id]);

        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ativo }),
            });

            if (response.status === 401) {
                sessionStorage.removeItem("token");
                navigate("/", { replace: true });
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "Não foi possível alterar o status do usuário");
            }

            const updatedUser: IUsers = await response.json();
            setUsers((current) => current.map((item) => item.id === user.id ? updatedUser : item));
        } catch (error) {
            setError(error instanceof Error ? error.message : "Não foi possível alterar o status do usuário");
        } finally {
            setUpdatingIds((current) => current.filter((id) => id !== user.id));
        }
    }
    
    function handleCreate() {
        navigate("/users/create");
    }

    function handleEdit(id: number) {
        navigate(`/users/edit/${id}`);
    }

    return (
        <>
            <Title>Usuários</Title>
            <p className="text-normal text-border font-bold">Gerenciamento de usuários</p>
            <div className="mt-4 flex justify-between">
                <Input placeholder="Buscar e-mail" />
                <Button onClick={handleCreate}>
                    <User size={20}/>
                    Novo usuário
                </Button>
            </div>
            {loading && <p className="mt-4 text-small">Carregando usuários...</p>}
            {error && <p role="alert" className="mt-4 text-red-500 text-small">{error}</p>}
            <table className="w-full bg-white rounded-lg mt-4">
                <thead className="text-center">
                    <tr>
                        <th className="text-normal p-2">Nome</th>
                        <th className="text-normal p-2">E-mail</th>
                        <th className="text-normal p-2">Cargo</th>
                        <th className="text-normal p-2">Status</th>
                        <th className="text-normal p-2">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {users.map((user) => {
                        const isUpdating = updatingIds.includes(user.id);
                        const cannotDeactivate = user.id === loggedUserId && user.ativo;

                        return (
                            <tr key={user.id}>
                                <td className="text-small p-2">{user.name}</td>
                                <td className="text-small p-2">{user.email}</td>
                                <td className="text-small p-2">{user.role}</td>
                                <td className="p-2 text-center align-middle"><Status ativo={user.ativo} /></td>
                                <td className="p-2 align-middle">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button onClick={() => handleEdit(user.id)} variant="secondary" disabled={isUpdating} className="min-w-16 whitespace-nowrap">Editar</Button>
                                        <Button onClick={() => handleChangeStatus(user)} variant="secondary" disabled={isUpdating || cannotDeactivate || loggedUserId === null} aria-busy={isUpdating} title={cannotDeactivate ? "Você não pode desativar sua própria conta" : undefined} className="min-w-28 whitespace-nowrap">
                                            {isUpdating
                                                ? (user.ativo ? "Desativando..." : "Reativando...")
                                                : (user.ativo ? "Desativar" : "Reativar")}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Users;
