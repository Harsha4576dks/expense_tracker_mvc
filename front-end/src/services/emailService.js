import apiClient from "../middleware/client";

export const sendExpenseReportEmail = async (userId, startDate, endDate, comment) => {
    try {
        const params = {
            start_date: startDate,
            end_date: endDate,
        };
        if (comment) {
            params.comment = comment;
        }

        const response = await apiClient.post(`/email/send-expense-report/${userId}`, null, {
            params,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail ?? "Failed to send expense report email";
    }
};