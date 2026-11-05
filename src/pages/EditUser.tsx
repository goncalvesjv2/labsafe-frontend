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
import { z } from "zod";
import { updateUserSchema, type UpdateUserFormData } from "../schemas/userSchema";

function EditUser() {
    const { register, getValues, reset, resetField } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
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
    const [errors, setErrors] = useState({ name: "", email: "", role: "", password: "" });

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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");
        setError("");
        setErrors({ name: "", email: "", role: "", password: "" });

        const result = updateUserSchema.safeParse(getValues());

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

        try {
            const user = {
                name: result.data.name,
                email: result.data.email,
                role: result.data.role,
                password: result.data.password || undefined,
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

    return (
        <>
            <Title>Editar usuário</Title>
            {message && <p className="text-small text-green-600 text-center mt-4">{message}</p>}
            
            {error && <p className="text-small text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-center mt-8">
                <Card className="w-md">
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="edit-name">
                            <Input id="edit-name" placeholder="João" {...register("name", {
                                onChange: () => {
                                    setErrors({ ...errors, name: "" });
                                    setError("");
                                },
                            })} />
                            {errors.name && <p role="alert" className="text-red-500 text-small">{errors.name}</p>}
                        </FormField>
                        <FormField label="E-mail:" htmlFor="edit-email">
                            <Input id="edit-email" type="email" placeholder="joao@email.com" {...register("email", {
                                onChange: () => {
                                    setErrors({ ...errors, email: "" });
                                    setError("");
                                },
                            })} />
                            {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email}</p>}
                        </FormField>
                        <FormField label="Cargo:" htmlFor="edit-role">
                            <Select id="edit-role" {...register("role", {
                                onChange: () => {
                                    setErrors({ ...errors, role: "" });
                                    setError("");
                                },
                            })}>
                                <option value="">Selecione um cargo</option>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </Select>
                            {errors.role && <p role="alert" className="text-red-500 text-small">{errors.role}</p>}
                        </FormField>
                        <FormField label="Senha:" htmlFor="edit-password">
                            <Input id="edit-password" type="password" placeholder="Deixe em branco para manter a senha atual" {...register("password", {
                                onChange: () => {
                                    setErrors({ ...errors, password: "" });
                                    setError("");
                                },
                            })} />
                            {errors.password && <p role="alert" className="text-red-500 text-small">{errors.password}</p>}
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
