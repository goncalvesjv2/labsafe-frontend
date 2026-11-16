import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import Card from "../components/Card";
import Title from "../components/Title";
import type { IUsers } from "../interfaces/IUsers";
import { mapUserRole } from "../utils/user";

function Profile({ userId }: { userId?: number }) {
    const [profile, setProfile] = useState<IUsers | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        async function fetchProfile() {
            try {
                if (userId !== undefined && (!Number.isSafeInteger(userId) || userId <= 0)) {
                    throw new Error("ID do usuário inválido.");
                }

                const token = sessionStorage.getItem("token");

                if (!token) {
                    throw new Error("Sua sessão terminou. Faça login novamente.");
                }

                const endpoint = userId === undefined ? "/auth/me" : `/api/users/${userId}`;
                const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 401) {
                    throw new Error("Sua sessão terminou. Faça login novamente.");
                }

                if (response.status === 403) {
                    throw new Error("Você não tem permissão para consultar este perfil.");
                }

                if (response.status === 404) {
                    throw new Error("Usuário não encontrado.");
                }

                if (!response.ok) {
                    throw new Error("Não foi possível carregar o perfil. Tente novamente.");
                }

                const data: IUsers = await response.json();
                if (active) setProfile(data);
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : "Não foi possível carregar o perfil.");
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchProfile();
        return () => { active = false; };
    }, [userId]);

    const role = profile ? mapUserRole(profile.role) ?? profile.role : "";

    return (
        <>
            <Title>{userId === undefined ? "Meu perfil" : "Perfil do usuário"}</Title>
            <div className="flex justify-center mt-8">
                <Card className="w-full max-w-xl min-w-0" role="region" aria-label="Informações do usuário">
                    {loading && <p role="status" className="text-small">Carregando perfil...</p>}
                    {error && <p role="alert" className="text-small text-red-500">{error}</p>}
                    {!loading && !error && profile && (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-background" aria-hidden="true">
                                    <UserRound size={28} className="text-border" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-normal font-bold [overflow-wrap:anywhere]">{profile.name}</h2>
                                    <p className="mt-1 text-small">{role}</p>
                                </div>
                            </div>
                            <dl className="flex flex-col gap-4 mt-6">
                                <div>
                                    <dt className="text-small text-border">E-mail</dt>
                                    <dd className="mt-1 text-normal [overflow-wrap:anywhere]">{profile.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-small text-border">Cargo</dt>
                                    <dd className="mt-1 text-normal">{role}</dd>
                                </div>
                            </dl>
                        </>
                    )}
                </Card>
            </div>
        </>
    );
}

export default Profile;
