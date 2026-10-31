import { useCallback, useRef, useState } from "react";
import {
    createExpense,
    getExpenses,
    getExpense,
    updateExpense,
    deleteExpense,
} from "../services/expenseService";
import { getErrorMessage} from "../utils/errorhandler";

export const ExpenseDetails = () => {
    const [formData, setFormData] = useState({
        date: "",
        description: "",
        category: "",
        payment_method: "",
        amount_spent: "",
        user_id: "",
        user_name: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [expenseData, setExpenseData] = useState(null);
    const searchRequestId = useRef(0);

    const invalidateExpenseSearch = useCallback(() => {
        searchRequestId.current += 1;
        setLoading(false);
    }, []);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try  {
            const createdExpense = await createExpense(formData);
            setSuccess("expense details saved successfully.");
            setFormData({
                date: "",
                description: "",
                category: "",
                payment_method: "",
                amount_spent: "",
                user_id: "",
                user_name: "",
            });
            return createdExpense;
        } catch (submitError) {
            setError(getErrorMessage(submitError));
            return null;
        } finally {
            setLoading(false);
        }
    };


    const fetchExpensebyId = async (expenseId) => {
        setLoading(true);
        setError("");
        setSuccess("");
        setExpenseData(null);

        try {
            const data = await getExpense(expenseId);
            const expenses = Array.isArray(data) ? data : [data];
            setExpenseData(expenses);
            return expenses;
         } catch (fetchError) {
            const errorMessage = getErrorMessage(fetchError);
            if (errorMessage.trim() === "user has no expenses yet") {
                setExpenseData([]);
                return [];
            }
            setError(errorMessage);
            return null;
         } finally {
            setLoading(false);
         }
    };

    const fetchExpenses = useCallback(async (userName = "") => {
        const requestId = ++searchRequestId.current;
        setLoading(true);
        setError("");
        setExpenseData(null);

        try {
            const expenses = await getExpenses(userName);
            if (requestId === searchRequestId.current) {
                setExpenseData(expenses);
            }
            return expenses;
        } catch (fetchError) {
            if (requestId === searchRequestId.current) {
                setError(getErrorMessage(fetchError));
                setExpenseData([]);
            }
            return null;
        } finally {
            if (requestId === searchRequestId.current) {
                setLoading(false);
            }
        }
    }, []);


    const handleUpdate = async (expenseId, event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await updateExpense(expenseId, formData);
            setSuccess("expense details updated successfully");

            return true;
        } catch (updateError) {
            setError(getErrorMessage(updateError));
            return false;
        } finally {
            setLoading(false);
        }

    };


    const handleDelete = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense record?")) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await deleteExpense(expenseId);
            setSuccess("expense records deleted successfully.");
            return true;
        } catch (deleteError) {
            setError(getErrorMessage(deleteError));
            return false;
        } finally {
            setLoading(false);
        }
    };


    return {
        formData, setFormData, handleChange, handleDelete, handleSubmit,
        handleUpdate, fetchExpensebyId, fetchExpenses, invalidateExpenseSearch,
        loading, success, error, expenseData,
        setExpenseData,
    }
}