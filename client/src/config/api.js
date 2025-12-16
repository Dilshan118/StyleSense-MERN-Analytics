const getBaseUrl = () => {
    // Check if VITE_API_URL environment variable is defined
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Fallback to localhost for local development
    return 'http://localhost:5001';
};

export const API_BASE_URL = getBaseUrl();
