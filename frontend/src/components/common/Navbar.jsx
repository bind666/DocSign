// src/components/common/Navbar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHome, FaUser, FaTicketAlt, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${isActive ? "bg-teal-600 text-white" : "text-gray-200 hover:bg-teal-700"
        }`;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md p-4">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-teal-400">Digital <span className="text-white italic">Sign</span></div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white focus:outline-none text-2xl"
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className="hidden md:flex items-center gap-6 text-lg font-semibold">
                    <NavLink to="/dashboard" className={navLinkClass}>
                        <FaHome /> Dashboard
                    </NavLink>
                    <NavLink to="/profile" className={navLinkClass}>
                        <FaUser /> Profile
                    </NavLink>
                    <NavLink to="/audit" className={navLinkClass}>
                        <FaTicketAlt /> Audit Trail
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-bold transition duration-300"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="flex flex-col mt-4 gap-2 md:hidden text-md font-medium">
                    <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsOpen(false)}>
                        <FaHome /> Dashboard
                    </NavLink>
                    <NavLink to="/tickets" className={navLinkClass} onClick={() => setIsOpen(false)}>
                        <FaTicketAlt /> Tickets
                    </NavLink>
                    <NavLink to="/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>
                        <FaUser /> Profile
                    </NavLink>
                    <NavLink to="/audit" className={navLinkClass} onClick={() => setIsOpen(false)}>
                        <FaTicketAlt /> Audit Trail
                    </NavLink>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                        }}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-bold transition duration-300"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
