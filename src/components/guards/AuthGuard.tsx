import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function AuthGuard(){
    const user = useAuthStore((state) => state.user);
    if(!user) return <Navigate to="/login" replace />
    return <Outlet />;
}

