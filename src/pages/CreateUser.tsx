import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";

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
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
                <Card className="w-md">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="create-name">
                            <Input id="create-name" placeholder="João" value={name} onChange={(e) => setName(e.target.value)} />
                        </FormField>
                        <FormField label="E-mail:" htmlFor="create-email">
                            <Input id="create-email" type="email" placeholder="joao@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormField>
                        <FormField label="Cargo:" htmlFor="create-role">
                            <select id="create-role" className="border border-border rounded-md p-2 text-small" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </select>
                        </FormField>
                        <FormField label="Senha:" htmlFor="create-password">
                            <Input id="create-password" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormField>
                        <div className="flex gap-2 justify-center">
                            <Button type="submit">
                                Cadastrar
                            </Button>
                            <Button onClick={handleCancel} variant="secondary">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    )        
}

export default CreateUser;
