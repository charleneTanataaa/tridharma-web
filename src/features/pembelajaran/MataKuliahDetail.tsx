import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { mockMataKuliahDetail, MataKuliahDetail as MataKuliahDetailType } from "../../mock/db";
import MataKuliahHeader from "../../components/ui/pembelajaran/MataKuliahHeader";
import { ADMIN_ITEMS } from "../../types/mataKuliah";
import AdminCard from "../../components/ui/AdminCard";
import { useAuthStore } from "../../stores/auth.store";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { uploadHasilMataKuliahAPI } from "../../mock/authService";

export default function MataKuliahDetailPage() {
  const { id, jurusanId, dosenId } = useParams();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [data, setData] = useState<MataKuliahDetailType | undefined>(
    mockMataKuliahDetail[id || "1"]
  );

  if (!user) return null;


  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center flex-col gap-3 h-full">
          Data tidak ditemukan
          <button className="bg-dark-navy text-white font-medium px-5 py-3 hover:scale-101 transition rounded-lg" onClick={() => navigate(-1)}>
            Balik ke pembelajaran
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleLinkSubmit = async (field: keyof Pick<MataKuliahDetailType, "soal_uas" | "soal_uts" | "absensi" | "nilai" | "rps" | "berita_acara" | "epp_uas" | "epp_uts">, link: string) => {
    await uploadHasilMataKuliahAPI(data.id.toString(), field, link);
    setData((prev) => (prev ? { ...prev, [field]: link } : prev));
  };

  const breadcrumbItems = jurusanId
    ? [
      { label: "Pembelajaran", },
      { label: "Jurusan", onClick: () => navigate(`/tri-dharma/pembelajaran/jurusan`), },
      { label: "Mata Kuliah", onClick: () => navigate(`/tri-dharma/pembelajaran/${jurusanId}`), },
      { label: data.nama, isActive: true },
    ] : dosenId
      ? [
        { label: "Data Dosen", onClick: () => navigate(`/data-dosen/${dosenId}`) },
        { label: "Pembelajaran", onClick: () => navigate(`/data-dosen/${dosenId}/pembelajaran`) },
        { label: data.nama, isActive: true },
      ] : [
        { label: "Pembelajaran", onClick: () => navigate("/tri-dharma/pembelajaran"), },
        { label: data.nama, isActive: true },
      ];
  return (
    <DashboardLayout>
      {/* top navigation */}
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-6">
        {/* header - mata kuliah detail */}
        <MataKuliahHeader data={data} />

        {/* Administrasi */}
        <div>
          <h2 className="text-xl lg:text-3xl font-bold text-dark-navy mb-5">Kelengkapan Administrasi</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {ADMIN_ITEMS.map((item) => (
              <AdminCard
                key={item.field}
                item={item}
                jabatan={user.jabatan ? user.jabatan : "null"}
                value={data[item.field]}
                onLinkSubmit={(link) => handleLinkSubmit(item.field, link)}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}