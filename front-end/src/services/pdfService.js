import apiClient from "../middleware/client";

export const downloadUserExpensePdf = async (userId, startDate, endDate) => {
    try {
        const response = await apiClient.get(`/expenses/user/${userId}/graph/pdf`, {
            params: {
                start_date: startDate,
                end_date: endDate,
            },
            responseType: 'blob', 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail ?? "Failed to download PDF summary";
    }
};