import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function Select({className = "", children, ...props}: SelectProps) {
    return (
        <select {...props} className={`border border-border rounded-md p-2 bg-white text-small ${className}`}>
            {children}
        </select>
    );
}

export default Select;
