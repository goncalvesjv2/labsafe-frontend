import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setRole(data.role);
        }
        fetchUser();
    }, [id])

    function handleCancel() {
        navigate("/users");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        try {
            setMessage("");
            setError("");
            
            const user = {
                name,
                email,
                role, 
                password
            }
    
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message);
            }
    
            setMessage("Usuário atualizado com sucesso")
            setPassword("");      
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao atualizar usuário");
        }
    }

    return (
        <>
            <h1 className="text-title font-bold">Editar usuário</h1>
            {message && <p className="text-small text-green-600 text-center mt-4">{message}</p>}
            
            {error && <p className="text-small text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-center mt-8">
                <form onSubmit={handleSubmit} className="bg-white w-md rounded-lg p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label>Nome:</label>
                        <input type="text" className="border border-border rounded-md p-2 text-small" placeholder="João" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>E-mail:</label>
                        <input type="email" className="border border-border rounded-md p-2 text-small" placeholder="joao@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Cargo:</label>
                        <select className="border border-border rounded-md p-2 text-small" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="Admin">Admin</option>
                            <option value="Professor(a)">Professor(a)</option>
                            <option value="Aluno(a)">Aluno(a)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Senha:</label>
                        <input type="password" className="border border-border rounded-md p-2 text-small" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <button type="submit" className="bg-primary text-white text-small font-bold p-2 rounded-md cursor-pointer">
                            Salvar alterações
                        </button>
                        <button onClick={handleCancel} type="button" className="text-small font-bold text-border border border-border rounded-md p-2 cursor-pointer">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditUser;