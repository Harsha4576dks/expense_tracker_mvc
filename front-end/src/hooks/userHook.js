import { useState } from "react";
import { createUser, getUser } from "../services/userService";
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

   const fetchUserById = async (userId) => {
    setLoading(true);
    setError("");
    setUserList([]);
    try {
        const data = await getUser(userId);
        setUserList([data]);
    } catch (fetchError) {
        setUserList([]);
        setError(getErrorMessage(fetchError));
    } finally {
        setLoading(false);
    }
   };

   return {
    formData, handleChange, handleSubmit, loading, success,
    error, setFormData, userList, fetchUserById
   }
}