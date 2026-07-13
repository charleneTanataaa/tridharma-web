import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "./components/guards/AuthGuard";
import GuestGuard from "./components/guards/GuestGuard";
import Login from "./features/auth/Login";
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
import PembelajaranJurusan from "./features/pembelajaran/PembelajaranJurusan";
import DetailDosen from "./features/dosen/DetailDosen";
import PilihJurusan from "./features/pembelajaran/PilihJurusan";
import PilihJurusanPenelitian from "./features/peneliitan/PilihJurusanPenelitian";
import Penelitian from "./features/peneliitan/Penelitian";
import PenelitianJurusan from "./features/peneliitan/PenelitianJurusan";

export const router = createBrowserRouter([
  // Guest only (logged in users get redirected)
  {
    element: <GuestGuard />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/forget-password", element: <ForgetPassword /> },
    ],
  },

  // Must be logged in
  {
    element: <AuthGuard />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/notifikasi", element: <NotifikasiPage /> },
      { path: "/profile", element: <Profile /> },
      {
        element: <RoleGuard allowedRoles={["dosen"]} />,
        children: [
          { path: "/tri-dharma/pembelajaran", element: <Pembelajaran /> },
          { path: "/tri-dharma/pembelajaran/matkul/:id", element: <MataKuliahDetail /> },
          { path: "/tri-dharma/penelitian", element: <Penelitian /> },
          { path: "/tri-dharma/penelitian/detail/:id", element: <PenelitianDetail /> },
          // { path: "/tri-dharma/pkm", element: <PKM/>},
          // { path: "/tri-dharma/penunjang", element: <Penunjang/>},
        ],
      },
      {
        element: <RoleGuard allowedRoles={["dekan", "kaprodi", "prodi", "tata-usaha"]} />,
        children: [
          { path: "/tri-dharma/pembelajaran/jurusan", element: <PilihJurusan /> },
          { path: "/tri-dharma/pembelajaran/:jurusanId", element: <PembelajaranJurusan /> },
          { path: "/tri-dharma/pembelajaran/:jurusanId/:id", element: <MataKuliahDetail /> },

          { path: "/tri-dharma/penelitian/jurusan", element: <PilihJurusanPenelitian /> },
          { path: "/tri-dharma/penelitian/:jurusanId", element: <PenelitianJurusan /> },
          { path: "/tri-dharma/penelitian/:jurusanId/:id", element: <PenelitianDetail /> },
        ]
      },
      {
        element: <RoleGuard allowedRoles={["dekan", "kaprodi", "prodi", "tata-usaha", "dosen"]} />,
        children: [


          
          // { path: "/tri-dharma/pkm", element: <PKM/>},
          // { path: "/tri-dharma/penunjang", element: <Penunjang/>},
        ],
      },
      { path: "/data-dosen", element: <DataDosen /> },
      { path: "/data-dosen/:id", element: <DetailDosen /> },

      { path: "/data-dosen/:dosenId/pembelajaran", element: <Pembelajaran /> },
      { path: "/data-dosen/:dosenId/pembelajaran/:id", element: <MataKuliahDetail /> },

      { path: "/data-dosen/:dosenId/penelitian", element: <Penelitian /> },
      { path: "/data-dosen/:dosenId/penelitian/:id", element: <PenelitianDetail /> },
      // add role guard
    ],
  },

  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);