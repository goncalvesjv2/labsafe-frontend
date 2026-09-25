import { User } from "lucide-react";

function Users() {
    return (
        <>
            <h1 className="text-title font-bold">Usuários</h1>
            <p className="text-normal text-border font-bold">Gerenciamento de usuários</p>
            <div className="mt-4 flex justify-between">
                <input type="text" className="border rounded-md border-border p-2 bg-white text-small" placeholder="Buscar e-mail"/>
                <button className="p-2 bg-primary text-white text-small font-bold rounded-md flex gap-2 items-center">
                    <User size={20}/>
                    Novo usuário
                </button>
            </div>
            <table className="w-full h-screen bg-white rounded-lg mt-4">
                <thead className="text-center">
                    <tr>
                        <th className="text-normal">Nome</th>
                        <th className="text-normal">E-mail</th>
                        <th className="text-normal">Cargo</th>
                        <th className="text-normal">Status</th>
                        <th className="text-normal">Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </>
    )
}

export default Users;