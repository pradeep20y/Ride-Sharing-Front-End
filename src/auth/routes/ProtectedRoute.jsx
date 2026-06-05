import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext"

const ProtectedRoute = ({children}) => {
    const navigate =  useNavigate();
    const {token} = useAuth();

    if (!token) return <Navigate to="/login" replace />;

    return children;
}

export default ProtectedRoute;