import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout"
import { FaFileDownload, FaUpload } from "react-icons/fa";
import { useAuthStore } from "../../stores/auth.store"
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useFetchData } from "../../hooks/useFetchData";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { semesters } from "../../mock/db";
import { approveSuratTugasAPI, getMyPembelajaran, getPembelajaranByDosen, rejectSuratTugasAPI, uploadSuratTugasAPI } from "../../mock/authService";
import SemesterSelector from "../../components/ui/SemesterSelector";
import MatkulList from "../../components/ui/pembelajaran/MatkulList";
import { toast } from "sonner";

export default function Pembelajaran() {
    const navigate = useNavigate();
    const { dosenId } = useParams();
    const user = useAuthStore((state) => state.user);
    const isTataUsaha = user?.jabatan === "tata-usaha";
    const isDekan = user?.jabatan === "dekan";
    const isKaprodi = user?.jabatan === "kaprodi";

    useEffect(() => {
        if (isTataUsaha && !dosenId) navigate("/tri-dharma/pembelajaran/jurusan", { replace: true });
    }, [isTataUsaha, dosenId, navigate]);

    const activeSemester = semesters.find((s) => s.active);
    const [selectedSemesterId, setSelectedSemesterId] = useState(activeSemester?.id ?? semesters[0].id);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [showApproveInput, setShowApproveInput] = useState(false);
    const [signedFile, setSignedFile] = useState<File | null>(null);
    const fileSignedInputRef = useRef<HTMLInputElement>(null);
    const [isActing, setIsActing] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, loading, error, setData } = useFetchData({
        fetchFn: () => dosenId
            ? getPembelajaranByDosen(selectedSemesterId, dosenId, search)
            : getMyPembelajaran(selectedSemesterId, user?.id ?? "", search),
        dependencies: [selectedSemesterId, dosenId, search]
    });

    if (!user) return null;
    if (isTataUsaha && !dosenId) return null;

    const status = data?.surat_tugas_status ?? "none";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            fileInputRef.current?.click();
            return;
        }
        setIsActing(true);
        try {
            await uploadSuratTugasAPI(selectedSemesterId, selectedFile.name);
            setData((prev) => prev ? { ...prev, surat_tugas: selectedFile.name, surat_tugas_status: "pending_dekan" } : prev);
            toast.success("Surat tugas berhasil diupload");
            setSelectedFile(null);
        } catch { toast.error("Gagal mengupload surat tugas"); }
        finally { setIsActing(false); }
    };

    const handleApprove = async () => {
        if (!isDekan && !isKaprodi) return;
        if (!signedFile) {
            toast.error("Silakan pilih dokumen bertanda tangan");
            return;
        }
        const role = isDekan ? "dekan" : "kaprodi";
        const nextStatus = isDekan ? "pending_kaprodi" : "approved";
        setIsActing(true);
        try {
            await approveSuratTugasAPI(selectedSemesterId, role, signedFile.name);
            setData((prev) => prev ? { ...prev, surat_tugas: signedFile.name, surat_tugas_status: nextStatus as any } : prev);
            setShowApproveInput(false);
            setSignedFile(null);
            toast.success("Surat tugas disetujui");
        } catch { toast.error("Gagal menyetujui"); }
        finally { setIsActing(false); }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) { toast.error("Masukkan alasan penolakan"); return; }
        setIsActing(true);
        try {
            await rejectSuratTugasAPI(selectedSemesterId, rejectReason);
            setData((prev) => prev ? { ...prev, surat_tugas_status: "rejected", surat_tugas_rejection_reason: rejectReason } : prev);
            setShowRejectInput(false);
            setRejectReason("");
            toast.success("Surat tugas ditolak");
        } catch { toast.error("Gagal menolak"); }
        finally { setIsActing(false); }
    };

    // Surat Tugas widget — different per role & status
    const renderSuratTugas = () => {
        if (status === "approved" && data?.surat_tugas) {
            return (
                <a href={data.surat_tugas} target="_blank" rel="noreferrer"
                    className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full rounded-lg px-4 py-3 items-center justify-center">
                    <FaFileDownload size={18} /> Unduh Surat Tugas
                </a>
            );
        }

        if (isTataUsaha) {
            if (status === "none" || status === "rejected") return (
                <div className="flex flex-col gap-2 w-full">
                    {status === "rejected" && (
                        <p className="text-red-400 text-xs">Ditolak: {data?.surat_tugas_rejection_reason}</p>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button onClick={handleUpload} disabled={isActing}
                        className="flex font-medium text-dark-navy gap-2 bg-primary-gold w-full rounded-lg px-4 py-3 items-center justify-center disabled:opacity-60">
                        <FaUpload size={16} /> {selectedFile ? `Upload: ${selectedFile.name}` : (status === "rejected" ? "Upload Ulang Surat Tugas" : "Upload Surat Tugas")}
                    </button>
                </div>
            );
            return (
                <div className="text-light-blue text-sm text-center px-3 py-3 border border-light-blue rounded-lg w-full">
                    {status === "pending_dekan" ? "Menunggu persetujuan Dekan" : "Menunggu persetujuan Kaprodi"}
                </div>
            );
        }

        if ((isDekan && status === "pending_dekan") || (isKaprodi && status === "pending_kaprodi")) {
            return (
                <div className="flex flex-col gap-2 w-full">
                    {!showRejectInput && !showApproveInput && (
                        <div className="flex gap-2">
                            <button onClick={() => { setShowApproveInput(true); setShowRejectInput(false); }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-3 py-2 text-sm">
                                ✓ Setujui
                            </button>
                            <button onClick={() => { setShowRejectInput(true); setShowApproveInput(false); }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-3 py-2 text-sm">
                                ✕ Tolak
                            </button>
                        </div>
                    )}
                    {showRejectInput && (
                        <div className="flex flex-col gap-2">
                            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Alasan penolakan..."
                                className="w-full border border-light-blue bg-medium-navy text-white rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                                rows={2} />
                            <div className="flex gap-2">
                                <button onClick={handleReject} disabled={isActing}
                                    className="flex-1 bg-red-500 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60">
                                    Kirim Penolakan
                                </button>
                                <button onClick={() => setShowRejectInput(false)}
                                    className="flex-1 bg-muted-text text-white rounded-lg px-3 py-2 text-sm">
                                    Batal
                                </button>
                            </div>
                        </div>
                    )}
                    {showApproveInput && (
                        <div className="flex flex-col gap-2">
                            <input type="file" accept=".pdf" ref={fileSignedInputRef} className="hidden"
                                onChange={(e) => setSignedFile(e.target.files?.[0] ?? null)} />
                            <button onClick={() => fileSignedInputRef.current?.click()}
                                className="border border-dashed border-light-blue text-light-blue rounded-lg px-3 py-2 text-sm flex items-center justify-center gap-2">
                                <FaUpload size={12} />
                                {signedFile ? signedFile.name : "Unggah Surat Tugas Bertanda Tangan (PDF)"}
                            </button>
                            <div className="flex gap-2">
                                <button onClick={handleApprove} disabled={!signedFile || isActing}
                                    className="flex-1 bg-green-500 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60 font-semibold">
                                    Kirim Persetujuan
                                </button>
                                <button onClick={() => { setShowApproveInput(false); setSignedFile(null); }}
                                    className="flex-1 bg-muted-text text-white rounded-lg px-3 py-2 text-sm">
                                    Batal
                                </button>
                            </div>
                        </div>
                    )}
                    <a href={data?.surat_tugas ?? "#"} target="_blank" rel="noreferrer"
                        className="text-light-blue text-xs underline text-center">
                        Lihat dokumen surat tugas
                    </a>
                </div>
            );
        }

        // Dekan/Kaprodi but not their turn, or dosen with no approved ST yet
        return (
            <div className="text-muted-text text-sm text-center px-3 py-3 border border-muted-text rounded-lg w-full">
                {status === "none" ? "Belum ada surat tugas" :
                    status === "pending_dekan" ? "Menunggu persetujuan Dekan" :
                        status === "pending_kaprodi" ? "Menunggu persetujuan Kaprodi" :
                            status === "rejected" ? "Surat tugas ditolak" :
                                "Belum ada surat tugas"}
            </div>
        );
    };

    return (
        <DashboardLayout>
            <Breadcrumb items={dosenId
                ? [
                    { label: "Data Dosen", onClick: () => navigate(`/data-dosen/${dosenId}`) },
                    { label: "Pembelajaran", isActive: true },
                ]
                : [{ label: "Pembelajaran" },
                { label: "Semester", isActive: true },
                ]
            } />

            <div className="bg-dark-navy flex flex-col lg:flex-row justify-between rounded-2xl w-full px-5 lg:px-10 py-6">
                <div>
                    <h1 className='text-2xl pb-2 text-white font-semibold'>Pembelajaran</h1>
                    <p className="text-light-blue font-medium text-[15px]">Kelola daftar mata kuliah dan administrasi</p>
                    <SemesterSelector value={selectedSemesterId} onChange={setSelectedSemesterId} className="mt-5" />
                </div>
                <div className="flex flex-col items-end gap-4 mt-5 lg:mt-0 text-sm min-w-[200px]">
                    {renderSuratTugas()}
                </div>
            </div>

            <div className="py-8">
                <h2 className="font-semibold text-primary-text text-xl mb-3">Daftar Mata Kuliah</h2>
                <div className="flex mb-3">
                    <input type="text" placeholder="Cari mata kuliah..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="border bg-white rounded border-card-cream px-4 h-11 w-full focus:outline-none focus:border-primary-gold" />
                </div>
                <MatkulList
                    matkul={data?.matakuliah ?? []}
                    loading={loading}
                    error={error}
                    emptyMessage="Tidak ada mata kuliah pada semester ini"
                    onSelect={(m) => navigate(dosenId ? `/data-dosen/${dosenId}/pembelajaran/${m.id}` : `/tri-dharma/pembelajaran/matkul/${m.id}`)}
                />
            </div>
        </DashboardLayout>
    );
}
