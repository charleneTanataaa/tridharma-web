import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout"
import { FaFileDownload, } from "react-icons/fa";
import { useAuthStore } from "../../stores/auth.store"
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useFetchData } from "../../hooks/useFetchData";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { semesters } from "../../mock/data";
import { getPembelajaran } from "../../mock/authService";

export default function Pembelajaran(){
    const navigate = useNavigate();
    const {dosenId} = useParams();
    const user = useAuthStore((state) => state.user);
    const isTataUsaha = user?.jabatan === "tata-usaha";
    const isProdi = user?.jabatan === "prodi";

    useEffect(() => {
        if(isTataUsaha) navigate("/tri-dharma/pembelajaran/jurusan", {replace: true});
    }, [isTataUsaha, navigate]);

    const activeSemester = semesters.find((s) => s.active);
    const [selectedSemesterId, setSelectedSemesterId] = useState(activeSemester?.id ?? semesters[0].id);
    const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
    const { data, loading, error } = useFetchData({ fetchFn: () => getPembelajaran(selectedSemesterId), dependencies: [selectedSemesterId]});
    if(!user) return null;
    if(isTataUsaha) return null;

    return(
        <DashboardLayout>
            {/* bagian atas - nav links */}
            <Breadcrumb items={[ {label: "Pembelajaran", isActive: true}, {label:"Semester"}]} />

            {/* header - section name, description, semester selection, surat tugas */}
            <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6">
                <div>
                    <h1 className='text-2xl pb-2 text-white font-semibold'>Pembelajaran</h1>
                    <p className="text-light-blue font-medium text-[15px]">Kelola daftar mata kuliah dan administrasi</p>
                    <select value={selectedSemesterId} onChange={(e) => setSelectedSemesterId(e.target.value)}  
                    className="border bg-medium-navy rounded-xl border-light-blue w-full lg:w-110 h-10 mt-5 text-white focus:outline-none">
                        { semesters.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-row md:flex-col items-center gap-4 mt-5 lg:mt-0 text-sm lg:text-md">
                    { isProdi && (
                        <button className="bg-primary-gold rounded-lg px-4 py-3">Tambah Jadwal</button>
                    )}
                    { data?.surat_tugas ? (
                        <button className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full rounded-lg px-4 py-3 items-center">
                        <FaFileDownload size={20}/>Unduh Surat Tugas
                        </button>
                    ) : (
                        <div className="flex font-medium text-dark-navy gap-2 bg-muted-text w-full rounded-lg px-4 py-3 items-center">
                            <FaFileDownload size={20}/> Belum ada surat Tugas
                        </div>
                    )}
                    
                </div>
            </div> 
            {/* mata kuliah of selected semester - default is most recent */}
            <div className="py-8">
                <h2 className="font-semibold text-[25px] mb-3">Daftar Mata Kuliah</h2>
                {loading && <StateDisplay type="loading"/>}
                {error && <StateDisplay type="error" message={error}/>}
                {!loading && !error && data && (data.matakuliah.length === 0 ? ( <StateDisplay type="empty" message="Tidak ada mata kuliah pada semester ini"/>) 
                    : (
                    <div className="bg-white rounded-lg lg:rounded-2xl border border-[#DAD4C7] divide-y divide-[#DAD4C7]">
                        {data.matakuliah.map((mk) => (
                            <div key={mk.id} onClick={() => navigate(`/tri-dharma/pembelajaran/${mk.id}`)} className="flex items-center justify-between px-8 py-5 hover:bg-gray-50 transition cursor-pointer">
                                <div>
                                    <p className="font-semibold text-sm lg:text-md">{mk.nama}</p>
                                    <p className="text-primary-gold text-sm mt-1 text-sm lg:text-md">{mk.kelas}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
        </DashboardLayout>
    )
}