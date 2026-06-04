import api from "./axiosInstance";

export default register = async (registerData) => {
    try{
        const response = await api.post("/auth/register",registerData);
        return response.data;
    }
    catch(error){
        throw error;
    }
};

export default login = async (loginData) => {
    try{
        const response = api.post("/auth/login",loginData);
        return response.data;
    }
    catch(error) {
        throw error;    
    }
}