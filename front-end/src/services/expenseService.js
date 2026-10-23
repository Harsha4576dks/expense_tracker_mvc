import apiClient from "../api/client";

export const createExpense = async (expenseData) => {
    try {
        const expensePayload = {
            date: expenseData.date,
            description: expenseData.description,
            category: expenseData.category,
            payment_method: expenseData.payment_method,
            amount_spent: Number(expenseData.amount_spent),
            user_id: Number(expenseData.user_id)
        };
        const response = await apiClient.post("/expenses/", expensePayload);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail ?? "Failed to store expense details";
    }
};

export const getExpense = async (expenseId) => {
    try{
    const response = await apiClient.get(`expenses/${expenseId}`);
    return response.data;
    } catch (error) {
        throw error.response?.data?.detail ?? " Failed to fetch expense details";
    }
};

export const updateExpense = async (expenseId, expenseData) => {
    try{
        const expensePayload = {
            description: expenseData.description,
            payment_method: expenseData.payment_method,
            amount_spent: Number(expenseData.amount_spent),
            user_id: Number(expenseData.user_id),
        };
        const response = await apiClient.put(`/expenses/${expenseId}`, expensePayload);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || "Failed to update expense details";
    }
};

export const deleteExpense = async (expenseId) => {
    try{
        const response = await apiClient.delete(`/expenses/${expenseId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail ?? "Failed to delete expense details";
    }
};
