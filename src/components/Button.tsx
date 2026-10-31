import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

function Button({variant = "primary", className = "", type = "button", children, ...props}: ButtonProps) {
    let color = "bg-primary text-white";

    if (variant === "secondary") {
        color = "border border-border text-border";
    }

    return (
        <button {...props} type={type} className={`inline-flex items-center justify-center gap-2 rounded-md p-2 text-small font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${color} ${className}`}>
            {children}
        </button>
    );
}

export default Button;