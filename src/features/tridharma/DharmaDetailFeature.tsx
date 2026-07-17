import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFileDownload, FaPaperclip, FaUpload } from "react-icons/fa";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useFetchData } from "../../hooks/useFetchData";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { useAuthStore } from "../../stores/auth.store";
import {
  getDharmaDetail,
  uploadDharmaDocumentAPI,
  uploadProposalDharmaAPI,
  approveKaprodiDharmaAPI,
  rejectKaprodiDharmaAPI,
  approveLPPMDharmaAPI,
  rejectLPPMDharmaAPI,
  uploadSuratTugasDharmaAPI,
} from "../../mock/authService";
import type { DharmaType, PenelitianDetail } from "../../mock/db";

type DokumenField = "proposal" | "laporan_akhir" | "loa" | "hasil_review_sederajat";

const DOKUMEN_CONFIG_MAP: Record<DharmaType, { field: DokumenField; label: string; deskripsi: string }[]> = {
  penelitian: [
    { field: "proposal", label: "Proposal Penelitian", deskripsi: "Dokumen usulan lengkap" },
    { field: "laporan_akhir", label: "Laporan Akhir", deskripsi: "Laporan hasil penelitian" },
    { field: "loa", label: "Letter of Acceptance", deskripsi: "Bukti penerimaan publikasi jurnal" },
    { field: "hasil_review_sederajat", label: "Hasil Review Sederajat", deskripsi: "Hasil review dari reviewer" },
  ],
  pkm: [
    { field: "proposal", label: "Proposal PKM", deskripsi: "Dokumen usulan lengkap PKM" },
    { field: "laporan_akhir", label: "Laporan Akhir PKM", deskripsi: "Laporan hasil pengabdian masyarakat" },
    { field: "loa", label: "Letter of Acceptance", deskripsi: "Bukti penerimaan publikasi" },
    { field: "hasil_review_sederajat", label: "Hasil Review Sederajat", deskripsi: "Hasil review dari reviewer" },
  ],
  penunjang: [
    { field: "proposal", label: "Flyer Kegiatan", deskripsi: "Flyer/poster bukti keikutsertaan awal" },
    { field: "laporan_akhir", label: "Sertifikat", deskripsi: "Sertifikat atau piagam penghargaan" },
  ],
};

const STATUS_PILL: Record<string, { label: string; className: string }> = {
  accepted:            { label: "ACCEPTED",             className: "bg-green-100 text-green-700" },
  rejected:            { label: "REJECTED",             className: "bg-red-100 text-red-700" },
  pending:             { label: "PENDING REVIEW",       className: "bg-amber-100 text-amber-700" },
  none:                { label: "BELUM ADA PROPOSAL",   className: "bg-gray-100 text-gray-500" },
  pending_kaprodi:     { label: "MENUNGGU KAPRODI",     className: "bg-blue-100 text-blue-700" },
  revision_kaprodi:    { label: "REVISI KAPRODI",       className: "bg-amber-100 text-amber-700" },
  pending_lppm:        { label: "MENUNGGU LPPM",        className: "bg-blue-100 text-blue-700" },
  pending_surat_tugas: { label: "MENUNGGU SURAT TUGAS", className: "bg-purple-100 text-purple-700" },
  ongoing:             { label: "BERJALAN",             className: "bg-green-100 text-green-700" },
};

