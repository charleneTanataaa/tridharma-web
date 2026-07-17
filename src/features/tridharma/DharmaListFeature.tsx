import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFileDownload, FaPaperclip, FaTimes } from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuthStore } from "../../stores/auth.store";
import { semesters } from "../../mock/db";
import type { DharmaType } from "../../mock/db";
import { getDharmaList, getMyDharmaList } from "../../mock/authService";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useFetchData } from "../../hooks/useFetchData";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { toast } from "sonner";

// Mapping for layout specifics per DharmaType
const CONFIG = {
  penelitian: {
    label: "Penelitian",
    subtitle: "Kelola Penelitian",
    emptyMsg: "Tidak ada penelitian pada semester ini",
    uploadBtn: "Upload Proposal",
    uploadTitle: "Upload Proposal",
    uploadInputLabel: "Judul Penelitian",
    uploadPlaceholder: "Judul penelitian",
    uploadFileLabel: "File Proposal",
  },
  pkm: {
    label: "PKM",
    subtitle: "Kelola PKM",
    emptyMsg: "Tidak ada PKM pada semester ini",
    uploadBtn: "Upload Proposal",
    uploadTitle: "Upload Proposal",
    uploadInputLabel: "Judul PKM",
    uploadPlaceholder: "Judul PKM",
    uploadFileLabel: "File Proposal",
  },
  penunjang: {
    label: "Penunjang",
    subtitle: "Kelola Penunjang",
    emptyMsg: "Tidak ada kegiatan penunjang pada semester ini",
    uploadBtn: "Upload Flyer",
    uploadTitle: "Upload Flyer",
    uploadInputLabel: "Judul Kegiatan",
    uploadPlaceholder: "Judul kegiatan penunjang",
    uploadFileLabel: "File Flyer",
  },
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  accepted:            { label: "ACCEPTED",             className: "bg-green-100 text-green-700" },
  rejected:            { label: "REJECTED",             className: "bg-red-100 text-red-700" },
  pending:             { label: "PENDING",              className: "bg-amber-100 text-amber-700" },
  none:                { label: "BELUM ADA PROPOSAL",   className: "bg-gray-100 text-gray-500" },
  pending_kaprodi:     { label: "MENUNGGU KAPRODI",     className: "bg-blue-100 text-blue-700" },
  revision_kaprodi:    { label: "REVISI KAPRODI",       className: "bg-amber-100 text-amber-700" },
  pending_lppm:        { label: "MENUNGGU LPPM",        className: "bg-blue-100 text-blue-700" },
  pending_surat_tugas: { label: "MENUNGGU SURAT TUGAS", className: "bg-purple-100 text-purple-700" },
  ongoing:             { label: "BERJALAN",             className: "bg-green-100 text-green-700" },
};

// Penunjang specific badges (mapping status to more appropriate labels)
const PENUNJANG_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  ...STATUS_BADGE,
  none:                { label: "BELUM ADA FLYER",      className: "bg-gray-100 text-gray-500" },
  ongoing:             { label: "MENUNGGU SERTIFIKAT",  className: "bg-cyan-100 text-cyan-700" },
  accepted:            { label: "SELESAI",              className: "bg-green-100 text-green-700" },
};

