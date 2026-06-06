import { createContext, useContext, useState } from "react";
// Renamed the import function to 'saveTokenToStorage' to prevent state naming conflicts
import { deleteToken, getToken, setToken as saveTokenToStorage } from "../../utils/tokenUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Lazy initialization function ensures this runs exactly once on mount
    const [token, setTokenState] = useState(() => getToken() || null);
    const [user, setUser] = useState(null);
    
    // FIXED: Changed 'userState' typo to 'useState'
    const [userType, setUserType] = useState("");

    const login = (newToken) => {
        saveTokenToStorage(newToken); // Uses the safely renamed utility
        setTokenState(newToken);      // Updates the React layout state
    };

    const logout = () => {
        deleteToken();
        setTokenState(null);
        setUser(null);          // Good practice: clear user data on logout
        setUserType("");        // Good practice: clear user role on logout
    };

    const userInformation = ({ userDetails, role }) => {
        setUser(userDetails);
        setUserType(role);
    };
    
    return (
        <AuthContext.Provider value={{ login, logout, token, userInformation, user, userType }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;