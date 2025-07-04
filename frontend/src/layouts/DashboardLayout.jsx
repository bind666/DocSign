// src/layouts/DashboardLayout.jsx
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Navbar />
            <main className="pt-16 px-4">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
