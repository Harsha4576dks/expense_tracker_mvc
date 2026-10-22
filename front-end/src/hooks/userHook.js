import { useState } from "react";
import { createUser, getUser, deleteUser } from "../services/userService";
import { getErrorMessage} from "../utils/errorhandler";

const initialFormData = {
    fullName: "",
    salary:"",
    email:"",
};

export const UserDetails = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [userList, setUserList] = useState([]);

    const handleChange = (event) => {
        const { name, value } = event.target;
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

        try {
            const savedUser = await createUser(formData);
            setUserList((currentUsers) => [...currentUsers, savedUser]);
            setFormData(initialFormData);
            setSuccess("User details saved successfully.");
    } catch (submitError) {
        setError(getErrorMessage(submitError));
    } finally {
        setLoading(false);
    }
};

   const fetchAllUSers = async (userId) => {
    setLoading(true);
    setError("");
    try {
        const data = await getUser(userId);
        setUserList(data);
    } catch (fetchError) {
        setError(getErrorMessage(fetchError));
    } finally {
        setLoading(false);
    }
   };

   const handleDelete = async (userId) => {
    if (! window.confirm("Are you sure you want to delete this record?")) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
        await deleteUser(userId);
        setSuccess("User record deleted successfully.");
        setUserList((prev) => prev.filter((user) => user.id !== userId));
    } catch (deleteError) {
        setError(getErrorMessage(deleteError));
    } finally {
        setLoading(false);
    }
   };


   return {
    formData, handleChange, handleDelete, handleSubmit, loading, success,
    error, setFormData, userList, fetchAllUSers
   }
}