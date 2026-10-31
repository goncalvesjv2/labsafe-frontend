import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";
import Select from "../components/Select";

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
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: 'PATCH',
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
                <Card className="w-md">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="edit-name">
                            <Input id="edit-name" placeholder="João" value={name} onChange={(e) => setName(e.target.value)} />
                        </FormField>
                        <FormField label="E-mail:" htmlFor="edit-email">
                            <Input id="edit-email" type="email" placeholder="joao@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormField>
                        <FormField label="Cargo:" htmlFor="edit-role">
                            <Select id="edit-role" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </Select>
                        </FormField>
                        <FormField label="Senha:" htmlFor="edit-password">
                            <Input id="edit-password" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormField>
                        <div className="flex gap-2 justify-center">
                            <Button type="submit">
                                Salvar alterações
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

export default EditUser;
