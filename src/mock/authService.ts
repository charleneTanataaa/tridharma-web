import { LoginResponse, Role, User } from "../types/auth";
import {
  jurusanData,
  MataKuliah,
  MataKuliahDetail,
  matkulList,
  mockMataKuliahDetail,
  mockNotifikasi,
  mockPembelajaran,
  mockPenelitianDetail,
  mockSiaran,
  mockUsers,
  Notifikasi,
  PembelajaranResponse,
  PenelitianDetail,
  PenelitianListResponse,
  ReviewAdministrasi,
  Siaran,
  SuratTugasStatus,
} from "./db";

const MOCK_PASSWORD = "password123";

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ================= AUTH ================= */

export async function loginAPI(nim: string, password: string): Promise<LoginResponse> {
  await delay();
  if (!nim || !password) {
    return { success: false, message: "NIM dan Password wajib diisi" };
  }
  const user = mockUsers.find((u) => u.nim === nim);
  if (!user || password !== MOCK_PASSWORD) {
    return { success: false, message: "NIM atau Password salah" };
  }
  return {
    success: true,
    message: "Login berhasil",
    user: {
      id: user.id,
      nama: user.nama,
      nim: user.nim,
      jabatan: user.jabatan,
      jurusan: user.jurusan,
      foto: user.foto,
    },
    token: Math.random().toString(36).slice(2) + Date.now().toString(36),
  };
}
export async function getUserAPI(id: string): Promise<User> {
  await delay();
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error("User tidak ditemukan");
  return user;
}

export async function sendOtpAPI(email: string) {
  await delay();
}

export async function verifyOtpAPI(email: string, code: string) {
  await delay();
}

export async function resetPasswordAPI() {
  await delay();
}

/* ================= NOTIFIKASI ================= */

export async function getNotifikasiAPI(): Promise<Notifikasi[]> {
  await delay();
  return mockNotifikasi;
}

export async function readNotifikasiAPI(id: string) {
  await delay();

  const notif = mockNotifikasi.find((n) => n.id === id);

  if (notif) notif.dibaca = true;
}

/* ================= SIARAN ================= */

export async function getSiaranAPI(): Promise<Siaran[]> {
  await delay();
  return mockSiaran;
}

export async function createSiaranAPI( pesan: string, user: Pick<User, "id" | "nama" | "jabatan" | "jurusan" >, targetRoles: Role[] ) : Promise<Siaran> {
  await delay();
  return {
    id: Date.now().toString(),
    id_user: user.id,
    nama: user.nama,
    jabatan: user.jabatan,
    jurusan: user.jurusan,
    pesan,
    tgl_buat: new Date().toISOString(),
    target_roles: targetRoles,
    hapus: false,
  };
}

/* ================= PEMBELAJARAN ================= */

// For dosen accessing their own pembelajaran list.
// On the real backend this would use the auth token — userId is passed here for mock purposes.
export async function getMyPembelajaran(
  idSem: string,
  userId: string,
  search: string = ""
): Promise<PembelajaranResponse> {
  await delay();
  const semData = mockPembelajaran[idSem];
  if (!semData) throw new Error("Semester tidak ditemukan");
  return {
    ...semData,
    matakuliah: semData.matakuliah
      .filter((m) => m.dosen_id === userId)
      .filter((m) => m.nama.toLowerCase().includes(search.toLowerCase())),
  };
}

// For admin/kaprodi/TU viewing a specific dosen's pembelajaran from Data Dosen.
// On the real backend: GET /pembelajaran?semester=s1&dosenId=1
export async function getPembelajaranByDosen(
  idSem: string,
  dosenId: string,
  search: string = "",
): Promise<PembelajaranResponse> {
  await delay();
  const semData = mockPembelajaran[idSem];
  if (!semData) throw new Error("Semester tidak ditemukan");

  return {
    ...semData,
    matakuliah: semData.matakuliah
      .filter((m) => m.dosen_id === dosenId)
      .filter((m) => m.nama.toLowerCase().includes(search.toLowerCase())),
  };
}

export async function getMatkulByJurusan(jurusanId: number, semesterId: string, search: string = "") {
  await delay();
  const matakuliah = matkulList.filter((m) => m.jurusan_id === jurusanId).filter((m) => m.semester_id === semesterId).filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()));
  return { matakuliah };
}

/* ================= SURAT TUGAS ================= */

