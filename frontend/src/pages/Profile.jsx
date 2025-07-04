import { useEffect, useState } from "react";
import { getProfile, logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

//Profile Page
const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile()
            .then((res) => setUser(res.data.data))
            .catch(() => navigate("/auth"));
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        alert("Logged out");
        navigate("/auth");
    };

    return user ? (
        <div className="max-w-md mx-auto mt-16 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white shadow-2xl rounded-xl p-8 text-center animate-fade-in transition-all duration-300">
            <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name?.charAt(0))}&background=0D8ABC&color=fff`}
                alt="User Avatar"
                className="w-28 h-28 mx-auto rounded-full mb-4 border-4 border-blue-500 shadow-md"
            />

            <h2 className="text-2xl font-bold text-green-400 mb-1">
                Welcome, {user.name}
            </h2>
            <p className="text-sm text-gray-300 mb-6 italic">📧 {user.email}</p>

            {/* <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition"
            >
                🚪 Logout
            </button> */}
        </div>
    ) : (
        <p className="text-center mt-20 text-gray-400 text-lg animate-pulse">Loading...</p>
    );
};

export default Profile;
