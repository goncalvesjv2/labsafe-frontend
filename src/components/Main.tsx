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
        <div className="flex">
            <Sidebar name={payload.name} role={payload.role}/>
            <main className="flex-1">
                <Content>
                    <Outlet />
                </Content>
            </main>
        </div>
    )
}

export default Main;