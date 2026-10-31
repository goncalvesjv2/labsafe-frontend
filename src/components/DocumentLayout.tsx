import type { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import Content from "./Content";
import Title from "./Title";
import Button from "./Button";

interface DocumentLayoutProps extends HTMLAttributes<HTMLElement> {
    title: string;
    backTo?: string;
}

function DocumentLayout({title, backTo = "/", className = "", children, ...props}: DocumentLayoutProps) {
    const navigate = useNavigate();

    function handleBack() {
        navigate(backTo);
    }

    return (
        <Content>
            <Title className="text-center">{title}</Title>
            <main {...props} className={`flex flex-col gap-2 ${className}`}>
                {children}
            </main>
            <div className="flex justify-center mt-4">
                <Button onClick={handleBack} variant="secondary" className="bg-white">Voltar</Button>
            </div>
        </Content>
    );
}

export default DocumentLayout;
