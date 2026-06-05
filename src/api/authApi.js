import api from "./axiosInstance";

export const registerReq = async (registerData) => {
    try{
        const response = await api.post("/auth/register",registerData);
        return response.data;
    }
    catch(error){
        throw error;
    }
};

export const loginReq = async (loginData) => {
    try{
        const response = await api.post("/auth/login",loginData);
        return response.data;
    }
    catch(error) {
        throw error;    
    }
}