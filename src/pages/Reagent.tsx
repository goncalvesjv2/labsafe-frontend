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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/compounds/${encodeURIComponent(result.data.reagent)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Composto não encontrado")
            }

            setCompound(data);
            setReagent("");
        } catch {
            setError("Composto não encontrado")
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
