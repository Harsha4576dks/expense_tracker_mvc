import apiClient from "../api/client";

export const loginUser  = async (username, password) => {
    const response = await apiClient.post('/auth/login', {
        username: username,
        password: password,
    });

    if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
};

export const registerUser = async (userData) => {
    const response = await apiClient.post('/auth/register',{
        username: userData.username,
        email: userData.email,
        password: userData.password,
    });

    if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
}