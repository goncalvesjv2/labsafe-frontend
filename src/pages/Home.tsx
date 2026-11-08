import { Navigate } from "react-router-dom";
import { getTokenPayload } from "../utils/token";
import { getDefaultRoute } from "../utils/navigation";

function Home() {
    const user = getTokenPayload();

    return <Navigate to={user ? getDefaultRoute(user.role) : "/"} replace />;
}

export default Home;
