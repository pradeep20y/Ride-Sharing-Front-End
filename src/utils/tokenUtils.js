const TOKEN_KEY = 'auth_token';

export const setToken = (token) => {
    if (token) { 
        localStorage.setItem(TOKEN_KEY,token);
    }    
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const deleteToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}