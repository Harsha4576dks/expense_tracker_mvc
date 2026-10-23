import { useState } from "react";
import { sendExpenseReportEmail } from "../services/emailService";
import { getErrorMessage } from "../utils/errorhandler";

export const useEmailDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendEmail = async (userId, startDate, endDate, comment) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = await sendExpenseReportEmail(userId, startDate, endDate, comment);
            setSuccess("Expense report email sent successfully!");
            return data;
        } catch (err) {
            setError(getErrorMessage(err));
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSendEmail,
        loading,
        error,
        success,
    };
};