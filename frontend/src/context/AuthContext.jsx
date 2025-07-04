// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, logoutUser } from "../services/authService";
import toast from "react-hot-toast";

//This Is Auth Context Globally Handels Auth
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await getProfile();
            setUser(res.data.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error("Logout failed!");
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
