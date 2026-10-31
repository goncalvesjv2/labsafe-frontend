import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import FormField from "../components/FormField";

interface ILogin {
    email: string;
    password: string;
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [accepted, setAccepted] = useState(false);

    const navigate = useNavigate();

    const login: ILogin = {
        email,
        password
    }

    async function handleLogin() {
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
        
        const token = await handleLogin();

        if (token) {
            localStorage.setItem("token", token.token);
            navigate('/home');
        }
    }

    return (
        <div className="h-screen bg-primary flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-white w-md rounded-lg h-min p-4 flex flex-col gap-4">
                <FormField label="E-mail:" htmlFor="login-email" className="text-black text-small">
                    <Input id="login-email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} />
                </FormField>
                <FormField label="Senha:" htmlFor="login-password" className="text-black text-small">
                    <Input id="login-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} />
                </FormField>
                {error && <p className="text-red-500 text-small">{error}</p>}
                <div className="flex gap-2 items-center">
                    <input className="h-4 w-4" type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}/>
                    <p className="text-normal">Li e aceito os <Link className="text-primary underline" to="/terms-of-use">Termos de Uso</Link> e <Link className="text-primary underline" to="/privacy-policies">Políticas de Privacidade</Link></p>
                </div>
                <Button type="submit" className="w-full" disabled={!accepted}>Entrar</Button>
                <p className="text-border text-small">Esqueci minha senha. Entre em contato com administrador.</p>
            </form>
        </div>
    )
}

export default Login;
