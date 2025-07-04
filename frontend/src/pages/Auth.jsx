import { useState } from "react";
import RegisterForm from "../components/auth/RegisterForm";
import LoginForm from "../components/auth/LoginForm";

//This is Auth Page Where Register And Login Components Displayed and Handels.
const Auth = () => {
    const [mode, setMode] = useState("login");

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1740&q=80')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />

            {/* Auth Box */}
            <div className="relative z-10 w-full max-w-md px-8 py-10 rounded-2xl shadow-xl bg-white/10 border border-white/20 backdrop-blur-lg">
                <h2 className="text-4xl font-bold text-white text-center mb-6 animate-fade-in">
                    {mode === "login" ? "Login" : "Register"}
                </h2>

                {mode === "login" ? (
                    <LoginForm />
                ) : (
                    <RegisterForm switchToLogin={() => setMode("login")} />
                )}

                <p className="text-center text-gray-300 mt-6">
                    {mode === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                        className="text-blue-400 hover:underline font-semibold"
                    >
                        {mode === "login" ? "Register" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
