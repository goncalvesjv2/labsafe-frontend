import type { HTMLAttributes } from "react";

interface DocumentSectionProps extends HTMLAttributes<HTMLElement> {
    title: string;
    contentClassName?: string;
}

function DocumentSection({title, className = "", contentClassName = "", children, ...props}: DocumentSectionProps) {
    return (
        <section {...props} className={className}>
            <h2 className="font-bold my-2">{title}</h2>
            <div className={`flex flex-col gap-2 text-small ${contentClassName}`}>
                {children}
            </div>
        </section>
    );
}

export default DocumentSection;
