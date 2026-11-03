import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";
import Select from "../components/Select";
import Title from "../components/Title";
import { z } from "zod";
import { createUserSchema, type CreateUserFormData } from "../schemas/userSchema";

function CreateUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Admin");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({ name: "", email: "", role: "", password: "" });

    async function fetchUser(user: CreateUserFormData) {
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
        setMessage("");
        setError("");
        setErrors({ name: "", email: "", role: "", password: "" });

        const result = createUserSchema.safeParse({ name, email, role, password });

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            setErrors({
                name: fieldErrors.name?.[0] || "",
                email: fieldErrors.email?.[0] || "",
                role: fieldErrors.role?.[0] || "",
                password: fieldErrors.password?.[0] || "",
            });
            return;
        }

        fetchUser(result.data);
    }

    const navigate = useNavigate();
    function handleCancel(){
        navigate("/users");
    }
    
    return (
        <>
            <Title>Cadastrar usuário</Title>
            {message && <p className="text-small text-green-600 text-center mt-4">{message}</p>}
            {error && <p className="text-small text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-center mt-8">
                <Card className="w-md">
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="create-name">
                            <Input id="create-name" placeholder="João" value={name} onChange={(e) => {
                                setName(e.target.value);
                                setErrors({ ...errors, name: "" });
                                setError("");
                            }} />
                            {errors.name && <p role="alert" className="text-red-500 text-small">{errors.name}</p>}
                        </FormField>
                        <FormField label="E-mail:" htmlFor="create-email">
                            <Input id="create-email" type="email" placeholder="joao@email.com" value={email} onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: "" });
                                setError("");
                            }} />
                            {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email}</p>}
                        </FormField>
                        <FormField label="Cargo:" htmlFor="create-role">
                            <Select id="create-role" value={role} onChange={(e) => {
                                setRole(e.target.value);
                                setErrors({ ...errors, role: "" });
                                setError("");
                            }}>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </Select>
                            {errors.role && <p role="alert" className="text-red-500 text-small">{errors.role}</p>}
                        </FormField>
                        <FormField label="Senha:" htmlFor="create-password">
                            <Input id="create-password" type="password" placeholder="Senha" value={password} onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors({ ...errors, password: "" });
                                setError("");
                            }} />
                            {errors.password && <p role="alert" className="text-red-500 text-small">{errors.password}</p>}
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