import { useParams } from "react-router-dom";
import Profile from "./Profile";

function UserProfile() {
    const { id } = useParams();
    return <Profile key={id} userId={Number(id)} />;
}

export default UserProfile;
