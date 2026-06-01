import { MdNotifications, MdPerson } from "react-icons/md";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNotifikasiAPI } from "../../mock/authService";

export default function Navbar(){
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if(!user) return;
        getNotifikasiAPI().then((data) => {
            setUnreadCount(data.filter((n) => !n.dibaca).length);
        });
    }, [user]);

    return(
        <nav className="bg-dark-navy h-18 shrink-0 p-4 flex flex-row gap-3 justify-end">
            <button 
            onClick={() => navigate("/notifikasi")}
            className="text-light-blue hover:text-white transition relative">
                <MdNotifications size={24}/>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            <button 
            onClick={() => navigate("/profile")}
            className="w-10 h-10 overflow-hidden bg-gray-300 flex items-center justify-center rounded-full">
                {user?.foto ? (
                    <img src={user.foto} alt="foto profil" className="w-full h-full object-cover"/>
                ): (
                    <MdPerson size={22} className="text-gray-600" />
                )} 
            </button>
        </nav>
    )
}