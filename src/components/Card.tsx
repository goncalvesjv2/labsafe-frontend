import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

function Card({className = "", children, ...props}: CardProps) {
    return (
        <div {...props} className={`bg-white rounded-lg p-4 ${className}`}>
            {children}
        </div>
    );
}

export default Card;
