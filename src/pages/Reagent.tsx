import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IPubChem } from "../interfaces/IPubChem";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Title from "../components/Title";
import { reagentSchema, type ReagentFormData } from "../schemas/reagentSchema";

function Reagent() {
    const { register, handleSubmit, reset, clearErrors, formState: { errors, isSubmitting } } = useForm<ReagentFormData>({
        resolver: zodResolver(reagentSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            reagent: "",
        },
    });

    const [compound, setCompound] = useState<IPubChem | null>(null);
    const [error, setError] = useState("");

    async function searchReagent(data: ReagentFormData) {
        setError("");
        setCompound(null);

        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                setError("Faça login novamente para consultar reagentes.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/compounds/${encodeURIComponent(data.reagent)}`, {
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

            const compoundData = await response.json();
            setCompound(compoundData);
            reset();
        } catch {
            setError("Não foi possível consultar o reagente. Tente novamente.");
        }
    }

    function handleInvalidSubmit() {
        setError("");
        setCompound(null);
    }

    return (
        <>
            <Title>Consultar Reagentes</Title>
            <form onSubmit={handleSubmit(searchReagent, handleInvalidSubmit)} noValidate className="mt-4 flex justify-between">
                <Input placeholder="Consultar reagente" disabled={isSubmitting} {...register("reagent", {
                    onChange: () => {
                        clearErrors("reagent");
                        setError("");
                    },
                })} />
                <Button type="submit" disabled={isSubmitting}>Consultar</Button>
            </form>
            {errors.reagent && <p role="alert" className="mt-4 text-red-500">{errors.reagent.message}</p>}
            {isSubmitting && <p className="mt-4">Consultando...</p>}
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