// TU uploads the file — moves status to pending_dekan
export async function uploadSuratTugasAPI(semesterId: string, fileName: string): Promise<void> {
  await delay();
  const sem = mockPembelajaran[semesterId];
  if (!sem) throw new Error("Semester tidak ditemukan");
  sem.surat_tugas = fileName;
  sem.surat_tugas_status = "pending_dekan";
  sem.surat_tugas_rejection_reason = undefined;
}

// Dekan → pending_kaprodi, Kaprodi → approved
export async function approveSuratTugasAPI(semesterId: string, role: "dekan" | "kaprodi"): Promise<void> {
  await delay();
  const sem = mockPembelajaran[semesterId];
  if (!sem) throw new Error("Semester tidak ditemukan");
  sem.surat_tugas_status = role === "dekan" ? "pending_kaprodi" : "approved";
}

// Dekan or Kaprodi rejects — status goes back to rejected, TU must re-upload
export async function rejectSuratTugasAPI(semesterId: string, reason: string): Promise<void> {
  await delay();
  const sem = mockPembelajaran[semesterId];
  if (!sem) throw new Error("Semester tidak ditemukan");
  sem.surat_tugas_status = "rejected";
  sem.surat_tugas_rejection_reason = reason;
}

export async function getHasilMataKuliahAPI(
  id: string
): Promise<MataKuliahDetail> {
  await delay();

  const data = mockMataKuliahDetail[id];

  if (!data) throw new Error("Data tidak ditemukan");

  return data;
}

export async function uploadHasilMataKuliahAPI(
  id: string,
  field: keyof Pick<
    MataKuliahDetail,
    "soal_uas" | "soal_uts" | "absensi" | "nilai" | "rps" | "berita_acara" | "epp_uas" | "epp_uts"
  >,
  fileName: string
) {
  await delay();

  mockMataKuliahDetail[id][field] = fileName;
}

export async function addReviewAPI(
  id: string,
  pesan: string,
  reviewer: string
): Promise<ReviewAdministrasi> {
  await delay();

  const review = {
    id: Date.now().toString(),
    reviewer,
    pesan,
    tgl_buat: new Date().toISOString(),
  };

  mockMataKuliahDetail[id].reviews.push(review);

  return review;
}

/* ================= PENELITIAN ================= */

// Helper: konversi PenelitianDetail ke Penelitian (list item)
function toListItem(p: PenelitianDetail) {
  return { id: p.id, judul: p.judul, kode: p.kode, sks: p.sks, status: p.status, jurusan_id: p.jurusan_id, dosen_id: p.dosen_id };
}

// GET semua penelitian pada semester (admin/kaprodi/TU view)
export async function getPenelitian(idSem: string): Promise<PenelitianListResponse> {
  await delay();
  const penelitian = Object.values(mockPenelitianDetail)
    .filter((p) => p.semester_id === idSem)
    .map(toListItem);
  return { penelitian };
}

// GET penelitian milik dosen sendiri (atau dosen tertentu dari data-dosen view)
export async function getMyPenelitian(idSem: string, dosenId: string, search: string = ""): Promise<PenelitianListResponse> {
  await delay();
  const penelitian = Object.values(mockPenelitianDetail)
    .filter((p) => p.semester_id === idSem && p.dosen_id === dosenId)
    .filter((p) => p.judul.toLowerCase().includes(search.toLowerCase()))
    .map(toListItem);
  return { penelitian };
}

// GET penelitian per jurusan (admin jurusan view)
export async function getPenelitianByJurusan(jurusanId: number, idSem: string, search: string = ""): Promise<PenelitianListResponse> {
  await delay();
  const penelitian = Object.values(mockPenelitianDetail)
    .filter((p) => p.semester_id === idSem && p.jurusan_id === jurusanId)
    .filter((p) => p.judul.toLowerCase().includes(search.toLowerCase()))
    .map(toListItem);
  return { penelitian };
}

export async function getPenelitianDetail(penelitianId: string): Promise<PenelitianDetail> {
  await delay();
  const penelitian = mockPenelitianDetail[penelitianId];
  if(!penelitian) throw new Error("Penelitian tidak ditemukan");
  return penelitian;
}

export async function uploadPenelitianAPI(
  id: string,
  field: keyof Pick<
    PenelitianDetail,
    "proposal" | "laporan_akhir" | "loa" | "hasil_review_sederajat"
  >,
  fileName: string
) {
  await delay();

  mockPenelitianDetail[id][field] = fileName;
}

