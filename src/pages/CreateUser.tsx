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
        },
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");

    function clearFeedback() {
        setMessage("");
        setError("");
        setWarning("");
    }

    async function fetchUser(user: CreateUserFormData) {
        try {
            clearFeedback();
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
            const data: { invitationSent?: boolean; message?: string } = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Ocorreu um erro ao cadastrar usuário");
            }

            if (data.invitationSent === true) {
                setMessage("Usuário cadastrado com sucesso. O convite para criar a senha foi enviado por e-mail.");
            } else {
                setWarning(data.message || "Usuário cadastrado, mas o envio do e-mail não foi confirmado. Será necessário reenviar o convite.");
            }
            reset();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ocorreu um erro ao cadastrar usuário");
        }
    }

    function handleInvalidSubmit() {
        clearFeedback();
    }

    const navigate = useNavigate();
    function handleCancel(){
        navigate("/users");
    }
    
    return (
        <>
            <Title>Cadastrar usuário</Title>
            <p className="text-normal text-border font-bold">O usuário receberá um convite por e-mail para criar a própria senha.</p>
            {message && <p role="status" className="text-small text-green-600 text-center mt-4">{message}</p>}
            {warning && <p role="status" className="text-small text-amber-700 text-center mt-4">{warning}</p>}
            {error && <p role="alert" className="text-small text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-center mt-8">
                <Card className="w-md">
                    <form onSubmit={handleSubmit(fetchUser, handleInvalidSubmit)} noValidate className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="create-name">
                            <Input id="create-name" placeholder="João" disabled={isSubmitting} {...register("name", {
                                onChange: () => {
                                    clearErrors("name");
                                    clearFeedback();
                                },
                            })} />
                            {errors.name && <p role="alert" className="text-red-500 text-small">{errors.name.message}</p>}
                        </FormField>
                        <FormField label="E-mail:" htmlFor="create-email">
                            <Input id="create-email" type="email" placeholder="joao@email.com" disabled={isSubmitting} {...register("email", {
                                onChange: () => {
                                    clearErrors("email");
                                    clearFeedback();
                                },
                            })} />
                            {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email.message}</p>}
                        </FormField>
                        <FormField label="Cargo:" htmlFor="create-role">
                            <Select id="create-role" disabled={isSubmitting} {...register("role", {
                                onChange: () => {
                                    clearErrors("role");
                                    clearFeedback();
                                },
                            })}>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </Select>
                            {errors.role && <p role="alert" className="text-red-500 text-small">{errors.role.message}</p>}
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
