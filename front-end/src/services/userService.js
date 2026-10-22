import apiClient from "../api/client";

export const createUser = async (userData) => {
    try{
        const userPayload = {
            name: userData.name,
            salary: Number(userData.salary),
            email: userData.email,
        };
        const response = await apiClient.post('/users/', userPayload);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail ?? 'Failed to save user details';
    }
};

export const getUser = async () => {
    try{
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to fetch user details';
    }
};


export const deleteUser = async (userId) => {
    try{
        const response = await apiClient.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail ?? 'Failed to delete user details';
    }
};