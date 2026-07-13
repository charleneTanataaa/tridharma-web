import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus, FaTimes } from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { toast } from "sonner";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import type { Certificate, Role } from "../../types/auth";
import { mockUsers, mockCertificates } from "../../mock/db";

// ----- helpers -----
function getInitials(nama: string) {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const jabatanOptions: { value: Role; label: string }[] = [
  { value: "dosen", label: "Dosen" },
  { value: "kaprodi", label: "Kaprodi" },
  { value: "dekan", label: "Dekan" },
  { value: "lppm", label: "LPPM" },
  { value: "tata-usaha", label: "Tata Usaha" },
  { value: "admin", label: "Admin" },
];

function jabatanLabel(jabatan: string) {
  return jabatanOptions.find((j) => j.value === jabatan)?.label ?? jabatan;
}

// ----- sub-components -----
function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-primary-gold tracking-widest mb-1.5">{label}</p>
      <div className="bg-[#F0EDE6] border border-[#DAD4C7] rounded-xl px-4 py-2.5 text-sm text-dark-navy">
        {value || "-"}
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange, type = "text", placeholder, } : { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-primary-gold tracking-widest mb-1.5">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#DAD4C7] rounded-xl px-4 py-2.5 text-sm text-dark-navy focus:outline-none focus:border-dark-navy bg-white"
      />
    </div>
  );
}

