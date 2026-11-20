import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormField from "../components/FormField";
import Input from "../components/Input";
import Title from "../components/Title";
import type { ILog } from "../interfaces/ILog";

function Logs() {
    const [logs, setLogs] = useState<ILog[]>([]);
    const [emailSearch, setEmailSearch] = useState("");
    const [actionSearch, setActionSearch] = useState("");
    const [descriptionSearch, setDescriptionSearch] = useState("");
    const [dateSearch, setDateSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    const selectedDate = dateSearch ? new Date(dateSearch + "T00:00:00").toLocaleDateString("pt-BR") : "";
    const filteredLogs = logs.filter((log) => {
        const matchesEmail = log.email.toLowerCase().includes(emailSearch.trim().toLowerCase());
        const matchesAction = log.action.toLowerCase().includes(actionSearch.trim().toLowerCase());
        const matchesDescription = log.description.toLowerCase().includes(descriptionSearch.trim().toLowerCase());
        const matchesDate = !selectedDate || new Date(log.createdAt).toLocaleDateString("pt-BR") === selectedDate;
        return matchesEmail && matchesAction && matchesDescription && matchesDate;
    });

    useEffect(() => {
        async function fetchLogs() {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    navigate("/", { replace: true });
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/logs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 401) {
                    sessionStorage.removeItem("token");
                    navigate("/", { replace: true });
                    return;
                }

                if (response.status === 403) {
                    throw new Error("Somente administradores podem consultar a auditoria.");
                }

                if (!response.ok) {
                    throw new Error("Não foi possível carregar os registros de auditoria.");
                }

                const data: ILog[] = await response.json();
                setLogs(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Não foi possível carregar os registros de auditoria.");
            } finally {
                setLoading(false);
            }
        }

        fetchLogs();
    }, [navigate, reload]);

    function handleRefresh() {
        setLoading(true);
        setError("");
        setReload(reload + 1);
    }

    function handleClearFilters() {
        setEmailSearch("");
        setActionSearch("");
        setDescriptionSearch("");
        setDateSearch("");
    }

    return (
        <>
            <Title>Auditoria</Title>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-normal text-border font-bold">Consulte as atividades registradas no sistema</p>
                <Button variant="secondary" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw size={16} aria-hidden="true" />
                    {loading ? "Carregando..." : "Atualizar"}
                </Button>
            </div>

            <div role="search" aria-label="Filtrar registros de auditoria" className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-white p-4 text-small sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="E-mail do usuário" htmlFor="audit-email" className="min-w-0">
                    <Input id="audit-email" type="search" placeholder="Buscar e-mail" value={emailSearch} onChange={(event) => setEmailSearch(event.target.value)} />
                </FormField>
                <FormField label="Ação" htmlFor="audit-action" className="min-w-0">
                    <Input id="audit-action" type="search" placeholder="Buscar ação" value={actionSearch} onChange={(event) => setActionSearch(event.target.value)} />
                </FormField>
                <FormField label="Descrição" htmlFor="audit-description" className="min-w-0">
                    <Input id="audit-description" type="search" placeholder="Buscar descrição" value={descriptionSearch} onChange={(event) => setDescriptionSearch(event.target.value)} />
                </FormField>
                <FormField label="Data" htmlFor="audit-date" className="min-w-0">
                    <Input id="audit-date" type="date" className="min-w-0" value={dateSearch} onChange={(event) => setDateSearch(event.target.value)} />
                </FormField>
                <div className="sm:col-span-2 xl:col-span-4 flex flex-wrap items-center justify-end gap-3">
                    <Button variant="secondary" onClick={handleClearFilters}>Limpar filtros</Button>
                </div>
            </div>

            {loading && <p role="status" className="mt-4 text-small">Carregando registros de auditoria...</p>}
            {error && <p role="alert" className="mt-4 text-small text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="mt-4 overflow-x-auto rounded-lg bg-white p-2">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-background">
                                <th scope="col" className="p-2 text-normal">E-mail</th>
                                <th scope="col" className="p-2 text-normal">Ação</th>
                                <th scope="col" className="p-2 text-normal">Descrição</th>
                                <th scope="col" className="p-2 text-normal whitespace-nowrap">Data e hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-small">
                                        <p role="status">Nenhum registro encontrado.</p>
                                    </td>
                                </tr>
                            )}
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="border-b border-background align-top">
                                    <td className="p-2 text-small [overflow-wrap:anywhere]">{log.email}</td>
                                    <td className="p-2 text-small [overflow-wrap:anywhere]">{log.action}</td>
                                    <td className="p-2 text-small whitespace-pre-wrap [overflow-wrap:anywhere]">{log.description}</td>
                                    <td className="p-2 text-small whitespace-nowrap">
                                        <time dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleString("pt-BR")}</time>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default Logs;
