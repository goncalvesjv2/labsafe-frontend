import type { PropsWithChildren } from "react";

function Content({children}: PropsWithChildren) {
    return (
        <div className="p-4 px-8">
            {children}
        </div>
    )
}

export default Content;