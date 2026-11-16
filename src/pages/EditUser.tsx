import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";
import Select from "../components/Select";
import Title from "../components/Title";
import { updateUserSchema, type UpdateUserFormData } from "../schemas/userSchema";
import type { IUsers } from "../interfaces/IUsers";
import { mapUserRole } from "../utils/user";

function EditUserForm({ id }: { id: number }) {
    const { register, control, handleSubmit, reset, clearErrors, formState: { errors, isSubmitting } } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [warning, setWarning] = useState("");
    const [loading, setLoading] = useState(true);
    const [savedEmail, setSavedEmail] = useState<string | null>(null);
    const email = useWatch({ control, name: "email" });
    const emailChanged = savedEmail !== null && email.trim().toLowerCase() !== savedEmail.trim().toLowerCase();
    const disabled = loading || isSubmitting || savedEmail === null;

    function clearFeedback() {
        setMessage("");
        setError("");
        setWarning("");
    }

    useEffect(() => {
        let active = true;
        async function fetchUser() {
            try {
                if (!Number.isSafeInteger(id) || id <= 0) {
                    throw new Error("ID do usuário inválido.");
                }
                const token = sessionStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => null);
                    throw new Error(data?.message || "Não foi possível carregar o usuário.");
                }

                const data: IUsers = await response.json();
                const role = mapUserRole(data.role);
                if (!role) throw new Error("Cargo do usuário inválido.");
                if (!active) return;

                reset({ name: data.name, email: data.email, role });
                setSavedEmail(data.email);
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : "Não foi possível carregar o usuário.");
            } finally {
                if (active) setLoading(false);
            }
        }
        fetchUser();
        return () => { active = false; };
    }, [id, reset]);

    function handleCancel() {
        navigate("/users");
    }

    async function updateUser(userData: UpdateUserFormData) {
        if (loading || savedEmail === null) return;
        clearFeedback();

        try {
            const user = {
                name: userData.name,
                email: userData.email,
                role: userData.role,
            }
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
            const data: (Partial<IUsers> & { message?: string; errors?: { message: string }[] }) | null = await response.json().catch(() => null);
    
            if(!response.ok) {
                throw new Error(data?.errors?.[0]?.message || data?.message || "Ocorreu um erro ao atualizar usuário");
            }
    
            const updatedEmail = data?.email ?? userData.email;
            const changedEmail = updatedEmail.trim().toLowerCase() !== savedEmail.trim().toLowerCase();
            reset({
                name: data?.name ?? userData.name,
                email: updatedEmail,
                role: mapUserRole(data?.role) ?? userData.role,
            });
            setSavedEmail(updatedEmail);
            setMessage("Usuário atualizado com sucesso.");
            if (changedEmail) {
                setWarning("E-mail alterado. Se o usuário ainda não criou a senha, será necessário reenviar o convite para o novo endereço.");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ocorreu um erro ao atualizar usuário");
        }
    }

    function handleInvalidSubmit() {
        clearFeedback();
    }

    return (
        <>
            <Title>Editar usuário</Title>
            <p className="text-normal text-border font-bold">Atualize o nome, o e-mail e o cargo do usuário.</p>
            {loading && <p role="status" className="text-small mt-4">Carregando usuário...</p>}
            {message && <p role="status" className="text-small text-green-600 text-center mt-4">{message}</p>}
            {warning && <p role="status" className="text-small text-amber-700 text-center mt-4">{warning}</p>}
            
            {error && <p role="alert" className="text-small text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-center mt-8">
                <Card className="w-md">
                    <form onSubmit={handleSubmit(updateUser, handleInvalidSubmit)} noValidate className="flex flex-col gap-4">
                        <FormField label="Nome:" htmlFor="edit-name">
                            <Input id="edit-name" placeholder="João" disabled={disabled} {...register("name", {
                                onChange: () => {
                                    clearErrors("name");
                                    clearFeedback();
                                },
                            })} />
                            {errors.name && <p role="alert" className="text-red-500 text-small">{errors.name.message}</p>}
                        </FormField>
                        <FormField label="E-mail:" htmlFor="edit-email">
                            <Input id="edit-email" type="email" placeholder="joao@email.com" disabled={disabled} {...register("email", {
                                onChange: () => {
                                    clearErrors("email");
                                    clearFeedback();
                                },
                            })} />
                            {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email.message}</p>}
                            {emailChanged && <p role="status" className="text-small text-amber-700">O e-mail foi alterado. Salve as alterações antes de reenviar o convite.</p>}
                        </FormField>
                        <FormField label="Cargo:" htmlFor="edit-role">
                            <Select id="edit-role" disabled={disabled} {...register("role", {
                                onChange: () => {
                                    clearErrors("role");
                                    clearFeedback();
                                },
                            })}>
                                <option value="">Selecione um cargo</option>
                                <option value="Admin">Admin</option>
                                <option value="Professor(a)">Professor(a)</option>
                                <option value="Aluno(a)">Aluno(a)</option>
                            </Select>
                            {errors.role && <p role="alert" className="text-red-500 text-small">{errors.role.message}</p>}
                        </FormField>
                        <div className="flex gap-2 justify-center">
                            <Button type="submit" disabled={disabled}>
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

function EditUser() {
    const { id } = useParams();
    return <EditUserForm key={id} id={Number(id)} />;
}

export default EditUser;
