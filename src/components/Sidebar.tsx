import logo from "../assets/logoLabSafe.svg";
import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { UserRole } from "../utils/user";
import { menusByRole } from "../utils/navigation";

interface SidebarProps {
    name: string;
    role: UserRole;
}

function Sidebar({name, role}: SidebarProps) {
    const menu = menusByRole[role];

    const navigate = useNavigate();

    function handleLogout() {
        sessionStorage.removeItem("token");
        navigate("/");
    }

    return (
        <aside className="bg-primary h-full w-3xs shrink-0 flex flex-col justify-between p-4">
            <div className="flex items-center gap-2">
                <img src={logo} className="w-8 h-8" alt="Logo da LabSafe" />
                <p className="text-white text-title">LabSafe</p>
            </div>

            <nav>
                <ul className="text-white flex flex-col gap-8">
                    {menu.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li key={item.path}>
                                <Link to={item.path} className="flex gap-2 items-center">
                                    <Icon size={20} />
                                    {item.text}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            
            <div>
                <div className="flex gap-2 items-center">
                    <div className="h-8 w-8 bg-white rounded-full"></div>
                    <div className="flex flex-col gap-1">
                        <p className="text-white text-normal font-bold">{name}</p>
                        <p className="text-white text-small">{role}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="mt-1 flex gap-1 items-center cursor-pointer">
                    <LogOut size={20} className="text-white" />
                    <p className="text-white text-normal">Sair</p>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;
