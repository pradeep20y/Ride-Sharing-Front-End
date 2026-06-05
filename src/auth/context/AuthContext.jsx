 import { createContext, useContext, useState } from "react";
import { deleteToken, getToken, setToken } from "../../utils/tokenUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [token,setTokenState] = useState( getToken() || null);
    const [user,setUser] = useState(null);
    const login = (newToken)=>{
        setToken(newToken);
        setTokenState(newToken);
    }

    const logout = ()=>{
        deleteToken();
        setTokenState(null);
    }
    
    return (<AuthContext.Provider value={{login,logout,token,user}} >
        {children}
    </AuthContext.Provider>);

}

const useAuth = () => useContext(AuthContext);

export default useAuth;