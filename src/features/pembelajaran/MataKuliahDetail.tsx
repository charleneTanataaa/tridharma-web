import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { mockMataKuliahDetail, MataKuliahDetail } from "../../mock/data";
import { MdKeyboardArrowRight } from "react-icons/md";
import MataKuliahHeader from "../../components/ui/MataKuliahHeader";
import { ADMIN_ITEMS } from "../../types/mataKuliah";
import AdminCard from "../../components/ui/AdminCard";
import { useAuthStore } from "../../stores/auth.store";

export default function MataKuliahDetail() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  if(!user) return null;
  const navigate = useNavigate();
  const data = mockMataKuliahDetail[id || "1"];

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-col gap-3 h-full">
            Data tidak ditemukan
            <button className="bg-dark-navy text-white font-medium px-5 py-3 hover:scale-101 transition rounded-lg" onClick={() => navigate(-1)}>Balik ke pembelajaran</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="flex gap-2 items-center pb-3">
            <span className="text-primary-gold">Pembelajaran</span><span><MdKeyboardArrowRight/></span><span onClick={() => navigate(-1)} className="hover:underline transition">Semester</span><span><MdKeyboardArrowRight/></span><span className="hover:underline transition">{data.nama}</span>
        </div>
        <div className="space-y-6">
            <MataKuliahHeader data={data}/>            

            {/* Administrasi */}
            <div>
                <h2 className=" text-3xl font-bold text-dark-navy mb-5 " >
                    Kelengkapan Administrasi
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {ADMIN_ITEMS.map((item) => (
                        <AdminCard
                            key={item.field}
                            item={item}
                            jabatan={user.jabatan}
                            value={data[item.field]}
                            onFileSelect={(file) => { console.log('File selected:', file.name)}}
                        />
                    ))}
                </div>
            </div>
        </div>
    </DashboardLayout>
  );
}