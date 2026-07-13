import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth.store";
import { useEffect, useState } from "react";
import { Notifikasi } from "../../mock/db";
import { getNotifikasiAPI, readNotifikasiAPI } from "../../mock/authService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { MdCircle, MdNotifications } from "react-icons/md";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { IoIosArrowBack } from "react-icons/io";

export default function NotifikasiPage(){
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!user) { navigate("/login", { replace: true }); return; }
        getNotifikasiAPI().then(setNotifikasi).catch(() => setError("Gagal memuat notifikasi. Silahkan coba lagi")).finally(() => setLoading(false));
    }, [user]);

    if(!user) return null;

    const handleRead = async (item: Notifikasi) => {
        if(!item.dibaca) {
            await readNotifikasiAPI(item.id);
            setNotifikasi((prev)=> prev.map((n) => (n.id === item.id ? { ...n, dibaca: true } : n)));
        }
        navigate(item.halamanWeb);
    };

    const renderContent = () => {
        if (loading) return <StateDisplay type="loading" message="Memuat notifikasi..." />
        if (error) return <StateDisplay type="error" message={error} />
        if(notifikasi.length === 0) return(
            <StateDisplay type="empty" icon={<MdNotifications size={32}/>} message="Tidak ada notifikasi."/>
        );

        return(
            <>
            {notifikasi.map((item) => (
                <div key={item.id} onClick={() => handleRead(item)} className={`p-4 lg:p-6 bg-white rounded-lg flex items-center flex-row gap-2`}>
                    <MdCircle size={20} className={` ${item.dibaca ?  "text-light-blue":  "text-dark-navy" } mr-3`} />
                    <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-center">
                    <p className="text-dark-navy text-md lg:text-lg">{item.pesan}</p>
                    <p className="text-muted-text text-sm lg:text-[18px]">{new Date(item.tgl_buat).toLocaleString()}</p>
                    </div>
                </div>
            ))}
            </>
        )
    }
    
    return(
        <DashboardLayout>
            <div className="flex items-center gap-2 mb-6">
                <IoIosArrowBack size={24} className="text-dark-navy" onClick={() => navigate(-1)}/>
                <h1 className="text-lg lg:text-2xl font-semibold">Notifikasi</h1>
            </div>
            <div className="flex flex-col gap-3">
                {renderContent()}
            </div>

        </DashboardLayout>
    )
}