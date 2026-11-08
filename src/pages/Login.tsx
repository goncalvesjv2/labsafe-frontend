import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { getTokenPayload } from "../utils/token";
import { getDefaultRoute } from "../utils/navigation";

function Login() {
    const { register, handleSubmit, clearErrors, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
            accepted: false,
        },
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleLogin(login: LoginFormData) {
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: login.email,
                    password: login.password,
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message);
            }

            const user = getTokenPayload(data.token ?? null);

            if (!user) {
                throw new Error("Perfil de usuário inválido.");
            }

            sessionStorage.setItem("token", data.token);
            navigate(getDefaultRoute(user.role), { replace: true });
        } catch (error) {
            setError((error as Error).message);
        }
    }

    function handleInvalidSubmit() {
        setError(null);
    }

    return (
        <div className="h-screen bg-primary flex flex-col justify-center items-center">
            <Card className="w-md h-min">
                <form onSubmit={handleSubmit(handleLogin, handleInvalidSubmit)} noValidate className="flex flex-col gap-4">
                    <FormField label="E-mail:" htmlFor="login-email" className="text-black text-small">
                        <Input id="login-email" {...register("email", {
                            onChange: () => {
                                clearErrors("email");
                                setError(null);
                            },
                        })} />
                        {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email.message}</p>}
                    </FormField>
                    <FormField label="Senha:" htmlFor="login-password" className="text-black text-small">
                        <Input id="login-password" type="password" {...register("password", {
                            onChange: () => {
                                clearErrors("password");
                                setError(null);
                            },
                        })} />
                        {errors.password && <p role="alert" className="text-red-500 text-small">{errors.password.message}</p>}
                    </FormField>
                    {error && <p role="alert" className="text-red-500 text-small">{error}</p>}
                    <Link className="text-primary text-normal" to="/forgot-password">Esqueci minha senha</Link>
                    <div className="flex gap-2 items-center">
                        <input className="h-4 w-4" type="checkbox" {...register("accepted", {
                            onChange: () => {
                                clearErrors("accepted");
                                setError(null);
                            },
                        })}/>
                        <p className="text-normal">Li e aceito os <Link className="text-primary underline" to="/terms-of-use">Termos de Uso</Link> e <Link className="text-primary underline" to="/privacy-policies">Políticas de Privacidade</Link></p>
                    </div>
                    {errors.accepted && <p role="alert" className="text-red-500 text-small">{errors.accepted.message}</p>}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default Login;