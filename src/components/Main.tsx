import { getTokenPayload } from "../utils/token";
import Content from "./Content";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Main() {
    const payload = getTokenPayload();

    if(!payload) {
        return null;
    }

    return (
        <div className="flex h-dvh overflow-hidden">
            <Sidebar name={payload.name} role={payload.role}/>
            <main className="min-w-0 flex-1 overflow-y-auto">
                <Content>
                    <Outlet />
                </Content>
            </main>
        </div>
    )
}

export default Main;
