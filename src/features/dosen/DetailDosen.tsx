import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import { FaArrowLeft, FaSchool, FaFlask, FaUsers, FaStar, FaUser, FaCertificate, FaPlus, FaBook, FaClock } from 'react-icons/fa';
import { getDosenDetailAPI, addMatkulAPI, AddMatkulPayload } from '../../mock/authService';
import { StateDisplay } from '../../components/ui/StateDisplay';
import { User } from '../../types/auth';
import { jurusanData, matkulKatalog, MataKuliahKatalog, semesters } from '../../mock/db';
import { useAuthStore } from '../../stores/auth.store';

const HARI_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const KELAS_OPTIONS = ["A", "B", "C", "D", "19TI1", "19TI2", "20SI1", "20AK1"];

// ─── Input Matkul Modal ───────────────────────────────────────────────────────
function InputMatkulModal({ dosen, onClose, onSuccess }: { dosen: User; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState<Omit<AddMatkulPayload, "dosen_id">>({
        nama: "",
        kode: "",
        kelas: KELAS_OPTIONS[0],
        sks: 3,
        jurusan_id: jurusanData[0].id,
        semester_id: semesters.find(s => s.active)?.id ?? semesters[0].id,
        hari: [],
        start_time: "08:00",
        end_time: "",
        link_unggah: "",
    });
    const [submitting, setSubmitting] = useState(false);
    // Katalog filtered by selected jurusan
    const filteredKatalog: MataKuliahKatalog[] = matkulKatalog.filter(m => m.jurusan_id === form.jurusan_id);
    const [selectedKatalogId, setSelectedKatalogId] = useState<string>("");

    const toggleHari = (h: string) => {
        setForm(prev => ({
            ...prev,
            hari: prev.hari.includes(h) ? prev.hari.filter(x => x !== h) : [...prev.hari, h],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nama.trim() || !form.kode.trim()) { toast.error("Pilih mata kuliah terlebih dahulu"); return; }
        if (form.hari.length === 0) { toast.error("Pilih minimal 1 hari"); return; }
        setSubmitting(true);
        try {
            await addMatkulAPI({ ...form, dosen_id: dosen.id });
            toast.success(`Mata kuliah "${form.nama}" berhasil ditambahkan`);
            onSuccess();
            onClose();
        } catch { toast.error("Gagal menambahkan mata kuliah"); }
        finally { setSubmitting(false); }
    };

    const calculateEndTime = (start: string, sks: number) => {
        if (!start) return "";
        const [hours, minutes] = start.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        date.setMinutes(date.getMinutes() + sks * 50);
        return date.toTimeString().slice(0, 5);
    }

    useEffect(() => (
        setForm(prev => ({
            ...prev, end_time: calculateEndTime(prev.start_time, prev.sks),
        }))
    ), [form.start_time, form.sks]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-dark-navy">Input Mata Kuliah</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Nama Dosen (auto) */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Nama Dosen</label>
                        <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">{dosen.nama}</div>
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Semester</label>
                        <select value={form.semester_id} onChange={e => setForm(p => ({ ...p, semester_id: e.target.value }))}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-gold">
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>

                    {/* Mata Kuliah — pilih dari katalog yang sudah ada */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Jurusan</label>
                        <select value={form.jurusan_id} onChange={e => {
                            setForm(p => ({ ...p, jurusan_id: Number(e.target.value), nama: "", kode: "", sks: 3 }));
                            setSelectedKatalogId("");
                        }}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-gold">
                            {jurusanData.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Mata Kuliah</label>
                        <select value={selectedKatalogId} onChange={e => {
                            const id = e.target.value;
                            setSelectedKatalogId(id);
                            const mk = filteredKatalog.find(m => m.id === Number(id));
                            if (mk) setForm(p => ({ ...p, nama: mk.nama, kode: mk.kode, sks: mk.sks }));
                        }}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-gold" required>
                            <option value="">— Pilih Mata Kuliah —</option>
                            {filteredKatalog.map(m => (
                                <option key={m.id} value={m.id}>{m.kode} — {m.nama} ({m.sks} SKS)</option>
                            ))}
                        </select>
                    </div>

                    {/* Kelas */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Kelas</label>
                        <select value={form.kelas} onChange={e => setForm(p => ({ ...p, kelas: e.target.value }))}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-gold">
                            {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                    </div>

                    {/* SKS */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">SKS</label>
                        <input type="number" min={1} max={6} value={form.sks} onChange={e => setForm(p => ({ ...p, sks: Number(e.target.value) }))}
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-gold" />
                    </div>

                    {/* Hari (multi-select checkbox) */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Hari Perkuliahan</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {HARI_OPTIONS.map(h => (
                                <button type="button" key={h} onClick={() => toggleHari(h)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${form.hari.includes(h)
                                        ? "bg-dark-navy text-white border-dark-navy"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-primary-gold"
                                        }`}>
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Jam (jam selesai atomatis dari sks yang diinput) */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Jam Perkuliahan</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <div className='flex gap-2 items-center justify-center'>
                                <FaClock /><input type="time" className=' bg-gray-100 rounded px-2 py-1' value={form.start_time} onChange={(e) => setForm(prev => ({ ...prev, start_time: e.target.value }))} />
                            </div>
                            <div>-</div>
                            <div className='flex gap-2 items-center justify-center'>
                                <input type="time" className=' bg-gray-100 rounded px-2 py-1' disabled value={form.end_time} />
                            </div>
                        </div>
                    </div>

                    {/* Link Unggah */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Link Unggah <span className="text-gray-400 normal-case">(opsional)</span></label>
                        <input value={form.link_unggah} onChange={e => setForm(p => ({ ...p, link_unggah: e.target.value }))}
                            placeholder="https://drive.google.com/..."
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-gold" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                            Batal
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 bg-dark-navy text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-medium-navy transition disabled:opacity-60">
                            {submitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function DetailDosen() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [dosenDetails, setDosenDetails] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUser = useAuthStore((state) => state.user);
    const isProdi = currentUser?.jabatan === "prodi";
    const [showInputModal, setShowInputModal] = useState(false);

    useEffect(() => {
        if (!id) { setError("ID dosen tidak valid"); setIsLoading(false); return; }
        getDosenDetailAPI(id)
            .then(res => res ? setDosenDetails(res) : setError("Data dosen tidak ditemukan"))
            .catch(() => setError("Gagal memuat data dosen"))
            .finally(() => setIsLoading(false));
    }, [id]);

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr || dateStr === '' || dateStr === '0000-00-00') return '-';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '-';
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        } catch { return dateStr; }
    };

    const InfoRow = ({ label, value, isLast = false }: { label: string; value: string | number; isLast?: boolean }) => (
        <div className={`flex items-start py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">{value || '-'}</p>
            </div>
        </div>
    );

    if (isLoading) return <DashboardLayout><StateDisplay type="loading" /></DashboardLayout>;
    if (error) return <DashboardLayout><StateDisplay type="error" message={error} /></DashboardLayout>;
    if (!dosenDetails) return <DashboardLayout><StateDisplay type="empty" message="Data dosen tidak ditemukan" /></DashboardLayout>;

    const data = dosenDetails;

    return (
        <DashboardLayout>
            <div className="bg-white shadow-sm p-4 sm:p-6 max-w-3xl mx-auto">
                {/* Back */}
                <button onClick={() => navigate('/data-dosen')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-6 group">
                    <FaArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Kembali</span>
                </button>

                {/* Profile */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                        {data.foto
                            ? <img src={data.foto} alt={data.nama} className="w-24 h-24 rounded-full object-cover" />
                            : <FaUser className="w-10 h-10 text-gray-400" />
                        }
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mt-4">{data.nama}</h2>
                    <span className="mt-1 px-4 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-600 capitalize">{data.jabatan}</span>
                    <p className="text-sm text-gray-500 mt-1">{data.jurusan}</p>
                </div>

                {/* Info */}
                <div className="mb-8">
                    <h3 className="text-base font-bold text-primary-gold mb-3">Informasi</h3>
                    <div className="bg-gray-50 grid grid-cols-2 rounded-xl px-4">
                        <InfoRow label="Jenjang Akademik" value={data.jenjang_akademik || '-'} />
                        <InfoRow label="NIDN" value={data.nidn || '-'} />
                        <InfoRow label="No. Sertifikat" value={data.no_sertifikat || '-'} />
                        <InfoRow label="Email" value={data.nim} />
                        <InfoRow label="No. Telepon" value={data.no_telepon || '-'} />
                        <InfoRow label="Tanggal Lahir" value={formatDate(data.tgl_lahir)} isLast />
                    </div>
                </div>

                {/* Tri Dharma — Pembelajaran actions */}
                <div className="mb-8">
                    <h3 className="text-base font-bold text-primary-gold mb-3">Pembelajaran</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => navigate(`/data-dosen/${data.id}/pembelajaran`)}
                            className="flex-1 flex items-center gap-3 bg-[#F1EFE6] hover:bg-[#E8E5D8] rounded-xl px-4 py-3 transition cursor-pointer">
                            <FaBook className="text-dark-navy shrink-0" />
                            <span className="font-semibold text-gray-800 text-sm">Cek Mata Kuliah</span>
                            <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => isProdi && setShowInputModal(true)}
                            disabled={!isProdi}
                            title={!isProdi ? "Hanya Prodi yang dapat menambahkan mata kuliah" : undefined}
                            className={`flex-1 flex items-center gap-3 rounded-xl px-4 py-3 transition ${isProdi
                                ? "bg-dark-navy hover:bg-medium-navy text-white cursor-pointer"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}>
                            <FaPlus className="shrink-0" />
                            <span className="font-semibold text-sm">Input Mata Kuliah</span>
                        </button>
                    </div>
                </div>

                {/* Other Tri Dharma */}
                <div>
                    <h3 className="text-base font-bold text-primary-gold mb-3">Tri Dharma Lainnya</h3>
                    <div className="space-y-2">
                        {[
                            { icon: FaFlask, label: "Penelitian", onClick: () => navigate(`/data-dosen/${data.id}/penelitian`) },
                            { icon: FaUsers, label: "PKM", onClick: () => navigate(`/data-dosen/${data.id}/pkm`) },
                            { icon: FaStar, label: "Penunjang", onClick: () => navigate(`/data-dosen/${data.id}/penunjang`) },
                        ].map(({ icon: Icon, label, onClick }) => (
                            <div key={label} onClick={onClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition bg-[#F1EFE6] hover:bg-[#E8E5D8] cursor-pointer `}>
                                <Icon className="text-dark-navy shrink-0" />
                                <span className="flex-1 font-semibold text-gray-800 text-sm">{label}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Input Matkul Modal */}
            {showInputModal && (
                <InputMatkulModal
                    dosen={data}
                    onClose={() => setShowInputModal(false)}
                    onSuccess={() => { /* could refetch or show confirmation */ }}
                />
            )}
        </DashboardLayout>
    );
}