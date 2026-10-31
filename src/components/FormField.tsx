import type { HTMLAttributes } from "react";

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    htmlFor: string;
}

function FormField({label, htmlFor, className = "", children, ...props}: FormFieldProps) {
    return (
        <div {...props} className={`flex flex-col gap-2 ${className}`}>
            <label htmlFor={htmlFor}>{label}</label>
            {children}
        </div>
    );
}

export default FormField;
