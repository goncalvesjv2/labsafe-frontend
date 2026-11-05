import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";
import Select from "../components/Select";
import Title from "../components/Title";
import { updateUserSchema, type UpdateUserFormData } from "../schemas/userSchema";

function EditUser() {
    const { register, handleSubmit, reset, resetField, clearErrors, formState: { errors, isSubmitting } } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const navigate = useNavigate();
    const { id } = useParams();
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
            reset({
                name: data.name,
                email: data.email,
                role: data.role,
                password: "",
            });
        }
        fetchUser();
    }, [id, reset])

    function handleCancel() {
        navigate("/users");
    }

    async function updateUser(userData: UpdateUserFormData) {
        setMessage("");
        setError("");

        try {
            const user = {
                name: userData.name,
                email: userData.email,
                role: userData.role,
                password: userData.password || undefined,
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
            resetField("password");
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao atualizar usuário");
        }
    }

    function handleInvalidSubmit() {
        setMessage("");
        setError("");
    }

    return (
        <>
            <Title>Editar usuário</Title>
            {message && <p className="text-small text-green-600 text-center mt-4">{message}</p>}
            
            {error && <p className="text-small text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-center mt-8">
                <Card className="w-md">
                    <form onSubmit={handleSubmit(updateUser, handleInvalidSubmit)} noValidate className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="edit-name">
                            <Input id="edit-name" placeholder="João" {...register("name", {
                                onChange: () => {
                                    clearErrors("name");
                                    setError("");
                                },
                            })} />
                            {errors.name && <p role="alert" className="text-red-500 text-small">{errors.name.message}</p>}
                        </FormField>
                        <FormField label="E-mail:" htmlFor="edit-email">
                            <Input id="edit-email" type="email" placeholder="joao@email.com" {...register("email", {
                                onChange: () => {
                                    clearErrors("email");
                                    setError("");
                                },
                            })} />
                            {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email.message}</p>}
                        </FormField>
                        <FormField label="Cargo:" htmlFor="edit-role">
                            <Select id="edit-role" {...register("role", {
                                onChange: () => {
                                    clearErrors("role");
                                    setError("");
                                },
                            })}>
                                <option value="">Selecione um cargo</option>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </Select>
                            {errors.role && <p role="alert" className="text-red-500 text-small">{errors.role.message}</p>}
                        </FormField>
                        <FormField label="Senha:" htmlFor="edit-password">
                            <Input id="edit-password" type="password" placeholder="Deixe em branco para manter a senha atual" {...register("password", {
                                onChange: () => {
                                    clearErrors("password");
                                    setError("");
                                },
                            })} />
                            {errors.password && <p role="alert" className="text-red-500 text-small">{errors.password.message}</p>}
                        </FormField>
                        <div className="flex gap-2 justify-center">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : "Salvar alterações"}
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

export default EditUser;
