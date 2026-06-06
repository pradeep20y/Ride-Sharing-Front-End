import api from "./axiosInstance";

export const registerReq = async (registerData) => {
    try{
        const response = await api.post("/auth/register/passenger",registerData);
        return response.data;
    }
    catch(error){
        throw error;
    }
};

export const registerDriverReq = async (registerData) => {
    try {
        const response = await api.post("/auth/register/driver", registerData);
        return response.data;
    } catch (error) {
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