import { Navigate } from "react-router-dom";
import useAuth from "../context/AuthContext"

const PublicRoute = ({ children }) => {

    const { token, userType } = useAuth();

    if (token && userType==="PASSENGER") {
        return <Navigate to="/passengerPage" replace />;
    }
    else if (token && userType==="DRIVER"){
        return <Navigate to="/driverPage" replace />;
    }

    return children;
};

export default PublicRoute;