export async function addReviewPenelitianAPI(
  id: string,
  pesan: string,
  reviewer: string
): Promise<ReviewAdministrasi> {
  await delay();

  const review = {
    id: Date.now().toString(),
    reviewer,
    pesan,
    tgl_buat: new Date().toISOString(),
  };

  mockPenelitianDetail[id].reviews.push(review);

  return review;
}

// Dosen upload proposal → status: pending_kaprodi
export async function uploadProposalPenelitianAPI(id: string, fileName: string): Promise<void> {
  await delay();
  const penelitian = mockPenelitianDetail[id];
  if (!penelitian) throw new Error("Penelitian tidak ditemukan");
  penelitian.proposal = fileName;
  penelitian.status = "pending_kaprodi";
}

// Kaprodi setujui proposal → status: pending_lppm
export async function approveKaprodiPenelitianAPI(id: string): Promise<void> {
  await delay();
  const penelitian = mockPenelitianDetail[id];
  if (!penelitian) throw new Error("Penelitian tidak ditemukan");
  penelitian.status = "pending_lppm";
  penelitian.kaprodi_rejection_reason = undefined;
  penelitian.kaprodi_revision_file = undefined;
}

// Kaprodi tolak proposal → status: revision_kaprodi
export async function rejectKaprodiPenelitianAPI(id: string, reason: string, revisionFile?: string): Promise<void> {
  await delay();
  const penelitian = mockPenelitianDetail[id];
  if (!penelitian) throw new Error("Penelitian tidak ditemukan");
  penelitian.status = "revision_kaprodi";
  penelitian.kaprodi_rejection_reason = reason;
  penelitian.kaprodi_revision_file = revisionFile ?? null;
}

// LPPM setujui → status: pending_surat_tugas, didanai: true
export async function approveLPPMAPI(id: string): Promise<void> {
  await delay();
  const penelitian = mockPenelitianDetail[id];
  if (!penelitian) throw new Error("Penelitian tidak ditemukan");
  penelitian.status = "pending_surat_tugas";
  penelitian.didanai = true;
}

// LPPM tolak → status: pending_surat_tugas, didanai: false (proses tetap lanjut)
export async function rejectLPPMAPI(id: string, reason: string): Promise<void> {
  await delay();
  const penelitian = mockPenelitianDetail[id];
  if (!penelitian) throw new Error("Penelitian tidak ditemukan");
  penelitian.status = "pending_surat_tugas";
  penelitian.didanai = false;
  penelitian.lppm_rejection_reason = reason;
}

// TU upload surat tugas → status: ongoing
export async function uploadSuratTugasPenelitianAPI(id: string, fileName: string): Promise<void> {
  await delay();
  const penelitian = mockPenelitianDetail[id];
  if (!penelitian) throw new Error("Penelitian tidak ditemukan");
  penelitian.surat_tugas = fileName;
  penelitian.status = "ongoing";
}


/* ================= DOSEN ================= */

export type DosenListItem = User;

export async function getDosenAPI(): Promise<DosenListItem[]> {
  await delay();
  return mockUsers.filter((u) => u.jabatan === "dosen");
}

export async function getDosenDetailAPI(id: string): Promise<User | null> {
  await delay();
  const dosen = mockUsers.find((u) => u.id === id);
  return dosen || null;
}

/* ================= JURUSAN ================= */

export async function getJurusan() {
  await delay();
  return jurusanData;
}

/* ================= MATA KULIAH ================= */

export type AddMatkulPayload = {
  nama: string;
  kode: string;
  kelas: string;
  sks: number;
  jurusan_id: number;
  semester_id: string;
  dosen_id: string;
  hari: string[];
  start_time: string;
  end_time: string;
  link_unggah?: string;
};

export async function addMatkulAPI(payload: AddMatkulPayload): Promise<MataKuliah> {
  await delay();
  const newId = matkulList.length > 0 ? Math.max(...matkulList.map((m) => m.id)) + 1 : 1;
  const newMatkul: MataKuliah = { id: newId, ...payload };
  matkulList.push(newMatkul);
  // Also add to the correct semester bucket in mockPembelajaran
  const semData = mockPembelajaran[payload.semester_id];
  if (semData) semData.matakuliah.push(newMatkul);
  return newMatkul;
}