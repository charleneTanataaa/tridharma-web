import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFileDownload, FaPaperclip } from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useFetchData } from "../../hooks/useFetchData";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { getPenelitianDetailAPI, uploadPenelitianAPI } from "../../mock/authService";
import type { StatusPenelitian, PenelitianDetail } from "../../mock/data";

const STATUS_PILL: Record<StatusPenelitian, { label: string; className: string }> = {
  accepted: { label: "ACCEPTED", className: "bg-green-100 text-green-700" },
  rejected: { label: "REJECTED", className: "bg-red-100 text-red-700" },
  pending: { label: "PENDING REVIEW", className: "bg-amber-100 text-amber-700" },
};

type DokumenField = "proposal" | "laporan_akhir" | "loa" | "hasil_review_sederajat";

const DOKUMEN_CONFIG: { field: DokumenField; label: string; deskripsi: string }[] = [
  { field: "proposal", label: "Proposal Penelitian", deskripsi: "Dokumen usulan lengkap" },
  { field: "laporan_akhir", label: "Laporan Akhir", deskripsi: "Laporan hasil penelitian" },
  { field: "loa", label: "Letter of Acceptance", deskripsi: "Bukti penerimaan publikasi jurnal" },
  { field: "hasil_review_sederajat", label: "Hasil Review Sederajat", deskripsi: "Berkas soal ujian akhir semester" },
];

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function DokumenCard({label, deskripsi, fileName, onUpload, }: { label: string; deskripsi: string; fileName: string | null; onUpload: () => void;}) {
    const isTerunggah = fileName !== null;
    return (
        <div className="bg-white border border-card-cream rounded-2xl">
        <div className="p-5 flex justify-between items-start">
            <div>
                <p className="font-semibold text-md text-dark-navy">{label}</p>
                <p className="text-muted-text text-xs lg:text-sm mt-1">{deskripsi}</p>
            </div>
            <span
            className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                isTerunggah ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
            >
            {isTerunggah ? "TERUNGGAH" : "BELUM"}
            </span>
        </div>

        <div className="border-t border-card-cream px-5 py-4">
            {isTerunggah 
                ? ( <div className="flex items-center gap-2 text-xs lg:text-sm text-dark-navy"><FaPaperclip size={12} /> {fileName}</div> ) 
                : ( <p className="text-xs lg:text-sm text-dark-navy">Belum diunggah.</p> )}

            <button
                onClick={onUpload}
                className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full mt-4 rounded-lg px-4 py-2.5 items-center justify-center text-sm"
            >
                <FaFileDownload size={16} />
                {isTerunggah ? "Update" : "Unggah"}
            </button>
        </div>
    </div>
  );
}

export default function PenelitianDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [uploadingField, setUploadingField] = useState<DokumenField | null>(null);

    const { data, loading, error } = useFetchData<PenelitianDetail>({
        fetchFn: () => getPenelitianDetailAPI(id ?? ""),
        dependencies: [id],
    });
    const visibleDokumenConfig = data?.status === "accepted" ? DOKUMEN_CONFIG : DOKUMEN_CONFIG.filter((d) => d.field === "proposal");

    return (
        <DashboardLayout>
        <Breadcrumb items={[{ label: "Penelitian", isActive: true }, {label: "Semester", onClick: () => navigate(-1)}, { label: "Detail Penelitian", isActive: true }]} />

        {loading && <StateDisplay type="loading" />}
        {error && <StateDisplay type="error" message={error} />}

        {!loading && !error && data && (
            <>
            {/* header - judul, ketua, periode, status, unduh surat tugas */}
            <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6 gap-4">
                <div>
                <h1 className="text-2xl  text-white font-semibold">{data.judul}</h1>
                <p className="text-light-blue font-medium text-lg mt-2">
                    Ketua Penelitian: {data.ketua}
                </p>
                <p className="text-light-blue text-sm mt-2">Periode {data.periode}</p>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_PILL[data.status].className}`}>
                    {STATUS_PILL[data.status].label}
                </span>
                <button className="flex font-medium text-dark-navy gap-2 bg-primary-gold rounded-lg px-4 py-3 items-center text-sm whitespace-nowrap">
                    <FaFileDownload size={18} />
                    Unduh surat tugas
                </button>
                </div>
            </div>

            {/* catatan review - hanya tampil kalau ada review */}
            {data.reviews.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 mt-6">
                <p className="font-semibold text-red-700 mb-2">Catatan Review</p>
                {data.reviews.map((review) => (
                    <div key={review.id} className="mb-3 last:mb-0">
                    <p className="text-red-700 text-sm">{review.pesan}</p>
                    <p className="text-red-400 text-xs italic mt-1">
                        Direview oleh: {review.reviewer} - {formatTanggal(review.tgl_buat)}
                    </p>
                    </div>
                ))}
                </div>
            )}

            {/* dokumentasi penelitian */}
            <div className="py-8">
                <h2 className="font-semibold text-[22px] lg:text-[25px] mb-4">Dokumentasi Penelitian</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {visibleDokumenConfig.map(({ field, label, deskripsi }) => (
                    <DokumenCard
                    key={field}
                    label={label}
                    deskripsi={deskripsi}
                    fileName={data[field]}
                    onUpload={() => (console.log("Upload"))}
                    />
                ))}
                </div>
            </div>
            </>
        )}
        </DashboardLayout>
    );
}