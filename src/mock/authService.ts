import { LoginResponse, Role, User } from "../types/auth";
import { mockUsers } from "./users";
import {
  jurusanData,
  MataKuliahDetail,
  mockMataKuliahDetail,
  mockNotifikasi,
  mockPembelajaran,
  mockPenelitian,
  mockPenelitianDetail,
  mockSiaran,
  Notifikasi,
  PembelajaranResponse,
  PenelitianDetail,
  PenelitianListResponse,
  ReviewAdministrasi,
  Siaran,
} from "./data";

const MOCK_PASSWORD = "password123";

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ================= AUTH ================= */

export async function loginAPI(nim: string, password: string ): Promise<LoginResponse> {
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

export async function sendOtpAPI() {
  await delay();
}

export async function verifyOtpAPI() {
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

export async function createSiaranAPI(
  pesan: string,
  user: User,
  targetRoles: Role[]
): Promise<Siaran> {
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

export async function getPembelajaran(
  idSem: string
): Promise<PembelajaranResponse> {
  await delay();

  const data = mockPembelajaran[idSem];

  if (!data) throw new Error("Semester tidak ditemukan");

  return data;
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
    "soal_uas" | "soal_uts" | "absensi" | "nilai" | "rps" | "berita_acara"
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

export async function getPenelitian(
  idSem: string
): Promise<PenelitianListResponse> {
  await delay();

  return mockPenelitian[idSem];
}

export async function getPenelitianDetailAPI(
  id: string
): Promise<PenelitianDetail> {
  await delay();

  return mockPenelitianDetail[id];
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