const PENUNJANG_STATUS_PILL: Record<string, { label: string; className: string }> = {
  ...STATUS_PILL,
  none:                { label: "BELUM ADA FLYER",      className: "bg-gray-100 text-gray-500" },
  ongoing:             { label: "MENUNGGU SERTIFIKAT",  className: "bg-cyan-100 text-cyan-700" },
  accepted:            { label: "SELESAI",              className: "bg-green-100 text-green-700" },
};

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function DokumenCard({ label, deskripsi, fileName, canUpload, onUpload }: {
  label: string;
  deskripsi: string;
  fileName: string | null;
  canUpload: boolean;
  onUpload: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isTerunggah = fileName !== null;
  return (
    <div className="bg-white border border-card-cream rounded-2xl">
      <div className="p-5 flex justify-between items-start">
        <div>
          <p className="font-semibold text-md text-dark-navy">{label}</p>
          <p className="text-muted-text text-xs lg:text-sm mt-1">{deskripsi}</p>
        </div>
        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${isTerunggah ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isTerunggah ? "TERUNGGAH" : "BELUM"}
        </span>
      </div>
      <div className="border-t border-card-cream px-5 py-4">
        {isTerunggah
          ? <div className="flex items-center gap-2 text-xs lg:text-sm text-dark-navy"><FaPaperclip size={12} /> {fileName}</div>
          : <p className="text-xs lg:text-sm text-muted-text">Belum diunggah.</p>}
        {canUpload && (
          <>
            <input type="file" accept=".pdf,.doc,.docx" hidden ref={fileRef}
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()}
              className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full mt-4 rounded-lg px-4 py-2.5 items-center justify-center text-sm">
              <FaFileDownload size={16} />
              {isTerunggah ? "Update" : "Unggah"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DharmaDetailFeature({ type }: { type: DharmaType }) {
  const navigate = useNavigate();
  const { id, jurusanId, dosenId } = useParams<{ id: string; jurusanId?: string; dosenId?: string }>();
  const user = useAuthStore((state) => state.user);

  const isKaprodi = user?.jabatan === "kaprodi";
  const isLPPM = user?.jabatan === "lppm";
  const isTataUsaha = user?.jabatan === "tata-usaha";
  const isDosen = user?.jabatan === "dosen";

  const [isActing, setIsActing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [revisionFile, setRevisionFile] = useState<File | null>(null);

  const fileRevisiRef = useRef<HTMLInputElement>(null);
  const fileSuratTugasRef = useRef<HTMLInputElement>(null);
  const fileProposalRef = useRef<HTMLInputElement>(null);

  const { data, loading, error, setData } = useFetchData<PenelitianDetail>({
    fetchFn: () => getDharmaDetail(type, id ?? ""),
    dependencies: [type, id],
  });

  if (!user) return null;

  const status = data?.status;
  const config = DOKUMEN_CONFIG_MAP[type];

  const handleUploadProposal = async (file: File) => {
    if (!data) return;
    setIsActing(true);
    try {
      await uploadProposalDharmaAPI(type, data.id.toString(), file.name);
      setData((prev) => prev ? { ...prev, proposal: file.name, status: "pending_kaprodi" } : prev);
      toast.success(type === "penunjang" ? "Flyer berhasil diupload" : "Proposal berhasil diupload");
    } catch {
      toast.error("Gagal mengunggah");
    } finally {
      setIsActing(false);
    }
  };

  const handleApproveKaprodi = async () => {
    if (!data) return;
    setIsActing(true);
    try {
      await approveKaprodiDharmaAPI(type, data.id.toString());
      const nextStatus = type === "penunjang" ? "pending_surat_tugas" : "pending_lppm";
      setData((prev) => prev ? { ...prev, status: nextStatus, kaprodi_rejection_reason: undefined, kaprodi_revision_file: undefined } : prev);
      toast.success("Disetujui Kaprodi");
    } catch {
      toast.error("Gagal menyetujui");
    } finally {
      setIsActing(false);
    }
  };

  const handleRejectKaprodi = async () => {
    if (!rejectReason.trim()) { toast.error("Masukkan alasan penolakan"); return; }
    if (!data) return;
    setIsActing(true);
    try {
      await rejectKaprodiDharmaAPI(type, data.id.toString(), rejectReason, revisionFile?.name);
      setData((prev) => prev ? { ...prev, status: "revision_kaprodi", kaprodi_rejection_reason: rejectReason, kaprodi_revision_file: revisionFile?.name ?? null } : prev);
      setShowRejectInput(false);
      setRejectReason("");
      setRevisionFile(null);
      toast.success("Penolakan berhasil dikirim");
    } catch {
      toast.error("Gagal menolak");
    } finally {
      setIsActing(false);
    }
  };

  const handleApproveLPPM = async () => {
    if (!data) return;
    setIsActing(true);
    try {
      await approveLPPMDharmaAPI(type, data.id.toString());
      setData((prev) => prev ? { ...prev, status: "pending_surat_tugas", didanai: true } : prev);
      toast.success("Disetujui LPPM (Didanai)");
    } catch {
      toast.error("Gagal memproses");
    } finally {
      setIsActing(false);
    }
  };

  const handleRejectLPPM = async () => {
    if (!rejectReason.trim()) { toast.error("Masukkan alasan"); return; }
    if (!data) return;
    setIsActing(true);
    try {
      await rejectLPPMDharmaAPI(type, data.id.toString(), rejectReason);
      setData((prev) => prev ? { ...prev, status: "pending_surat_tugas", didanai: false, lppm_rejection_reason: rejectReason } : prev);
      setShowRejectInput(false);
      setRejectReason("");
      toast.success("Konfirmasi tidak didanai terkirim");
    } catch {
      toast.error("Gagal memproses");
    } finally {
      setIsActing(false);
    }
  };

  const handleUploadSuratTugas = async (file: File) => {
    if (!data) return;
    setIsActing(true);
    try {
      await uploadSuratTugasDharmaAPI(type, data.id.toString(), file.name);
      setData((prev) => prev ? { ...prev, surat_tugas: file.name, status: "ongoing" } : prev);
      toast.success("Surat tugas berhasil diupload");
    } catch {
      toast.error("Gagal upload surat tugas");
    } finally {
      setIsActing(false);
    }
  };

  const handleUploadDokumen = async (field: DokumenField, file: File) => {
    if (!data) return;
    try {
      await uploadDharmaDocumentAPI(type, data.id.toString(), field, file.name);
      
      // For penunjang, once the certificate (laporan_akhir) is uploaded, it is complete / accepted
      let nextStatus = data.status;
      if (type === "penunjang" && field === "laporan_akhir") {
        nextStatus = "accepted";
      }

      setData((prev) => prev ? { ...prev, [field]: file.name, status: nextStatus } : prev);
      toast.success("Dokumen berhasil diupload");
    } catch {
      toast.error("Gagal upload dokumen");
    }
  };

  const renderActionWidget = () => {
    if (!data) return null;

    if (data.surat_tugas) {
      return (
        <a href={data.surat_tugas} target="_blank" rel="noreferrer"
          className="flex font-medium text-dark-navy gap-2 bg-primary-gold rounded-lg px-4 py-3 items-center justify-center text-sm whitespace-nowrap">
          <FaFileDownload size={16} /> Unduh Surat Tugas
        </a>
      );
    }

    if (isDosen && (status === "none" || status === "revision_kaprodi")) {
      return (
        <div className="flex flex-col gap-2 w-full">
          {status === "revision_kaprodi" && data.kaprodi_rejection_reason && (
            <div className="text-red-400 text-xs">
              <p>Ditolak: {data.kaprodi_rejection_reason}</p>
              {data.kaprodi_revision_file && (
                <a href={data.kaprodi_revision_file} target="_blank" rel="noreferrer"
                  className="underline mt-0.5 inline-flex items-center gap-1">
                  <FaPaperclip size={9} /> Unduh file revisi
                </a>
              )}
            </div>
          )}
          <input type="file" accept=".pdf,.doc,.docx" hidden ref={fileProposalRef}
            onChange={(e) => e.target.files?.[0] && handleUploadProposal(e.target.files[0])} />
          <button onClick={() => fileProposalRef.current?.click()} disabled={isActing}
            className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full rounded-lg px-4 py-3 items-center justify-center disabled:opacity-60 text-sm">
            <FaUpload size={14} />
            {status === "revision_kaprodi" 
              ? (type === "penunjang" ? "Upload Ulang Flyer" : "Upload Ulang Proposal")
              : (type === "penunjang" ? "Upload Flyer" : "Upload Proposal")}
          </button>
        </div>
      );
    }

    if (isKaprodi && status === "pending_kaprodi") {
      return (
        <div className="flex flex-col gap-2 w-full">
          {!showRejectInput ? (
            <div className="flex gap-2">
              <button onClick={handleApproveKaprodi} disabled={isActing}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-3 py-2 text-sm disabled:opacity-60">
                ✓ Setujui
              </button>
              <button onClick={() => setShowRejectInput(true)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-3 py-2 text-sm">
                ✕ Tolak
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Alasan penolakan..."
                className="w-full border border-light-blue bg-medium-navy text-white rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                rows={2} />
              <div className="flex items-center gap-2">
                <input type="file" accept=".pdf,.doc,.docx" hidden ref={fileRevisiRef}
                  onChange={(e) => setRevisionFile(e.target.files?.[0] ?? null)} />
                <button onClick={() => fileRevisiRef.current?.click()}
                  className="flex items-center gap-1 text-xs text-light-blue border border-light-blue rounded px-2 py-1.5 whitespace-nowrap">
                  <FaPaperclip size={10} />
                  {revisionFile ? revisionFile.name.slice(0, 12) + "…" : "File Revisi (opsional)"}
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={handleRejectKaprodi} disabled={isActing}
                  className="flex-1 bg-red-500 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60">
                  Kirim Penolakan
                </button>
                <button onClick={() => { setShowRejectInput(false); setRevisionFile(null); setRejectReason(""); }}
                  className="flex-1 bg-muted-text text-white rounded-lg px-3 py-2 text-sm">
                  Batal
                </button>
              </div>
            </div>
          )}
          {data.proposal && (
            <a href={data.proposal} target="_blank" rel="noreferrer"
              className="text-light-blue text-xs underline text-center">
              Lihat dokumen {type === "penunjang" ? "flyer" : "proposal"}
            </a>
          )}
        </div>
      );
    }

    if (isLPPM && status === "pending_lppm" && type !== "penunjang") {
      return (
        <div className="flex flex-col gap-2 w-full">
          {!showRejectInput ? (
            <div className="flex flex-col gap-2">
              <button onClick={handleApproveLPPM} disabled={isActing}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-3 py-2 text-sm disabled:opacity-60">
                ✓ Setujui (Didanai)
              </button>
              <button onClick={() => setShowRejectInput(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg px-3 py-2 text-sm">
                ✕ Tidak Didanai
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-amber-400 text-xs">⚠ Tetap lanjut tanpa pendanaan.</p>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Alasan tidak didanai..."
                className="w-full border border-light-blue bg-medium-navy text-white rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                rows={2} />
              <div className="flex gap-2">
                <button onClick={handleRejectLPPM} disabled={isActing}
                  className="flex-1 bg-orange-500 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60">
                  Konfirmasi
                </button>
                <button onClick={() => { setShowRejectInput(false); setRejectReason(""); }}
                  className="flex-1 bg-muted-text text-white rounded-lg px-3 py-2 text-sm">
                  Batal
                </button>
              </div>
            </div>
          )}
          {data.proposal && (
            <a href={data.proposal} target="_blank" rel="noreferrer"
              className="text-light-blue text-xs underline text-center">
              Lihat dokumen proposal
            </a>
          )}
        </div>
      );
    }

    if (isTataUsaha && status === "pending_surat_tugas") {
      return (
        <div className="flex flex-col gap-2 w-full">
          {data.didanai === false && (
            <p className="text-amber-400 text-xs">⚠ Tidak didanai LPPM — proses tetap lanjut</p>
          )}
          <input type="file" accept=".pdf" hidden ref={fileSuratTugasRef}
            onChange={(e) => e.target.files?.[0] && handleUploadSuratTugas(e.target.files[0])} />
          <button onClick={() => fileSuratTugasRef.current?.click()} disabled={isActing}
            className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full rounded-lg px-4 py-3 items-center justify-center disabled:opacity-60 text-sm">
            <FaUpload size={14} /> Upload Surat Tugas
          </button>
        </div>
      );
    }

    const passiveLabels: Record<string, string> = {
      none:                type === "penunjang" ? "Belum ada flyer" : "Belum ada proposal",
      pending_kaprodi:     "Menunggu persetujuan Kaprodi",
      revision_kaprodi:    "Menunggu revisi dari Dosen",
      pending_lppm:        "Menunggu persetujuan LPPM",
      pending_surat_tugas: "Menunggu surat tugas dari Tata Usaha",
      ongoing:             type === "penunjang" ? "Menunggu unggah sertifikat" : "Sedang berjalan",
      accepted:            "Selesai",
    };
    const label = status ? passiveLabels[status] : undefined;
    return label ? (
      <div className="text-muted-text text-sm text-center px-3 py-3 border border-muted-text rounded-lg w-full">
        {label}
      </div>
    ) : null;
  };

  const getStatusBadge = () => {
    if (!data) return null;
    const badgeMap = type === "penunjang" ? PENUNJANG_STATUS_PILL : STATUS_PILL;
    const badge = badgeMap[data.status] || { label: data.status.toUpperCase(), className: "bg-gray-100 text-gray-700" };
    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const visibleDocs = (status === "ongoing" || status === "accepted") ? config : config.filter((d) => d.field === "proposal");
  const canUploadField = (field: DokumenField): boolean => {
    if (field === "proposal") return false; // Handled by header widget
    return isDosen && (status === "ongoing");
  };

  const getBreadcrumbItems = () => {
    const defaultLabel = type === "penunjang" ? "Penunjang" : (type === "pkm" ? "PKM" : "Penelitian");
    if (dosenId) {
      return [
        { label: "Data Dosen", onClick: () => navigate(`/data-dosen/${dosenId}`) },
        { label: defaultLabel, onClick: () => navigate(`/data-dosen/${dosenId}/${type}`) },
        { label: "Detail", isActive: true }
      ];
    }
    if (jurusanId) {
      return [
        { label: defaultLabel, onClick: () => navigate(`/tri-dharma/${type}/jurusan`) },
        { label: "Jurusan", onClick: () => navigate(`/tri-dharma/${type}/${jurusanId}`) },
        { label: "Detail", isActive: true }
      ];
    }
    return [
      { label: defaultLabel, onClick: () => navigate(`/tri-dharma/${type}`) },
      { label: "Detail", isActive: true }
    ];
  };

  return (
    <DashboardLayout>
      <Breadcrumb items={getBreadcrumbItems()} />

      {loading && <StateDisplay type="loading" />}
      {error && <StateDisplay type="error" message={error} />}

      {!loading && !error && data && (
        <>
          {/* Header */}
          <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6 gap-4">
            <div>
              <h1 className="text-2xl text-white font-semibold">{data.judul}</h1>
              <p className="text-light-blue font-medium text-lg mt-2">Dosen: {data.ketua}</p>
              <p className="text-light-blue text-sm mt-1">Periode {data.periode}</p>
              {type !== "penunjang" && data.didanai !== null && (
                <span className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${data.didanai ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {data.didanai ? "✓ Didanai LPPM" : "✕ Tidak Didanai LPPM"}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3 min-w-[210px]">
              {getStatusBadge()}
              {renderActionWidget()}
            </div>
          </div>

          {/* Rejection/Revision Card */}
          {status === "revision_kaprodi" && data.kaprodi_rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 mt-6">
              <p className="font-semibold text-red-700 mb-1">Catatan Revisi Kaprodi</p>
              <p className="text-red-700 text-sm">{data.kaprodi_rejection_reason}</p>
              {data.kaprodi_revision_file && (
                <a href={data.kaprodi_revision_file} target="_blank" rel="noreferrer"
                  className="text-red-500 text-xs underline mt-2 inline-flex items-center gap-1">
                  <FaPaperclip size={10} /> Unduh file revisi dari Kaprodi
                </a>
              )}
            </div>
          )}

          {/* LPPM Not Funded Info */}
          {type !== "penunjang" && data.lppm_rejection_reason && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-5 mt-6">
              <p className="font-semibold text-amber-700 mb-1">⚠ Tidak Didanai LPPM</p>
              <p className="text-amber-700 text-sm">{data.lppm_rejection_reason}</p>
              <p className="text-amber-500 text-xs mt-1">Proses tetap berlanjut ke pembuatan surat tugas.</p>
            </div>
          )}

          {/* Review Messages */}
          {data.reviews && data.reviews.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 mt-6">
              <p className="font-semibold text-red-700 mb-2">Catatan Review</p>
              {data.reviews.map((review) => (
                <div key={review.id} className="mb-3 last:mb-0">
                  <p className="text-red-700 text-sm">{review.pesan}</p>
                  <p className="text-red-400 text-xs italic mt-1">
                    Direview oleh: {review.reviewer} — {formatTanggal(review.tgl_buat)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Documentation Section */}
          <div className="py-8">
            <h2 className="font-semibold text-[22px] lg:text-[25px] mb-4">Dokumentasi {type === "penunjang" ? "Kegiatan" : (type === "pkm" ? "PKM" : "Penelitian")}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visibleDocs.map(({ field, label, deskripsi }) => (
                <DokumenCard
                  key={field}
                  label={label}
                  deskripsi={deskripsi}
                  fileName={data[field]}
                  canUpload={canUploadField(field)}
                  onUpload={(file) => field === "proposal"
                    ? handleUploadProposal(file)
                    : handleUploadDokumen(field, file)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
