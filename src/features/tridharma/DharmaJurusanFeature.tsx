import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb";
import DashboardLayout from "../../layouts/DashboardLayout";
import SemesterSelector from "../../components/ui/SemesterSelector";
import { useAuthStore } from "../../stores/auth.store";
import { jurusanData, semesters } from "../../mock/db";
import type { DharmaType } from "../../mock/db";
import { useFetchData } from "../../hooks/useFetchData";
import { getDharmaByJurusan } from "../../mock/authService";
import { StateDisplay } from "../../components/ui/StateDisplay";

const CONFIG = {
  penelitian: {
    label: "Penelitian",
    desc: "Lihat daftar penelitian",
    searchPlaceholder: "Cari penelitian...",
    emptyMsg: "Belum ada penelitian",
  },
  pkm: {
    label: "PKM",
    desc: "Lihat daftar PKM",
    searchPlaceholder: "Cari PKM...",
    emptyMsg: "Belum ada PKM",
  },
  penunjang: {
    label: "Penunjang",
    desc: "Lihat daftar penunjang",
    searchPlaceholder: "Cari penunjang...",
    emptyMsg: "Belum ada penunjang",
  },
};

const STATUS_COLOR: Record<string, string> = {
  accepted:            "bg-green-100 text-green-700 border-green-300",
  rejected:            "bg-red-100 text-red-700 border-red-300",
  pending:             "bg-yellow-100 text-yellow-700 border-yellow-300",
  none:                "bg-gray-100 text-gray-700 border-gray-300",
  pending_kaprodi:     "bg-blue-100 text-blue-700 border-blue-300",
  revision_kaprodi:    "bg-orange-100 text-orange-700 border-orange-300",
  pending_lppm:        "bg-indigo-100 text-indigo-700 border-indigo-300",
  pending_surat_tugas: "bg-purple-100 text-purple-700 border-purple-300",
  ongoing:             "bg-cyan-100 text-cyan-700 border-cyan-300",
};

const STATUS_LABEL: Record<string, string> = {
  accepted:            "Disetujui",
  rejected:            "Ditolak",
  pending:             "Menunggu",
  none:                "Belum Ada Proposal",
  pending_kaprodi:     "Menunggu Kaprodi",
  revision_kaprodi:    "Revisi Kaprodi",
  pending_lppm:        "Menunggu LPPM",
  pending_surat_tugas: "Menunggu Surat Tugas",
  ongoing:             "Sedang Berjalan",
};

const PENUNJANG_STATUS_LABEL: Record<string, string> = {
  ...STATUS_LABEL,
  none:                "Belum Ada Flyer",
  ongoing:             "Menunggu Sertifikat",
  accepted:            "Selesai",
};

export default function DharmaJurusanFeature({ type }: { type: DharmaType }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cfg = CONFIG[type];

  const [search, setSearch] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(semesters[0]?.id ?? "s1");
  const { jurusanId } = useParams();
  const jurusanIdNum = Number(jurusanId);
  const jurusan = jurusanData.find((j) => j.id === jurusanIdNum);

  const { data, loading, error } = useFetchData({
    fetchFn: () => getDharmaByJurusan(type, jurusanIdNum, selectedSemesterId, search),
    dependencies: [type, jurusanIdNum, selectedSemesterId, search],
  });

  const getStatusLabelText = (status: string) => {
    const labels = type === "penunjang" ? PENUNJANG_STATUS_LABEL : STATUS_LABEL;
    return labels[status] || status;
  };

  return (
    <DashboardLayout>
      <Breadcrumb
        items={[
          { label: cfg.label },
          { label: "Jurusan", onClick: () => navigate(`/tri-dharma/${type}/jurusan`) },
          { label: "Semester", isActive: true },
        ]}
      />
      <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6 mb-8">
        <div>
          <h1 className="text-2xl pb-2 text-white font-semibold">{cfg.label}</h1>
          <p className="text-light-blue font-medium text-[15px]">{cfg.desc}</p>
          <SemesterSelector value={selectedSemesterId} onChange={setSelectedSemesterId} className="mt-5" />
        </div>
      </div>

      <h2 className="font-semibold text-xl text-primary-text mb-3">
        Daftar {cfg.label} {jurusan ? `- ${jurusan.nama}` : ""}
      </h2>
      <div className="flex flex-col md:flex-row gap-3 items-center mb-3">
        <input
          type="text"
          placeholder={cfg.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border bg-white border-gray-300 rounded px-4 h-11 w-full focus:outline-none focus:border-primary-gold"
        />
      </div>

      <div className="flex gap-2 flex-col">
        {loading ? (
          <StateDisplay type="loading" />
        ) : error ? (
          <StateDisplay type="error" message="Error" />
        ) : !data || data.items.length === 0 ? (
          <StateDisplay type="empty" message={cfg.emptyMsg} />
        ) : (
          data.items.map((p: any) => (
            <div
              key={p.id}
              onClick={() => navigate(`/tri-dharma/${type}/${jurusanId}/${p.id}`)}
              className="bg-white rounded-2xl border border-card-cream hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex justify-between items-center px-6 py-4">
                <div>
                  <p className="font-semibold text-primary-text">{p.judul}</p>
                  <p className="text-sm text-gray-500">{p.sks} SKS</p>
                </div>
                <p className={`text-sm border rounded-full px-3 py-1 ${STATUS_COLOR[p.status] || "bg-gray-100 text-gray-700"}`}>
                  {getStatusLabelText(p.status)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
