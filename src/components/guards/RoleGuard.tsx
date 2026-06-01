import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Role } from "../../types/auth";

type Props = {
    allowedRoles: Role[];
};

export default function RoleGuard({ allowedRoles }: Props){
    const user = useAuthStore((state) => state.user);
    if(!user) return <Navigate to="/login" replace />
    if(!allowedRoles.includes(user.jabatan)) return <Navigate to="/dashboard" replace/>

    return <Outlet/>;
}