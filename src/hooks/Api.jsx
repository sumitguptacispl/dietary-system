import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_API_USERNAME}:${import.meta.env.VITE_API_PASSWORD}`)}`,
        'Content-Type': 'application/json',
    },
});

// Function to handle API requests
export const apiPost = async (endpoint, data,) => {
    try {
        const response = await api.post(endpoint, data,{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export default api;
