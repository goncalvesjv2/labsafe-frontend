import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import Button from "../components/Button";
import { getTokenPayload } from "../utils/token";

function NotFound() {
    const navigate = useNavigate();

    function handleBack() {
        navigate(getTokenPayload() ? "/home" : "/", { replace: true });
    }

    return (
        <main className="min-h-dvh flex flex-col items-center justify-center gap-4 p-4 text-center">
            <Title>Página não encontrada</Title>
            <Button onClick={handleBack}>Voltar para início</Button>
        </main>
    );
}

export default NotFound;
