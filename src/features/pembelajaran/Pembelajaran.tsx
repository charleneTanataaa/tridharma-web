import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout"
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
import { useAuthStore } from "../../stores/auth.store"
import { semesters, PembelajaranResponse } from "../../mock/data";
import { getPembelajaran } from "../../mock/authService";

export default function Pembelajaran(){
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const isTataUsaha = user?.jabatan === "tata-usaha";

    const activeSemester = semesters.find((s) => s.active);
    const [selectedSemesterId, setSelectedSemesterId] = useState(activeSemester?.id ?? semesters[0].id);

    const [data, setData] = useState<PembelajaranResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {   
        if(!selectedSemesterId) return;
        const fetchPembelajaran = async () => {
            try{
                setLoading(true);
                setError(null);
                const result = await getPembelajaran(selectedSemesterId);
                setData(result);
            } catch (err: any) {
                setError(err.message || "Gagal memuat data pembelajaran.");
            } finally {
                setLoading(false);
            }
        }
        fetchPembelajaran();
    }, [selectedSemesterId]);

    if(!user) return null;

    return(
        <DashboardLayout>
        <div className="flex gap-2 items-center pb-3">
            <span className="text-primary-gold">Pembelajaran</span><span><MdKeyboardArrowRight/></span><span>Semester</span>
        </div>
        <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6">
            <div>
                <h1 className='text-[22px] lg:text-[30px] pb-2 text-white font-semibold'>Pembelajaran</h1>
                <p className="text-light-blue font-medium text-[15px] lg:text-[20px]">Kelola daftar mata kuliah dan administrasi</p>
                <select value={selectedSemesterId} onChange={(e) => setSelectedSemesterId(e.target.value)}  
                className="border bg-medium-navy rounded-xl border-light-blue w-full lg:w-110 h-10 mt-5 text-white focus:outline-none">
                    { semesters.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                </select>
            </div>
            <div>
                {isTataUsaha ? (
                    <button className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full mt-5 lg:mt-0 rounded-lg px-4 py-3 items-center">
                        <FaFileDownload size={20} />
                        {data?.surat_tugas
                        ? "Unggah Ulang Surat Tugas"
                        : "Unggah Surat Tugas"}
                    </button>
                    ) : (
                    data?.surat_tugas ? (
                        <button className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full mt-5 lg:mt-0 rounded-lg px-4 py-3 items-center">
                        <FaFileDownload size={20} />
                        Unduh Surat Tugas
                        </button>
                    ) : (
                        <div className="flex font-medium text-dark-navy gap-2 bg-muted-text w-full mt-5 lg:mt-0 rounded-lg px-4 py-3 items-center"><FaFileDownload size={20} />Belum ada surat tugas</div>
                    )
                    )}
            </div>
        </div>
        <div className="py-8">
            <h2 className="font-semibold text-[25px] mb-3">Daftar Administrasi</h2>
            {loading && (
                <div className="text-center py-12 text-gray-400">Memuat data...</div>
            )}
            {error && (
                <div className="text-center py-12 text-red-400">{error}</div>
            )}
            {!loading && !error && data && (
                data.matakuliah.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#DAD4C7] px-8 py-12 text-center text-gray-400">
                        Tidak ada mata kuliah pada semester ini.
                    </div>
                
            ) : (
                <div className="bg-white rounded-2xl border border-[#DAD4C7] divide-y divide-[#DAD4C7]">
                    {data.matakuliah.map((mk) => (
                        <div 
                        key={mk.id}
                        onClick={() => navigate(`/tri-dharma/pembelajaran/${mk.id}`)}
                        className="flex items-center justify-between px-8 py-5 hoveR:bg-gray-50 transition cursor-pointer">
                            <div>
                                <p className="font-semibold text-[18px]">{mk.nama}</p>
                                <p className="text-primary-gold text-sm mt-1">{mk.kelas}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>

        </DashboardLayout>
    )
}