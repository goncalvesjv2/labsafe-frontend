import type { HTMLAttributes } from "react";

type TitleProps = HTMLAttributes<HTMLHeadingElement>;

function Title({className = "", children, ...props}: TitleProps) {
    return (
        <h1 {...props} className={`text-title font-bold ${className}`}>
            {children}
        </h1>
    );
}

export default Title;
