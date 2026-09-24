import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface ILogin {
    email: string;
    password: string;
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const login: ILogin = {
        email,
        password
    }

    async function handleLogin() {
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
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
                <div className="flex flex-col gap-2">
                    <label className="text-black text-small">E-mail:</label>
                    <input className="border border-border rounded-lg p-2" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-black text-small">Senha:</label>
                    <input className="border border-border rounded-lg p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-red-500 text-small">{error}</p>}
                <button type="submit" className="bg-primary p-3 rounded-lg text-white text-small font-bold">Entrar</button>
                <p className="text-border text-small">Esqueci minha senha. Entre em contato com administrador.</p>
            </form>
        </div>
    )
}

export default Login;