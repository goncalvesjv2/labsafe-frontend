import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({type = "text", className = "", ...props}: InputProps) {
    return (
        <input {...props} type={type} className={`border border-border rounded-md p-2 bg-white text-small ${className}`} />
    );
}

export default Input;
