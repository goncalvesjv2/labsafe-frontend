import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Admin");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const user = {
        name, 
        email,
        role,
        password
    }

    async function fetchUser() {
        try {
            setMessage("");
            setError("");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message);
            }

            setMessage("Usuário cadastrado com sucesso")
            setName("");
            setEmail("");
            setRole("Admin");
            setPassword("");
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao cadastrar usuário");
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        fetchUser();
    }

    const navigate = useNavigate();
    function handleCancel(){
        navigate("/users");
    }
    
    return (
        <>
            <h1 className="text-title font-bold">Cadastrar usuário</h1>
            {message && <p className="text-small text-green-600 text-center mt-4">{message}</p>}
            
            {error && <p className="text-small text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-center mt-8">
                <form onSubmit={handleSubmit} className="bg-white w-md rounded-lg p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label>Nome:</label>
                        <input type="text" className="border border-border rounded-md p-2 text-small" placeholder="João" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>E-mail:</label>
                        <input type="email" className="border border-border rounded-md p-2 text-small" placeholder="joao@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                        <input type="password" className="border border-border rounded-md p-2 text-small" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex gap-2 justify-center">
                        <button type="submit" className="bg-primary text-white text-small font-bold p-2 rounded-md cursor-pointer">
                            Cadastrar
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

export default CreateUser;