import apiClient from "../middleware/client";

export const createUser = async (userData) => {
    const response = await apiClient.post("/users/", {
        name: userData.fullName.trim(),
        salary: Number(userData.salary),
        email: userData.email.trim(),
    });
    return { ...response.data, fullName: response.data.name };
};

export const getUser = async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return {
        ...response.data,
        fullName: response.data.fullName ?? response.data.name,
    };
};

export const getUsers = async (name = "") => {
    const response = await apiClient.get("/users/", {
        params: name ? { name } : {},
    });
    return response.data.map((user) => ({
        ...user,
        fullName: user.fullName ?? user.name,
    }));
};
