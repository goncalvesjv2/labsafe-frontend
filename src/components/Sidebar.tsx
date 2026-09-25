import logo from "../assets/logoLabSafe.svg";
import { Users, User, LayoutDashboard, SquareText, ClipboardList, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { userRole, type UserRole } from "../utils/user";

const menuAdmin = [
    {
        text: "Usuários",
        path: "/users",
        icon: Users,
    },
    {
        text: "Perfil",
        path: "/profile",
        icon: User,
    }
];

const menuTeacher = [
    {
        text: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },
    {
        text: "Conteúdo",
        path: "/contents",
        icon: SquareText
    },
    {
        text: "Quiz",
        path: "/quiz",
        icon: ClipboardList
    },
    {
        text: "Perfil",
        path: "/profile",
        icon: User
    }
];

const menuStudent = [
    {
        text: "Conteúdo",
        path: "/contents",
        icon: SquareText
    },
    {
        text: "Quiz",
        path: "/quiz",
        icon: ClipboardList
    },
    {
        text: "Perfil",
        path: "/profile",
        icon: User
    }
]

interface SidebarProps {
    role?: UserRole;
}

function Sidebar({role}: SidebarProps) {
    let menu;

    if (role === userRole.ADMIN) {
        menu = menuAdmin;
    } else if (role === userRole.PROFESSOR) {
        menu = menuTeacher;
    } else if (role === userRole.ALUNO) {
        menu = menuStudent;
    }
    
    return (
        <aside className="bg-primary h-screen w-3xs flex flex-col justify-between p-4">
            <div className="flex items-center gap-2">
                <img src={logo} className="w-8 h-8" alt="Logo da LabSafe" />
                <p className="text-white text-title">LabSafe</p>
            </div>

            <nav>
                <ul className="text-white flex flex-col gap-8">
                    {menu?.map((item) => {
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
                        <p className="text-white text-normal font-bold">João Victor</p>
                        <p className="text-white text-small">Admin</p>
                    </div>
                </div>
                <button className="mt-1 flex gap-1 items-center">
                    <LogOut size={20} className="text-white" />
                    <p className="text-white text-normal">Sair</p>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;