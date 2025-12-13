import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });

            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/register', {
                name,
                email,
                password,
                role
            });

            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };



    const updateProfile = async (data) => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put('http://localhost:5001/api/auth/profile', data, config);

            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    };

    const changePassword = async (data) => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put('http://localhost:5001/api/auth/password', data, config);
            return { success: true };
        } catch (error) {
            console.error('Password change error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Password change failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, changePassword, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
