import { useEffect, useRef, useState } from "react";
import { Trash, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Title from "../components/Title";
import type { IUsers } from "../interfaces/IUsers";
import { mapUserRole, userRole } from "../utils/user";
import { getTokenPayload } from "../utils/token";

function Profile({ userId }: { userId?: number }) {
    const [profile, setProfile] = useState<IUsers | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const deleteInProgress = useRef(false);
    const navigate = useNavigate();

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
    const loggedUser = getTokenPayload();
    const canDeleteAccount = userId === undefined && !loading && !error && profile !== null
        && profile.id === loggedUser?.sub
        && (role === userRole.PROFESSOR || role === userRole.ALUNO)
        && (loggedUser.role === userRole.PROFESSOR || loggedUser.role === userRole.ALUNO);

    async function handleDeleteAccount() {
        if (!canDeleteAccount || deleteInProgress.current) return;

        deleteInProgress.current = true;
        setDeleting(true);
        setDeleteError("");

        try {
            const token = sessionStorage.getItem("token");
            const currentUser = getTokenPayload(token);

            if (!currentUser || currentUser.sub !== profile?.id) {
                sessionStorage.removeItem("token");
                navigate("/", { replace: true });
                return;
            }

            if (currentUser.role !== userRole.PROFESSOR && currentUser.role !== userRole.ALUNO) {
                throw new Error("A exclusão da própria conta está disponível apenas para professores e alunos.");
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 401) {
                sessionStorage.removeItem("token");
                navigate("/", { replace: true });
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "Não foi possível excluir sua conta. Tente novamente.");
            }

            sessionStorage.removeItem("token");
            navigate("/", { replace: true });
        } catch (error) {
            setDeleteError(error instanceof Error && error.name !== "TypeError"
                ? error.message
                : "Não foi possível conectar ao servidor. Tente novamente.");
        } finally {
            deleteInProgress.current = false;
            setDeleting(false);
        }
    }

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
            {canDeleteAccount && (
                <div className="mt-4 flex flex-col items-end gap-2">
                    <Button onClick={() => { setDeleteError(""); setShowDeleteConfirmation(true); }} disabled={deleting} aria-busy={deleting} className="bg-red-700 hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">
                        <Trash size={16} aria-hidden="true" />
                        {deleting ? "Excluindo conta..." : "Excluir minha conta"}
                    </Button>
                </div>
            )}
            <Modal open={showDeleteConfirmation && canDeleteAccount} description="Deseja excluir permanentemente sua conta do LabSafe? Você perderá o acesso à plataforma. Essa ação não pode ser desfeita." busy={deleting} error={deleteError} onCancel={() => setShowDeleteConfirmation(false)} onConfirm={handleDeleteAccount} />
        </>
    );
}

export default Profile;
