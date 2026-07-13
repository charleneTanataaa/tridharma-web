import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { FaFileDownload, FaPaperclip, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../../stores/auth.store";
import { semesters } from "../../mock/db";
import type { StatusPenelitian } from "../../mock/db";
import { getPenelitian, getMyPenelitian } from "../../mock/authService";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useFetchData } from "../../hooks/useFetchData";
import { StateDisplay } from "../../components/ui/StateDisplay";

const STATUS_BADGE: Record<StatusPenelitian, { label: string; className: string }> = {
  accepted: { label: "ACCEPTED", className: "bg-green-100 text-green-700" },
  rejected: { label: "REJECTED", className: "bg-red-100 text-red-700" },
  pending: { label: "PENDING", className: "bg-amber-100 text-amber-700" },
  none: { label: "BELUM ADA PROPOSAL", className: "bg-gray-100 text-gray-500" },
  pending_kaprodi: { label: "MENUNGGU KAPRODI", className: "bg-blue-100 text-blue-700" },
  revision_kaprodi: { label: "REVISI KAPRODI", className: "bg-amber-100 text-amber-700" },
  pending_lppm: { label: "MENUNGGU LPPM", className: "bg-blue-100 text-blue-700" },
  pending_surat_tugas: { label: "MENUNGGU SURAT TUGAS", className: "bg-purple-100 text-purple-700" },
  ongoing: { label: "BERJALAN", className: "bg-green-100 text-green-700" },
};


function StatusBadge({ status }: { status: StatusPenelitian }) {
  const badge = STATUS_BADGE[status];
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.className}`}>
      {badge.label}
    </span>
  );
}

function UploadProposalModal({ onClose }: { onClose: () => void }) {
  const [namaJudul, setNamaJudul] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!namaJudul.trim() || !file) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    onClose();
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-card-cream rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-dark-navy">Upload Proposal</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="judul" className="block text-sm font-medium text-primary-gold mb-1.5">
            Judul Penelitian
          </label>
          <input type="text" value={namaJudul} onChange={(e) => setNamaJudul(e.target.value)} placeholder="Judul penelitian" className="w-full border border-dark-navy rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-dark-navy" />
        </div>

        <div className="mb-6 flex justify-between items-center">
          <label htmlFor="file-proposal" className="block text-sm font-medium text-primary-gold mb-1.5">File Proposal</label>
          <div className="">
            <input type="file" name="file-proposal" ref={fileInputRef} accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button onClick={() => fileInputRef.current?.click()} className="bg-primary-gold px-3 py-2 rounded-md transition text-sm text-dark-navy hover:bg-dark-navy hover:text-white transition flex flex-col items-center gap-2">
              {file ? (
                <span className="flex items-center gap-2 text-dark-navy font-medium">
                  <FaPaperclip size={13} className="shrink-0" />
                  <p className="overflow-hidden truncate max-w-[130px]">{file.name}</p>
                </span>
              ) : (
                <>
                  <button className="flex gap-2">
                    <FaFileDownload size={20} />
                    <span>Upload File</span>
                  </button>
                </>
              )}
            </button>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!namaJudul.trim() || !file || loading}
          className="w-full bg-primary-gold text-dark-navy rounded-xl py-2.5 text-sm font-medium disabled:opacity-50 transition"
        >
          {loading ? "Mengunggah..." : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default function Penelitian() {
  const navigate = useNavigate();
  const { dosenId } = useParams<{ dosenId?: string }>();
  const user = useAuthStore((state) => state.user);
  const isTataUsaha = user?.jabatan === "tata-usaha";
  const isDosen = user?.jabatan === "dosen";

  const activeSemester = semesters.find((s) => s.active);
  const [selectedSemesterId, setSelectedSemesterId] = useState(activeSemester?.id ?? semesters[0].id);
  const [showModal, setShowModal] = useState(false);
  const { data, loading, error } = useFetchData({
    // Dosen lihat penelitian sendiri; data-dosen view lihat milik dosen tsb; admin lihat semua
    fetchFn: () => (isDosen || dosenId)
      ? getMyPenelitian(selectedSemesterId, dosenId ?? user?.id ?? "", "")
      : getPenelitian(selectedSemesterId),
    dependencies: [selectedSemesterId, dosenId],
  });

  if (!user) return null;

  return (
    <DashboardLayout>
      {showModal && <UploadProposalModal onClose={() => setShowModal(false)} />}
      {/* bagian atas - nav links */}
      <Breadcrumb items={[{ label: "Penelitian", isActive: true }, { label: "Semester" }]} />

      {/* header - section name, description, semester selection, upload proposal */}
      <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6">
        {/* section name, description, semester selection */}
        <div>
          <h1 className="text-2xl pb-2 text-white font-semibold">Penelitian</h1>
          <p className="text-light-blue font-medium text-[15px]">Kelola Penelitian</p>
          <select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="border bg-medium-navy rounded-xl border-light-blue w-full lg:w-110 h-10 mt-5 text-white focus:outline-none"
          >
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* upload proposal button - hanya dosen yang bisa upload proposal baru */}
        {isDosen && (
          <div className="">
            <button
              onClick={() => setShowModal(true)}
              className="flex font-medium text-dark-navy bg-primary-gold w-full mt-5 lg:mt-0 rounded-lg px-4 py-3 items-center">
              <FaFileDownload size={20} />
              Upload Proposal
            </button>
          </div>
        )}
      </div>

      {/* daftar penelitian of selected semester */}
      <div className="py-8">
        {/* header */}
        <h2 className="font-semibold text-[25px] mb-3">Daftar Penelitian</h2>

        {/* error loading empty */}
        {loading && <StateDisplay type="loading" />}
        {error && <StateDisplay type="error" message={error} />}
        {!loading && !error && data &&
          (data.penelitian.length === 0 ? (
            <StateDisplay type="empty" message="Tidak ada penelitian pada semester ini" />
          ) : (
            // loop through penelitian of selected semester
            <div className="bg-white rounded-lg lg:rounded-2xl border border-[#DAD4C7] divide-y divide-[#DAD4C7]">
              {data.penelitian.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(dosenId
                    ? `/data-dosen/${dosenId}/penelitian/${p.id}`
                    : `/tri-dharma/penelitian/detail/${p.id}`)}
                  className="flex items-center justify-between px-8 py-5 transition cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-sm lg:text-md">{p.judul}</p>
                    <p className="text-primary-gold text-sm mt-1 lg:text-md">
                      {p.kode} - {p.sks} SKS
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          ))}
      </div>
    </DashboardLayout>
  );
}