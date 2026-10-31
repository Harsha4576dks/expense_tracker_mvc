import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://expense-tracker-mvc-1.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