function EditableSelect({ label, value, onChange, options, } : { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-primary-gold tracking-widest mb-1.5">{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-[#DAD4C7] rounded-xl px-4 py-2.5 text-sm text-dark-navy focus:outline-none focus:border-dark-navy bg-white">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ----- modal tambah sertifikat -----
function TambahSertifikatModal({ onClose, onSave, }: { onClose: () => void; onSave: (c: Certificate) => void; }) {
  const [namaFile, setNamaFile] = useState("");
  const [tanggalUpload, setTanggalUpload] = useState(() => new Date().toISOString().slice(0, 10));

  function handleSave() {
    if (!namaFile.trim()) return;
    onSave({
      id: String(Date.now()),
      id_user: "", 
      nama_file: namaFile,
      tanggal_upload: tanggalUpload,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose} >
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl" onClick={(e) => e.stopPropagation()} >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-dark-navy">Tambah Sertifikat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <EditableField label="NAMA FILE" value={namaFile} onChange={setNamaFile} placeholder="Sertifikat Flutter.pdf" />
          <EditableField label="TANGGAL UPLOAD" value={tanggalUpload} onChange={setTanggalUpload} type="date" />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-[#DAD4C7] text-dark-navy rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition" >
            Batal
          </button>
          <button onClick={handleSave} disabled={!namaFile.trim()} className="flex-1 bg-primary-gold text-dark-navy rounded-xl py-2.5 text-sm font-medium disabled:opacity-50 transition" >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- main page -----
export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const fullUser = mockUsers.find((u) => u.id === user?.id);

  const [jabatan, setJabatan] = useState(fullUser?.jabatan ?? "dosen");
  const [thnMasuk, setThnMasuk] = useState(fullUser?.thn_masuk?.toString() ?? "");
  const [jenjangAkademik, setJenjangAkademik] = useState(fullUser?.jenjang_akademik ?? "");
  const [noSertifikat, setNoSertifikat] = useState(fullUser?.no_sertifikat ?? "");
  const [nidn, setNidn] = useState(fullUser?.nidn ?? "");
  const [noTelepon, setNoTelepon] = useState(fullUser?.no_telepon ?? "");
  const [tglLahir, setTglLahir] = useState(fullUser?.tgl_lahir ?? "");

  const [sertifikat, setSertifikat] = useState<Certificate[]>(
    mockCertificates.filter((c) => c.id_user === user?.id)
  );
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user || !fullUser) return null;

  function handleSimpan() {
    const payload = {
      id: fullUser!.id,
      jabatan,
      thn_masuk: thnMasuk,
      jenjang_akademik: jenjangAkademik,
      no_sertifikat: noSertifikat,
      nidn,
      no_telepon: noTelepon,
      tgl_lahir: tglLahir,
      sertifikat,
    };
    console.log("[Profile] simulasi simpan perubahan:", payload);
    toast.success("Perubahan disimpan (simulasi)");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleHapusSertifikat(id: string) {
    setSertifikat((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <DashboardLayout>
      {showModal && (
        <TambahSertifikatModal
          onClose={() => setShowModal(false)}
          onSave={(c) => setSertifikat((prev) => [...prev, { ...c, id_user: user.id }])}
        />
      )}

      {/* back nav */}
      <div className="flex items-center gap-2 mb-6">
        <IoIosArrowBack
          size={24}
          className="text-dark-navy cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[22px] font-semibold">Profile</h1>
      </div>

      {/* welcome card */}
      <div className="bg-dark-navy rounded-2xl px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#2A3550] flex items-center justify-center text-white font-bold text-lg shrink-0">
            {getInitials(user.nama)}
          </div>
          <div>
            <h2 className="text-white text-xl lg:text-2xl font-semibold">Welcome, {user.nama.split(" ")[0]}</h2>
            <p className="text-light-blue text-sm mt-0.5">
              {jabatanLabel(user.jabatan ?? "")} {user.jurusan && user.jurusan !== "All" ? user.jurusan : ""}
            </p>
          </div>
        </div>
        
      </div>

      {/* informasi akademik & pribadi */}
      <div className="bg-white rounded-2xl border border-[#DAD4C7] px-6 lg:px-8 py-6 mb-6">
        <h3 className="font-semibold text-lg text-dark-navy mb-5">Informasi Akademik &amp; Pribadi</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* tidak bisa diubah */}
          <ReadonlyField label="NAMA LENGKAP" value={fullUser.nama} />
          <ReadonlyField label="EMAIL INSTITUSI" value={fullUser.nim} />
          <ReadonlyField label="JURUSAN" value={fullUser.jurusan !== "All" ? fullUser.jurusan : "-"} />

          <EditableSelect label="POSISI / JABATAN"  value={jabatan} onChange={(v) => setJabatan(v as Role)} options={jabatanOptions} />
          <EditableField label="TAHUN BERGABUNG" value={thnMasuk} onChange={setThnMasuk} type="number" placeholder="2018" />
          <EditableField label="JENJANG AKADEMIK" value={jenjangAkademik} onChange={setJenjangAkademik} placeholder="S1/D4, S2, S3" />
          <EditableField label="NOMOR SERTIFIKAT DOSEN" value={noSertifikat} onChange={setNoSertifikat} placeholder="Nomor sertifikat" />
          <EditableField label="NIDN" value={nidn} onChange={setNidn} placeholder="10 digit angka" />
          <EditableField label="NOMOR TELEPON" value={noTelepon} onChange={setNoTelepon} placeholder="+62 111-2222-3333" />
          <EditableField label="TANGGAL LAHIR" value={tglLahir} onChange={setTglLahir} type="date" />

          <button onClick={handleSimpan}
              className="flex lg:col-span-2 items-center justify-center gap-2 bg-dark-navy text-white font-medium rounded-xl px-5 py-2.5 text-sm whitespace-nowrap"
            >
              <MdSave size={15} />
              {saved ? "Tersimpan!" : "Simpan Perubahan"}
            </button>
        </div>
      </div>

      {/* sertifikasi */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-dark-navy">Sertifikasi</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-gold text-dark-navy font-medium rounded-xl px-4 py-2 text-sm"
          >
            <FaPlus size={12} />
            Tambah
          </button>
        </div>

        {sertifikat.length === 0 ? (
          <div className="bg-white border border-[#DAD4C7] rounded-xl px-6 py-8 text-center text-gray-400 text-sm">
            Belum ada sertifikat
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sertifikat.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-[#DAD4C7] rounded-xl px-6 py-4 flex items-center justify-between gap-4"
              >
                <p className="font-semibold text-sm text-dark-navy">{c.nama_file}</p>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="text-sm text-dark-navy">{c.tanggal_upload}</p>
                  <button
                    onClick={() => handleHapusSertifikat(c.id)}
                    className="text-gray-300 hover:text-red-400 transition"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}