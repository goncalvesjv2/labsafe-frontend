import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";
import Card from "../components/Card";
import { z } from "zod";
import { loginSchema } from "../schemas/loginSchema";

interface ILogin {
    email: string;
    password: string;
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [accepted, setAccepted] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "", accepted: "" });

    const navigate = useNavigate();

    async function handleLogin(login: ILogin) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return response.json();
        } catch (error) {
            setError((error as Error).message);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setErrors({ email: "", password: "", accepted: "" });
        const result = loginSchema.safeParse({ email, password, accepted });

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            setErrors({
                email: fieldErrors.email?.[0] || "",
                password: fieldErrors.password?.[0] || "",
                accepted: fieldErrors.accepted?.[0] || "",
            });
            return;
        }

        const token = await handleLogin({
            email: result.data.email,
            password: result.data.password,
        });

        if (token) {
            localStorage.setItem("token", token.token);
            navigate('/home');
        }
    }

    return (
        <div className="h-screen bg-primary flex flex-col justify-center items-center">
            <Card className="w-md h-min">
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <FormField label="E-mail:" htmlFor="login-email" className="text-black text-small">
                        <Input id="login-email" value={email} onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({ ...errors, email: "" });
                            setError(null);
                        }} />
                        {errors.email && <p role="alert" className="text-red-500 text-small">{errors.email}</p>}
                    </FormField>
                    <FormField label="Senha:" htmlFor="login-password" className="text-black text-small">
                        <Input id="login-password" type="password" value={password} onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors({ ...errors, password: "" });
                            setError(null);
                        }} />
                        {errors.password && <p role="alert" className="text-red-500 text-small">{errors.password}</p>}
                    </FormField>
                    {error && <p className="text-red-500 text-small">{error}</p>}
                    <Link className="text-primary text-normal" to="/forgot-password">Esqueci minha senha</Link>
                    <div className="flex gap-2 items-center">
                        <input className="h-4 w-4" type="checkbox" checked={accepted} onChange={(e) => {
                            setAccepted(e.target.checked);
                            setErrors({ ...errors, accepted: "" });
                        }}/>
                        <p className="text-normal">Li e aceito os <Link className="text-primary underline" to="/terms-of-use">Termos de Uso</Link> e <Link className="text-primary underline" to="/privacy-policies">Políticas de Privacidade</Link></p>
                    </div>
                    {errors.accepted && <p role="alert" className="text-red-500 text-small">{errors.accepted}</p>}
                    <Button type="submit" className="w-full">Entrar</Button>
                </form>
            </Card>
        </div>
    )
}

export default Login;
