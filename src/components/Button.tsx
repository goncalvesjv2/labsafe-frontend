import type { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
}

function Button(props: ButtonProps) {
    let color = "bg-primary text-white";

    if (props.variant === "secondary") {
        color = "border border-border text-border";
    }

    return (
        <button
            type={props.type || "button"}
            onClick={props.onClick}
            disabled={props.disabled}
            className={`inline-flex items-center justify-center gap-2 rounded-md p-2 text-small font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${color} ${props.className || ""}`}
        >
            {props.children}
        </button>
    );
}

export default Button;
