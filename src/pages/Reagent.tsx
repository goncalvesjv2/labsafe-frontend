import { useState } from "react";
import type { IPubChem } from "../interfaces/IPubChem";

function Reagent() {
    const [reagent, setReagent] = useState("");
    const [compound, setCompound] = useState<IPubChem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function searchReagent() {
        try {
            setError("");
            setCompound(null);
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/compounds/${reagent}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error("Composto não encontrado")
            }

            setCompound(data);
            setReagent("");
        } catch (error) {
            setError("Composto não encontrado")
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="font-bold text-title">Consultar Reagentes</h1>
            <div className="mt-4 flex justify-between">
                <input type="text" className="border border-border rounded-md p-2 bg-white" placeholder="Consultar reagente" value={reagent} onChange={(e) => setReagent(e.target.value)} />
                <button onClick={searchReagent} className="bg-primary p-2 text-white text-small font-bold rounded-md">Consultar</button>
            </div>
            {loading && <p className="mt-4">Consultando...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            
            {compound && (
                <div className="flex justify-center">
                    <div className="bg-white rounded-lg p-4 mt-8 flex flex-col gap-4">
                        <p>CID: {compound.cid}</p>
                        <p>Nome: {compound.title}</p>
                        <p>Fórmula molecular: {compound.molecularFormula}</p>
                        <p>Peso molecular: {compound.molecularWeight}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Reagent;