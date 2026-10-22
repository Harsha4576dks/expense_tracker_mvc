import { useState } from "react";
import { useNavigate} from 'react-router-dom';
import { loginUser, registerUser } from "../services/loginService";
import { getErrorMessage } from "../utils/errorhandler";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (username, password) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

    try {
        await loginUser(username, password);
        setSuccessMessage('Login successful! Redirecting...');

        setTimeout(() => {
            navigate('/home');
        }, 900);
    } catch (submitError) {
        setError(getErrorMessage(submitError));
    } finally {
        setLoading(false);
    }
};


    const handleRegister = async (userData) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            await registerUser(userData);
            setSuccessMessage("Registration successfull! please log in.");
            navigate("/login");
        } catch (submitError) {
            setError(getErrorMessage(submitError));
        
        } finally {
            setLoading(false);
        }
    };

    return {loading, error, successMessage, handleLogin, handleRegister,};
 
};