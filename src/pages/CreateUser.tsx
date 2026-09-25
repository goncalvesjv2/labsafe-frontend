function CreateUser() {
    return (
        <>
            <h1 className="text-title font-bold">Cadastrar usuário</h1>
            <div className="flex justify-center mt-8">
                <form className="bg-white w-md rounded-lg p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label>Nome:</label>
                        <input type="text" className="border border-border rounded-md p-2 text-small" placeholder="João"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>E-mail:</label>
                        <input type="email" className="border border-border rounded-md p-2 text-small" placeholder="joao@email.com"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Cargo:</label>
                        <select className="border border-border rounded-md p-2 text-small">
                            <option value="Admin">Admin</option>
                            <option value="Professor(a)">Professor(a)</option>
                            <option value="Aluno(a)">Aluno(a)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Senha:</label>
                        <input type="password" className="border border-border rounded-md p-2 text-small" placeholder="Senha"/>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <button type="submit" className="bg-primary text-white text-small font-bold p-2 rounded-md">
                            Cadastrar
                        </button>
                        <button type="button" className="text-small font-bold text-border border border-border rounded-md p-2">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    )        
}

export default CreateUser;