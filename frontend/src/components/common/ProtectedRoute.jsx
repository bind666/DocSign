import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

//This is Protected Route if user is not logged in they navigate to auth page
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/auth" />;

    return children;
};

export default ProtectedRoute;
