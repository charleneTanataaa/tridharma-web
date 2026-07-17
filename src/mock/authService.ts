import { LoginResponse, Role, User } from "../types/auth";
import {
  jurusanData,
  Kelas,
  kelasList,
  MataKuliah,
  MataKuliahDetail,
  MataKuliahKatalog,
  matkulKatalog,
  matkulList,
  mockMataKuliahDetail,
  mockNotifikasi,
  mockPembelajaran,
  mockPenelitianDetail,
  mockPKMDetail,
  mockPenunjangDetail,
  DharmaType,
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
export async function approveSuratTugasAPI(semesterId: string, role: "dekan" | "kaprodi", fileName?: string): Promise<void> {
  await delay();
  const sem = mockPembelajaran[semesterId];
  if (!sem) throw new Error("Semester tidak ditemukan");
  sem.surat_tugas_status = role === "dekan" ? "pending_kaprodi" : "approved";
  if (fileName) {
    sem.surat_tugas = fileName;
  }
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

/* ================= TRI DHARMA (PENELITIAN, PKM, PENUNJANG) ================= */

export function getDharmaCollection(type: DharmaType): Record<string, PenelitianDetail> {
  if (type === "pkm") return mockPKMDetail;
  if (type === "penunjang") return mockPenunjangDetail;
  return mockPenelitianDetail;
}

export type DharmaListItem = {
  id: number;
  judul: string;
  kode: string;
  sks: number;
  status: string;
  jurusan_id: number;
  dosen_id: string;
};

function toListItem(p: PenelitianDetail): DharmaListItem {
  return { id: p.id, judul: p.judul, kode: p.kode, sks: p.sks, status: p.status, jurusan_id: p.jurusan_id, dosen_id: p.dosen_id };
}

// GET all dharma on semester
export async function getDharmaList(type: DharmaType, idSem: string): Promise<{ items: DharmaListItem[] }> {
  await delay();
  const collection = getDharmaCollection(type);
  const items = Object.values(collection)
    .filter((p) => p.semester_id === idSem)
    .map(toListItem);
  return { items };
}

// GET my dharma (lecturer view)
export async function getMyDharmaList(type: DharmaType, idSem: string, dosenId: string, search: string = ""): Promise<{ items: DharmaListItem[] }> {
  await delay();
  const collection = getDharmaCollection(type);
  const items = Object.values(collection)
    .filter((p) => p.semester_id === idSem && p.dosen_id === dosenId)
    .filter((p) => p.judul.toLowerCase().includes(search.toLowerCase()))
    .map(toListItem);
  return { items };
}

// GET dharma by department
export async function getDharmaByJurusan(type: DharmaType, jurusanId: number, idSem: string, search: string = ""): Promise<{ items: DharmaListItem[] }> {
  await delay();
  const collection = getDharmaCollection(type);
  const items = Object.values(collection)
    .filter((p) => p.semester_id === idSem && p.jurusan_id === jurusanId)
    .filter((p) => p.judul.toLowerCase().includes(search.toLowerCase()))
    .map(toListItem);
  return { items };
}

export async function getDharmaDetail(type: DharmaType, id: string): Promise<PenelitianDetail> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error(`${type} tidak ditemukan`);
  return item;
}

export async function uploadDharmaDocumentAPI(
  type: DharmaType,
  id: string,
  field: keyof Pick<
    PenelitianDetail,
    "proposal" | "laporan_akhir" | "loa" | "hasil_review_sederajat"
  >,
  fileName: string
) {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  item[field] = fileName;
}

export async function addReviewDharmaAPI(
  type: DharmaType,
  id: string,
  pesan: string,
  reviewer: string
): Promise<ReviewAdministrasi> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  
  const review = {
    id: Date.now().toString(),
    reviewer,
    pesan,
    tgl_buat: new Date().toISOString(),
  };
  item.reviews.push(review);
  return review;
}

export async function uploadProposalDharmaAPI(type: DharmaType, id: string, fileName: string): Promise<void> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  item.proposal = fileName;
  item.status = "pending_kaprodi";
}

