import apiClient from "../middleware/client";

export const loginUser  = async (username, password) => {
    const response = await apiClient.post('/auth/login', {
        username: username,
        password: password,
    });

    return response.data;
};

export const logoutUser = async () => {
    await apiClient.post('/auth/logout');
};

export const registerUser = async (userData) => {
    const response = await apiClient.post('/auth/register',{
        username: userData.username,
        email: userData.email,
        password: userData.password,
    });

    return response.data;
}