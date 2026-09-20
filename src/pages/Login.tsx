function Login() {
    return (
        <div className="h-screen bg-primary flex flex-col justify-center items-center">
            <form className="bg-white w-md rounded-lg h-min p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-black text-small">E-mail:</label>
                    <input className="border border-border rounded-lg p-2" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-black text-small">Senha:</label>
                    <input className="border border-border rounded-lg p-2" type="password" />
                </div>
                <button className="bg-primary p-3 rounded-lg text-white text-small font-bold">Entrar</button>
                <p className="text-border text-small">Esqueci minha senha. Entre em contato com administrador.</p>
            </form>
        </div>
    )
}

export default Login;