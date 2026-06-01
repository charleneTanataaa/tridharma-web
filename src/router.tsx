// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "./components/guards/AuthGuard";
import GuestGuard from "./components/guards/GuestGuard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ForgetPassword from "./features/auth/ForgetPassword";
import Dashboard from "./features/dashboard/Dashboard";
import RoleGuard from "./components/guards/RoleGuard";
import Pembelajaran from "./features/pembelajaran/Pembelajaran";
import MataKuliahDetail from "./features/pembelajaran/MataKuliahDetail";
import NotifikasiPage from "./features/dashboard/Notifikasi";

export const router = createBrowserRouter([
  // Guest only (logged in users get redirected)
  {
    element: <GuestGuard />,
    children: [
      { path: "/login",            element: <Login /> },
      { path: "/register",         element: <Register /> },
      { path: "/forget-password",  element: <ForgetPassword /> },
    ],
  },

  // Must be logged in
  {
    element: <AuthGuard />,
    children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/notifikasi", element: <NotifikasiPage/>},
        { element: <RoleGuard allowedRoles={["dekan", "kaprodi", "tata-usaha", "dosen"]} />,
            children: [
                { path: "/tri-dharma/pembelajaran", element: <Pembelajaran/>},
                {
                  path: "/tri-dharma/pembelajaran/:id",
                  element: <MataKuliahDetail />
                }
                // { path: "/tri-dharma/penelitian", element: <Penelitian/>},
                // { path: "/tri-dharma/pkm", element: <PKM/>},
                // { path: "/tri-dharma/penunjang", element: <Penunjang/>},
            ],
        },
      // add role guard
    ],
  },

  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);