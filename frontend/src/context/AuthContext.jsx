import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Invalid credentials');
            }

            const data = await response.json();
            setToken(data.token);
            const userDetails = {
                id: data.userId,
                email: data.email,
                roles: data.roles
            };
            setUser(userDetails);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userDetails));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, phoneNumber) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, phoneNumber }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Registration failed');
            }
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ token, user, error, loading, login, register, logout, setError }}>
            {children}
        </AuthContext.Provider>
    );
};