export async function approveKaprodiDharmaAPI(type: DharmaType, id: string, fileName?: string): Promise<void> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  item.status = type === "penunjang" ? "pending_surat_tugas" : "pending_lppm";
  item.kaprodi_rejection_reason = undefined;
  item.kaprodi_revision_file = undefined;
  if (fileName) {
    item.proposal = fileName;
  }
}

export async function rejectKaprodiDharmaAPI(type: DharmaType, id: string, reason: string, revisionFile?: string): Promise<void> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  item.status = "revision_kaprodi";
  item.kaprodi_rejection_reason = reason;
  item.kaprodi_revision_file = revisionFile ?? null;
}

export async function approveLPPMDharmaAPI(type: DharmaType, id: string): Promise<void> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  item.status = "pending_surat_tugas";
  item.didanai = true;
}

export async function rejectLPPMDharmaAPI(type: DharmaType, id: string, reason: string): Promise<void> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  item.status = "pending_surat_tugas";
  item.didanai = false;
  item.lppm_rejection_reason = reason;
}

export async function uploadSuratTugasDharmaAPI(type: DharmaType, id: string, fileName: string): Promise<void> {
  await delay();
  const collection = getDharmaCollection(type);
  const item = collection[id];
  if (!item) throw new Error("Data tidak ditemukan");
  item.surat_tugas = fileName;
  item.status = "ongoing";
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

/* ================= KATALOG MATKUL (TU) ================= */

export type TambahMatkulKatalogPayload = {
  kode: string;
  nama: string;
  sks: number;
  jurusan_id: number;
};

export async function tambahMatkulKatalogAPI(payload: TambahMatkulKatalogPayload): Promise<MataKuliahKatalog> {
  await delay();
  const newId = matkulKatalog.length > 0 ? Math.max(...matkulKatalog.map((m) => m.id)) + 1 : 1;
  const newMatkul: MataKuliahKatalog = { id: newId, ...payload };
  matkulKatalog.push(newMatkul);
  return newMatkul;
}

export async function getMatkulKatalogByJurusan(jurusanId: number): Promise<MataKuliahKatalog[]> {
  await delay();
  return matkulKatalog.filter((m) => m.jurusan_id === jurusanId);
}

/* ================= KELAS (TU) ================= */

export type TambahKelasPayload = {
  tahun: number;
  kode: string;
  nomor: number;
  jurusan_id: number;
};

export async function tambahKelasAPI(payload: TambahKelasPayload): Promise<Kelas> {
  await delay();
  const newId = kelasList.length > 0 ? Math.max(...kelasList.map((k) => k.id)) + 1 : 1;
  const newKelas: Kelas = { id: newId, ...payload };
  kelasList.push(newKelas);
  return newKelas;
}

export async function getKelasByJurusan(jurusanId: number): Promise<Kelas[]> {
  await delay();
  return kelasList.filter((k) => k.jurusan_id === jurusanId);
}

/* ================= ASSIGN MATKUL KE DOSEN (TU) ================= */

export type AssignMatkulPayload = {
  katalog_id: number;  // ID dari MataKuliahKatalog
  semester_id: string;
  kelas_id: number;    // ID dari Kelas
  dosen_id: string;
  hari: string[];
  start_time: string;
  end_time: string;
};

export async function assignMatkulDosenAPI(payload: AssignMatkulPayload): Promise<MataKuliah> {
  await delay();
  const katalog = matkulKatalog.find((m) => m.id === payload.katalog_id);
  if (!katalog) throw new Error("Mata kuliah katalog tidak ditemukan");
  const kelas = kelasList.find((k) => k.id === payload.kelas_id);
  const kelasLabel = kelas ? `${kelas.tahun}${kelas.kode}${kelas.nomor}` : String(payload.kelas_id);
  const newId = matkulList.length > 0 ? Math.max(...matkulList.map((m) => m.id)) + 1 : 1;
  const newMatkul: MataKuliah = {
    id: newId,
    nama: katalog.nama,
    kode: katalog.kode,
    sks: katalog.sks,
    jurusan_id: katalog.jurusan_id,
    kelas: kelasLabel,
    semester_id: payload.semester_id,
    dosen_id: payload.dosen_id,
    hari: payload.hari,
  };
  matkulList.push(newMatkul);
  const semData = mockPembelajaran[payload.semester_id];
  if (semData) semData.matakuliah.push(newMatkul);
  return newMatkul;
}