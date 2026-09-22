import Content from "./Content";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Main() {
    return (
        <div className="flex">
            <Sidebar role="PROFESSOR"/>
            <main className="flex-1">
                <Content>
                    <Outlet />
                </Content>
            </main>
        </div>
    )
}

export default Main;