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
import Peneliian from "./features/peneliitan/Penelitian";
import Profile from "./features/profile/Profile";
import PenelitianDetail from "./features/peneliitan/PenelitianDetail";
import DataDosen from "./features/dosen/DataDosen";
import PilihJurusan from "./features/pembelajaran/PilihJurusan";
import PembelajaranJurusan from "./features/pembelajaran/PembelajaranJurusan";
import DetailDosen from "./features/dosen/DetailDosen";

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
        { path: "/profile", element:<Profile/>},
        { element:  <RoleGuard allowedRoles={["dekan", "kaprodi","prodi", "tata-usaha"]} />,
          children: [
            { path: "/tri-dharma/pembelajaran/jurusan", element: <PilihJurusan />},
            { path: "/tri-dharma/pembelajaran/:jurusanId", element: <PembelajaranJurusan />},
            { path: "/tri-dharma/pembelajaran/:jurusanId/:id", element: <MataKuliahDetail />},
          ]
        },
        { element: <RoleGuard allowedRoles={["dosen"]} />,
            children: [
                { path: "/tri-dharma/pembelajaran", element: <Pembelajaran/>},
                { path: "/tri-dharma/pembelajaran/:id", element: <MataKuliahDetail /> },
                // { path: "/tri-dharma/pkm", element: <PKM/>},
                // { path: "/tri-dharma/penunjang", element: <Penunjang/>},
            ],
        },
        {
          element: <RoleGuard allowedRoles={["dekan", "kaprodi","prodi", "tata-usaha", "dosen"]} />,
            children: [
                { path: "/tri-dharma/data-dosen/:id", element: <DetailDosen />},
                { path: "/tri-dharma/penelitian", element: <Peneliian/>},
                { path: "/tri-dharma/penelitian/:id", element: <PenelitianDetail /> },
                // { path: "/tri-dharma/pkm", element: <PKM/>},
                // { path: "/tri-dharma/penunjang", element: <Penunjang/>},
            ],
        },
        { path: "/data-dosen", element: <DataDosen />},
        { path: "/tri-dharma/pembelajara/:dosenId", element: <Pembelajaran /> },
      // add role guard
    ],
  },

  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);