import useAuth from "../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const {token,logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!token) return null;

    return(
        <>
            <nav>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </>
    );
}

export default Navbar;