function StatusBadge({ type, status }: { type: DharmaType; status: string }) {
  const badgeMap = type === "penunjang" ? PENUNJANG_STATUS_BADGE : STATUS_BADGE;
  const badge = badgeMap[status] || { label: status.toUpperCase(), className: "bg-gray-100 text-gray-700" };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.className}`}>
      {badge.label}
    </span>
  );
}

interface UploadModalProps {
  type: DharmaType;
  onClose: () => void;
  onSubmit: (judul: string, file: File) => Promise<void>;
}

function UploadModal({ type, onClose, onSubmit }: UploadModalProps) {
  const cfg = CONFIG[type];
  const [namaJudul, setNamaJudul] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!namaJudul.trim() || !file) return;
    setLoading(true);
    try {
      await onSubmit(namaJudul, file);
      onClose();
    } catch {
      toast.error("Gagal mengunggah file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-card-cream rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-dark-navy">{cfg.uploadTitle}</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary-gold mb-1.5">
            {cfg.uploadInputLabel}
          </label>
          <input
            type="text"
            value={namaJudul}
            onChange={(e) => setNamaJudul(e.target.value)}
            placeholder={cfg.uploadPlaceholder}
            className="w-full border border-dark-navy rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-dark-navy"
          />
        </div>

        <div className="mb-6 flex justify-between items-center">
          <label className="block text-sm font-medium text-primary-gold mb-1.5">{cfg.uploadFileLabel}</label>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary-gold px-3 py-2 rounded-md transition text-sm text-dark-navy hover:bg-dark-navy hover:text-white flex items-center gap-2"
            >
              {file ? (
                <span className="flex items-center gap-2 text-dark-navy font-medium">
                  <FaPaperclip size={13} className="shrink-0" />
                  <span className="overflow-hidden truncate max-w-[130px]">{file.name}</span>
                </span>
              ) : (
                <span className="flex gap-2">
                  <FaFileDownload size={20} />
                  <span>Upload File</span>
                </span>
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
  );
}

export default function DharmaListFeature({ type }: { type: DharmaType }) {
  const navigate = useNavigate();
  const { dosenId } = useParams<{ dosenId?: string }>();
  const user = useAuthStore((state) => state.user);
  const isDosen = user?.jabatan === "dosen";
  const cfg = CONFIG[type];

  const activeSemester = semesters.find((s) => s.active);
  const [selectedSemesterId, setSelectedSemesterId] = useState(activeSemester?.id ?? semesters[0].id);
  const [showModal, setShowModal] = useState(false);

  const { data, loading, error } = useFetchData({
    fetchFn: () => (isDosen || dosenId)
      ? getMyDharmaList(type, selectedSemesterId, dosenId ?? user?.id ?? "", "")
      : getDharmaList(type, selectedSemesterId),
    dependencies: [type, selectedSemesterId, dosenId],
  });

  const handleUploadProposal = async (judul: string, file: File) => {
    toast.success(`${cfg.uploadTitle} ${judul} (${file.name}) berhasil diunggah`);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      {showModal && (
        <UploadModal
          type={type}
          onClose={() => setShowModal(false)}
          onSubmit={handleUploadProposal}
        />
      )}
      <Breadcrumb
        items={dosenId
          ? [
              { label: "Data Dosen", onClick: () => navigate(`/data-dosen/${dosenId}`) },
              { label: cfg.label, isActive: true },
            ]
          : [
              { label: cfg.label },
              { label: "Semester", isActive: true },
            ]}
      />

      <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6">
        <div>
          <h1 className="text-2xl pb-2 text-white font-semibold">{cfg.label}</h1>
          <p className="text-light-blue font-medium text-[15px]">{cfg.subtitle}</p>
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

        {isDosen && (
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="flex font-medium text-dark-navy bg-primary-gold w-full mt-5 lg:mt-0 rounded-lg px-4 py-3 items-center gap-2"
            >
              <FaFileDownload size={20} />
              {cfg.uploadBtn}
            </button>
          </div>
        )}
      </div>

      <div className="py-8">
        <h2 className="font-semibold text-[25px] mb-3">Daftar {cfg.label}</h2>

        {loading && <StateDisplay type="loading" />}
        {error && <StateDisplay type="error" message={error} />}
        {!loading && !error && data && (
          data.items.length === 0 ? (
            <StateDisplay type="empty" message={cfg.emptyMsg} />
          ) : (
            <div className="bg-white rounded-lg lg:rounded-2xl border border-[#DAD4C7] divide-y divide-[#DAD4C7]">
              {data.items.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => navigate(dosenId
                    ? `/data-dosen/${dosenId}/${type}/${item.id}`
                    : `/tri-dharma/${type}/detail/${item.id}`)}
                  className="flex items-center justify-between px-8 py-5 transition cursor-pointer hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-sm lg:text-md text-primary-text">{item.judul}</p>
                    <p className="text-primary-gold text-sm mt-1 lg:text-md">
                      {item.kode} - {item.sks} SKS
                    </p>
                  </div>
                  <StatusBadge type={type} status={item.status} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
