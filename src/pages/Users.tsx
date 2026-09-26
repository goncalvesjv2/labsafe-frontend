import { User } from "lucide-react";
import { useEffect, useState } from "react";
import type { IUsers } from "../interfaces/IUsers";
import { useNavigate } from "react-router-dom";

function Users() {
    const [users, setUsers] = useState<IUsers[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchUsers() {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Não foi possível carregar os usuários");
            }

            const data: IUsers[] = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
            setError("Não foi possível carregar os usuários");
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchUsers();
    }, [])

    const navigate = useNavigate();
    
    function handleCreate() {
        navigate("/users/create");
    }

    function handleEdit(id: number) {
        navigate(`/users/edit/${id}`);
    }

    return (
        <>
            <h1 className="text-title font-bold">Usuários</h1>
            <p className="text-normal text-border font-bold">Gerenciamento de usuários</p>
            <div className="mt-4 flex justify-between">
                <input type="text" className="border rounded-md border-border p-2 bg-white text-small" placeholder="Buscar e-mail"/>
                <button onClick={handleCreate} className="p-2 bg-primary text-white text-small font-bold rounded-md flex gap-2 items-center cursor-pointer">
                    <User size={20}/>
                    Novo usuário
                </button>
            </div>
            {loading && <p className="mt-4 text-small">Carregando usuários...</p>}

            {error && <p className="mt-4 text-red-500 text-small">{error}</p>}
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
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="text-small p-2">{user.name}</td>
                            <td className="text-small p-2">{user.email}</td>
                            <td className="text-small p-2">{user.role}</td>
                            <td className="text-small p-2">{user.ativo ? "Ativo" : "Inativo"}</td>
                            <td className="flex gap-2 p-2 text-center justify-center">
                                <button onClick={() => handleEdit(user.id)} className="text-small p-2 border rounded-md text-border cursor-pointer">Editar</button>
                                <button className="text-small p-2 border rounded-md text-border cursor-pointer">Desativar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Users;