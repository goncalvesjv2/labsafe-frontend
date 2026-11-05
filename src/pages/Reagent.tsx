import { useState } from "react";
import type { IPubChem } from "../interfaces/IPubChem";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Title from "../components/Title";
import { z } from "zod";
import { reagentSchema } from "../schemas/reagentSchema";

function Reagent() {
    const [reagent, setReagent] = useState("");
    const [compound, setCompound] = useState<IPubChem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({ reagent: "" });

    async function searchReagent() {
        if (loading) {
            return;
        }

        setError("");
        setErrors({ reagent: "" });
        setCompound(null);
        const result = reagentSchema.safeParse({ reagent });

        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            setErrors({ reagent: fieldErrors.reagent?.[0] || "" });
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Faça login novamente para consultar reagentes.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/compounds/${encodeURIComponent(result.data.reagent)}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const messages: Record<number, string> = {
                    401: "Sessão expirada ou inválida. Faça login novamente.",
                    403: "Você não tem permissão para consultar reagentes.",
                    404: "Composto não encontrado."
                };
                setError(messages[response.status] ?? "Não foi possível consultar o reagente. Tente novamente.");
                return;
            }

            const data = await response.json();
            setCompound(data);
            setReagent("");
        } catch {
            setError("Não foi possível consultar o reagente. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Title>Consultar Reagentes</Title>
            <div className="mt-4 flex justify-between">
                <Input placeholder="Consultar reagente" value={reagent} disabled={loading} onChange={(e) => {
                    setReagent(e.target.value);
                    setErrors({ reagent: "" });
                    setError("");
                }} />
                <Button onClick={searchReagent} disabled={loading}>Consultar</Button>
            </div>
            {errors.reagent && <p role="alert" className="mt-4 text-red-500">{errors.reagent}</p>}
            {loading && <p className="mt-4">Consultando...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            
            {compound && (
                <div className="flex justify-center">
                    <Card className="mt-8 flex flex-col gap-4">
                        <p><strong>CID:</strong> {compound.cid}</p>
                        <p><strong>Nome:</strong> {compound.title}</p>
                        <p><strong>Fórmula molecular:</strong> {compound.molecularFormula}</p>
                        <p><strong>Peso molecular:</strong> {compound.molecularWeight}</p>
                    </Card>
                </div>
            )}
        </>
    )
}

export default Reagent;
