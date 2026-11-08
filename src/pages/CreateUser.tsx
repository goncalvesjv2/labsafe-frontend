import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";
import Select from "../components/Select";
import Title from "../components/Title";
import { createUserSchema, type CreateUserFormData } from "../schemas/userSchema";

function CreateUser() {
    const { register, handleSubmit, reset, clearErrors, formState: { errors, isSubmitting } } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
            role: "Admin",
            password: "",
        },
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function fetchUser(user: CreateUserFormData) {
        try {
            setMessage("");
            setError("");
            const token = sessionStorage.getItem("token");
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
            reset();
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao cadastrar usuário");
        }
    }

    function handleInvalidSubmit() {
        setMessage("");
        setError("");
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
                    <form onSubmit={handleSubmit(fetchUser, handleInvalidSubmit)} noValidate className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="create-name">
                            <Input id="create-name" placeholder="João" {...register("name", {
                                onChange: () => {
                                    clearErrors("name");
                                    setError("");
                                },
                            })} />
                            {errors.name && <p role="alert" className="text-red-500 text-small">{errors.name.message}</p>}
                        </FormField>
                        <FormField label="E-mail:" htmlFor="create-email">
                            <Input id="create-email" type="email" placeholder="joao@email.com" {...register("email", {
                                onChange: () => {
                                    clearErrors("email");
                                    setError("");
                                },
                            })} />
                            {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email.message}</p>}
                        </FormField>
                        <FormField label="Cargo:" htmlFor="create-role">
                            <Select id="create-role" {...register("role", {
                                onChange: () => {
                                    clearErrors("role");
                                    setError("");
                                },
                            })}>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </Select>
                            {errors.role && <p role="alert" className="text-red-500 text-small">{errors.role.message}</p>}
                        </FormField>
                        <FormField label="Senha:" htmlFor="create-password">
                            <Input id="create-password" type="password" placeholder="Senha" {...register("password", {
                                onChange: () => {
                                    clearErrors("password");
                                    setError("");
                                },
                            })} />
                            {errors.password && <p role="alert" className="text-red-500 text-small">{errors.password.message}</p>}
                        </FormField>
                        <div className="flex gap-2 justify-center">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                            <Button onClick={handleCancel} variant="secondary" disabled={isSubmitting}>
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
