import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface JadwalItem {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

export interface TambahJadwalPayload {
  idMatkul: number;
  idSemester: number;
  idKelas: number;
  sks: number;
  jadwal: JadwalItem[];
  linkLpp: string;
  linkRps: string;
  linkUts: string;
  linkEpputs: string;
  linkUas: string;
  linkEppuas: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TambahJadwalPayload) => void;
}

const HARI_OPTIONS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const emptyJadwal: JadwalItem = { hari: "", jam_mulai: "", jam_selesai: "" };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TambahJadwal({ open, onClose, onSubmit }: Props) {
  const [idMatkul, setIdMatkul] = useState("");
  const [idSemester, setIdSemester] = useState("");
  const [idKelas, setIdKelas] = useState("");
  const [sks, setSks] = useState("");

  const [jadwal, setJadwal] = useState<JadwalItem[]>([{ ...emptyJadwal }]);

  const [linkLpp, setLinkLpp] = useState("");
  const [linkRps, setLinkRps] = useState("");
  const [linkUts, setLinkUts] = useState("");
  const [linkEpputs, setLinkEpputs] = useState("");
  const [linkUas, setLinkUas] = useState("");
  const [linkEppuas, setLinkEppuas] = useState("");

  if (!open) return null;

  const updateJadwal = (index: number, field: keyof JadwalItem, value: string) => {
    setJadwal((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addJadwal = () => setJadwal((prev) => [...prev, { ...emptyJadwal }]);

  const removeJadwal = (index: number) =>
    setJadwal((prev) => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setIdMatkul("");
    setIdSemester("");
    setIdKelas("");
    setSks("");
    setJadwal([{ ...emptyJadwal }]);
    setLinkLpp("");
    setLinkRps("");
    setLinkUts("");
    setLinkEpputs("");
    setLinkUas("");
    setLinkEppuas("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      idMatkul: Number(idMatkul),
      idSemester: Number(idSemester),
      idKelas: Number(idKelas),
      sks: Number(sks),
      jadwal,
      linkLpp,
      linkRps,
      linkUts,
      linkEpputs,
      linkUas,
      linkEppuas,
    });

    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white border border-border-gold shadow-xl">
        <div className="flex items-center justify-between  px-6 pt-10 pb-6">
          <h2 className="text-lg font-semibold text-primary-text">
            Tambah Pembelajaran
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 ">
          {/* Informasi Mata Kuliah */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Informasi Mata Kuliah
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Mata Kuliah
                </label>
                <input
                  type="number"
                  value={idMatkul}
                  onChange={(e) => setIdMatkul(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Semester
                </label>
                <input
                  type="number"
                  value={idSemester}
                  onChange={(e) => setIdSemester(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Kelas
                </label>
                <input
                  type="number"
                  value={idKelas}
                  onChange={(e) => setIdKelas(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  SKS
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={sks}
                  onChange={(e) => setSks(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </section>

          {/* Jadwal */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Jadwal</h3>
              <button
                type="button"
                onClick={addJadwal}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                + Tambah Jadwal
              </button>
            </div>

            <div className="space-y-3">
              {jadwal.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]"
                >
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Hari
                    </label>
                    <select
                      value={item.hari}
                      onChange={(e) => updateJadwal(index, "hari", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">Pilih Hari</option>
                      {HARI_OPTIONS.map((hari) => (
                        <option key={hari} value={hari}>
                          {hari}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={item.jam_mulai}
                      onChange={(e) => updateJadwal(index, "jam_mulai", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={item.jam_selesai}
                      onChange={(e) => updateJadwal(index, "jam_selesai", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeJadwal(index)}
                      disabled={jadwal.length === 1}
                      className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Link */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Link</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Link LPP
                </label>
                <input
                  type="text"
                  value={linkLpp}
                  onChange={(e) => setLinkLpp(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Link RPS
                </label>
                <input
                  type="text"
                  value={linkRps}
                  onChange={(e) => setLinkRps(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Link UTS
                </label>
                <input
                  type="text"
                  value={linkUts}
                  onChange={(e) => setLinkUts(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Link EPP UTS
                </label>
                <input
                  type="text"
                  value={linkEpputs}
                  onChange={(e) => setLinkEpputs(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Link UAS
                </label>
                <input
                  type="text"
                  value={linkUas}
                  onChange={(e) => setLinkUas(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Link EPP UAS
                </label>
                <input
                  type="text"
                  value={linkEppuas}
                  onChange={(e) => setLinkEppuas(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}