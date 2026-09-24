import type { PropsWithChildren } from "react";

function Content({children}: PropsWithChildren) {
    return (
        <div className="p-4">
            {children}
        </div>
    )
}

export default Content;