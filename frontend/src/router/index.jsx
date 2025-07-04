// Routing Page. ALl Routes Handels Here.
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Context
import { AuthProvider } from "../context/AuthContext";

// Route protection
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Auth = lazy(() => import("../pages/Auth"));
const Audit = lazy(() => import("../pages/Audit"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<p>Loading Dashboard...</p>}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<p>Loading Profile...</p>}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "audit",
            element: (
              <Suspense fallback={<p>Loading Audit Trail...</p>}>
                <Audit />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "auth",
        element: (
          <PublicRoute>
            <Suspense fallback={<p>Loading Auth...</p>}>
              <Auth />
            </Suspense>
          </PublicRoute>
        ),
      },
    ],
  },
]);

export default router;
