import type { ComponentPropsWithRef } from "react";

type SelectProps = ComponentPropsWithRef<"select">;

function Select({className = "", children, ...props}: SelectProps) {
    return (
        <select {...props} className={`border border-border rounded-md p-2 bg-white text-small ${className}`}>
            {children}
        </select>
    );
}

export default Select;
