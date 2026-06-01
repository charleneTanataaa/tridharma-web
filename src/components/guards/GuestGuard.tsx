import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function GuesGuard(){
    const user = useAuthStore((state) => state.user);
    if(user) return <Navigate to="/dashboard" replace />
    return <Outlet/>
}