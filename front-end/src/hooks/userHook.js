import { useCallback, useRef, useState } from "react";
import { createUser, searchUsersByName } from "../services/userService";
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
    const searchRequestId = useRef(0);

    const invalidateUserSearch = useCallback(() => {
        searchRequestId.current += 1;
        setLoading(false);
        setError("");
        setUserList([]);
    }, []);

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
            return savedUser;
    } catch (submitError) {
        setError(getErrorMessage(submitError));
        return null;
    } finally {
        setLoading(false);
    }
};

    const fetchUsersByName = useCallback(async (name) => {
        const requestId = ++searchRequestId.current;
        setLoading(true);
        setError("");

        try {
            const users = await searchUsersByName(name);
            if (requestId === searchRequestId.current) {
                setUserList(users);
            }
            return users;
        } catch (fetchError) {
            if (requestId === searchRequestId.current) {
                setUserList([]);
                setError(getErrorMessage(fetchError));
            }
            return null;
        } finally {
            if (requestId === searchRequestId.current) {
                setLoading(false);
            }
        }
    }, []);

   return {
    formData, handleChange, handleSubmit, loading, success,
    error, setFormData, userList, fetchUsersByName, invalidateUserSearch
   }
}