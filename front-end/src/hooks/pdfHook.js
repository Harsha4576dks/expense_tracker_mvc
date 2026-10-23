import { useState } from "react";
import { downloadUserExpensePdf } from "../services/pdfService";
import { getErrorMessage } from "../utils/errorhandler";

export const usePdfDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleDownloadPdf = async (userId, startDate, endDate) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const blobData = await downloadUserExpensePdf(userId, startDate, endDate);
            
            
            const url = window.URL.createObjectURL(new Blob([blobData], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user_${userId}_expense_report.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSuccess("PDF downloaded successfully!");
            return true;
        } catch (err) {
            setError(getErrorMessage(err));
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDownloadPdf,
        loading,
        error,
        success,
    };
};