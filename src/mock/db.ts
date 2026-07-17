// =============================================================================
// db.ts — Single source of truth for all mock data
// All features import types and data from here.
// Service functions (async API wrappers) live in authService.ts.
// =============================================================================

import { Role, User, Certificate } from "../types/auth";

// ─────────────────────────────────────────────
// USERS & CERTIFICATES
// ─────────────────────────────────────────────

export const mockCertificates: Certificate[] = [
  { id: "1", id_user: "1", nama_file: "Sertifikat Flutter.pdf", tanggal_upload: "2026-07-01" },
  { id: "2", id_user: "1", nama_file: "Workshop AI.pdf", tanggal_upload: "2026-06-15" },
];

export const mockUsers: User[] = [
  { id: "1", nim: "mangasa@uph.edu", nama: "Mangasa", jabatan: "dosen", jurusan: "Informatika", foto: null, thn_masuk: 2021, jenjang_akademik: "S2", no_sertifikat: "SER001", nidn: "1234567890", no_telepon: "081234567890", tgl_lahir: "1988-11-03" },
  { id: "2", nim: "ferawaty@uph.edu", nama: "Ferawaty", jabatan: "kaprodi", jurusan: "Informatika", foto: null, thn_masuk: 2018, jenjang_akademik: "S3", no_sertifikat: "SER002", nidn: "9876543210", no_telepon: "081234567891", tgl_lahir: "1980-03-20" },
  { id: "3", nim: "tu@uph.edu", nama: "Tata Usaha", jabatan: "tata-usaha", jurusan: "Informatika", foto: null, thn_masuk: 2010, jenjang_akademik: "", no_sertifikat: "", nidn: "", no_telepon: "", tgl_lahir: "" },
  { id: "4", nim: "dosen@uph.edu", nama: "Dosen", jabatan: "dosen", jurusan: "Informatika", foto: null, thn_masuk: 2021, jenjang_akademik: "", no_sertifikat: "", nidn: "", no_telepon: "", tgl_lahir: "" },
  { id: "5", nim: "prodi@uph.edu", nama: "Prodi", jabatan: "prodi", jurusan: "Informatika", foto: null, thn_masuk: 2021, jenjang_akademik: "", no_sertifikat: "", nidn: "", no_telepon: "", tgl_lahir: "" },
  { id: "6", nim: "dekan@uph.edu", nama: "Dekan", jabatan: "dekan", jurusan: "Manajemen", foto: null, thn_masuk: 2016, jenjang_akademik: "S3", no_sertifikat: "", nidn: "", no_telepon: "", tgl_lahir: "" },
  { id: "7", nim: "lala@uph.edu", nama: "Lala", jabatan: "dosen", jurusan: "Manajemen", foto: null, thn_masuk: 2021, jenjang_akademik: "S2", no_sertifikat: "SER003", nidn: "1234567890", no_telepon: "081234567890", tgl_lahir: "1988-11-03" },
  { id: "8", nim: "bebe@uph.edu", nama: "Bebe", jabatan: "dosen", jurusan: "Hukum", foto: null, thn_masuk: 2014, jenjang_akademik: "S2", no_sertifikat: "SER001", nidn: "1234567890", no_telepon: "081234567890", tgl_lahir: "1988-11-03" },
  { id: "9", nim: "john@uph.edu", nama: "John", jabatan: "dosen", jurusan: "Akuntansi", foto: null, thn_masuk: 2023, jenjang_akademik: "S3", no_sertifikat: "SER003", nidn: "1234567890", no_telepon: "081234567890", tgl_lahir: "1988-11-03" },
];

// ─────────────────────────────────────────────
// JURUSAN
// ─────────────────────────────────────────────

export interface Jurusan {
  id: number;
  nama: string;
  jumlahMatkul: number;
  jumlahPenelitian: number;
  jumlahPKM: number;
  jumlahPenunjang: number;
}

export const jurusanData: Jurusan[] = [
  { id: 1, nama: "Teknik Informatika", jumlahMatkul: 42, jumlahPenelitian: 10, jumlahPKM: 5, jumlahPenunjang: 3 },
  { id: 2, nama: "Sistem Informasi", jumlahMatkul: 37, jumlahPenelitian: 8, jumlahPKM: 4, jumlahPenunjang: 2 },
  { id: 3, nama: "Manajemen", jumlahMatkul: 28, jumlahPenelitian: 12, jumlahPKM: 6, jumlahPenunjang: 4 },
  { id: 4, nama: "Akuntansi", jumlahMatkul: 31, jumlahPenelitian: 9, jumlahPKM: 5, jumlahPenunjang: 3 },
  { id: 5, nama: "Hukum", jumlahMatkul: 22, jumlahPenelitian: 7, jumlahPKM: 3, jumlahPenunjang: 2 },
  { id: 6, nama: "Hospitality", jumlahMatkul: 20, jumlahPenelitian: 6, jumlahPKM: 3, jumlahPenunjang: 2 },
];

// ─────────────────────────────────────────────
// SEMESTERS
// ─────────────────────────────────────────────

export type Semester = {
  id: string;
  label: string;
  active: boolean;
};

export const semesters: Semester[] = [
  { id: "s1", label: "Semester Ganjil 2025/2026", active: true },
  { id: "s2", label: "Semester Genap 2024/2025", active: false },
  { id: "s3", label: "Semester Ganjil 2024/2025", active: false },
];

// ─────────────────────────────────────────────
// KELAS
// ─────────────────────────────────────────────

export type Kelas = {
  id: number;
  tahun: number;      // e.g. 23
  kode: string;       // e.g. TI
  nomor: number;      // e.g. 1, 2, 3
  jurusan_id: number;
};

export const kelasList: Kelas[] = [
  { id: 1, tahun: 23, kode: "TI", nomor: 1, jurusan_id: 1 },
  { id: 2, tahun: 23, kode: "TI", nomor: 2, jurusan_id: 1 },
  { id: 3, tahun: 23, kode: "SI", nomor: 1, jurusan_id: 2 },
  { id: 4, tahun: 22, kode: "AK", nomor: 1, jurusan_id: 4 },
];

// ─────────────────────────────────────────────
// MATA KULIAH KATALOG (master list)
// ─────────────────────────────────────────────

export type MataKuliahKatalog = {
  id: number;
  kode: string;
  nama: string;
  sks: number;
  jurusan_id: number;
};

export const matkulKatalog: MataKuliahKatalog[] = [
  { id: 1, kode: "IF2204", nama: "Matematika Diskrit", sks: 3, jurusan_id: 1 },
  { id: 2, kode: "IF2301", nama: "Business Intelligence", sks: 3, jurusan_id: 1 },
  { id: 3, kode: "IF2210", nama: "Pemrograman Web", sks: 3, jurusan_id: 1 },
  { id: 4, kode: "IF2205", nama: "Struktur Data", sks: 3, jurusan_id: 1 },
  { id: 5, kode: "SI2101", nama: "Basis Data", sks: 3, jurusan_id: 2 },
  { id: 6, kode: "SI2205", nama: "Analisis Sistem Informasi", sks: 3, jurusan_id: 2 },
  { id: 7, kode: "AK1101", nama: "Akuntansi Keuangan", sks: 3, jurusan_id: 4 },
];

// ─────────────────────────────────────────────
// MATA KULIAH
// ─────────────────────────────────────────────

export type MataKuliah = {
  id: number;
  nama: string;
  kelas: string;
  kode: string;
  jurusan_id: number;
  sks: number;
  semester_id: string;
  dosen_id?: string;
  hari?: string[];
  link_unggah?: string;
};

// Single flat list — both Pembelajaran (dosen view) and PembelajaranJurusan (admin view) filter from here
export const matkulList: MataKuliah[] = [
  { id: 1, nama: "Matematika Diskrit", kode: "IF2204", jurusan_id: 1, sks: 3, kelas: "19TI1", semester_id: "s1", dosen_id: "1", hari: ["Senin", "Rabu"] },
  { id: 2, nama: "Business Intelligence", kode: "IF2301", jurusan_id: 1, sks: 3, kelas: "19TI2", semester_id: "s1", dosen_id: "1", hari: ["Selasa"] },
  { id: 3, nama: "Pemrograman Web", kode: "IF2210", jurusan_id: 1, sks: 3, kelas: "19TI3", semester_id: "s1", dosen_id: "4", hari: ["Kamis"] },
  { id: 4, nama: "Struktur Data", kode: "IF2205", jurusan_id: 1, sks: 3, kelas: "20TI1", semester_id: "s2", dosen_id: "1", hari: ["Senin"] },
  { id: 5, nama: "Basis Data", kode: "SI2101", jurusan_id: 2, sks: 3, kelas: "20SI1", semester_id: "s1", dosen_id: "1", hari: ["Jumat"] },
  { id: 6, nama: "Analisis Sistem Informasi", kode: "SI2205", jurusan_id: 2, sks: 3, kelas: "20SI2", semester_id: "s2", dosen_id: "4", hari: ["Rabu"] },
  { id: 7, nama: "Akuntansi Keuangan", kode: "AK1101", jurusan_id: 3, sks: 3, kelas: "20AK1", semester_id: "s2", dosen_id: "4", hari: ["Selasa", "Kamis"] },
  { id: 8, nama: "Pemrograman Web II", kode: "IF2021", jurusan_id: 1, sks: 3, kelas: "20TI2", semester_id: "s2", dosen_id: "4", hari: ["Senin"] },
];

export type SuratTugasStatus = "none" | "pending_dekan" | "pending_kaprodi" | "approved" | "rejected";

export type PembelajaranResponse = {
  surat_tugas: string | null;
  surat_tugas_status: SuratTugasStatus;
  surat_tugas_rejection_reason?: string;
  matakuliah: MataKuliah[];
};

export const mockPembelajaran: Record<string, PembelajaranResponse> = {
  s1: { surat_tugas: null, surat_tugas_status: "none", matakuliah: matkulList.filter((m) => m.semester_id === "s1") },
  s2: { surat_tugas: "surat-tugas-genap.pdf", surat_tugas_status: "approved", matakuliah: matkulList.filter((m) => m.semester_id === "s2") },
  s3: { surat_tugas: null, surat_tugas_status: "none", matakuliah: [] },
};

// ─────────────────────────────────────────────
// MATA KULIAH DETAIL
// ─────────────────────────────────────────────

export type ReviewAdministrasi = {
  id: string;
  reviewer: string;
  pesan: string;
  tgl_buat: string;
};

export type MataKuliahDetail = {
  id: number;
  nama: string;
  kode: string;
  kelas: string;
  semester: string;
  sks: number;
  dosen: string;
  jumlah_mahasiswa: number;

  soal_uas: string | null;
  soal_uts: string | null;
  absensi: string | null;
  nilai: string | null;
  rps: string | null;
  berita_acara: string | null;
  link_lainnya: string | null;
  epp_uts: string | null;
  epp_uas: string | null;

  reviews: ReviewAdministrasi[];
};

export const mockMataKuliahDetail: Record<string, MataKuliahDetail> = {
  "1": {
    id: 1, nama: "Matematika Diskrit", kode: "IF2204", semester: "Semester Ganjil 2026",
    kelas: "19TI1", sks: 3, dosen: "Ferawaty, S.Kom., M.T.", jumlah_mahasiswa: 38,
    soal_uas: "soal_uas.pdf", soal_uts: null, absensi: null, nilai: null, rps: null, berita_acara: null, link_lainnya: null, epp_uas: null, epp_uts: null,
    reviews: [],
  },
  "2": {
    id: 2, nama: "Business Intelligence", kode: "ID2204", semester: "Semester Ganjil 2026",
    kelas: "19TI1", sks: 3, dosen: "Ferawaty, S.Kom., M.T.", jumlah_mahasiswa: 38,
    soal_uas: null, soal_uts: null, absensi: null, nilai: null, rps: null, berita_acara: null, link_lainnya: null, epp_uas: null, epp_uts: null,
    reviews: [
      { id: "r1", reviewer: "Ferawaty, S.Kom., M.T.", pesan: "File UTS salah. Upload ulang", tgl_buat: "2026-03-10T09:00:00Z" },
    ],
  },
};

// ─────────────────────────────────────────────
// NOTIFIKASI
// ─────────────────────────────────────────────

export type Notifikasi = {
  id: string;
  pesan: string;
  halamanWeb: string;
  halamanMobile: string;
  dibaca: boolean;
  tgl_buat: string;
};

export const mockNotifikasi: Notifikasi[] = [
  { id: "1", pesan: "Surat tugas semester genap 2023/2024 telah diterbitkan", halamanWeb: "/tri-dharma/pembelajaran", halamanMobile: "PEMBELAJARAN_SCREEN", dibaca: false, tgl_buat: "2024-03-01T08:00:00Z" },
  { id: "2", pesan: "Proposal penelitian Anda telah disetujui oleh Kaprodi", halamanWeb: "/tri-dharma/penelitian", halamanMobile: "PEMBELAJARAN_SCREEN", dibaca: false, tgl_buat: "2024-03-02T08:00:00Z" },
];

// ─────────────────────────────────────────────
// SIARAN
// ─────────────────────────────────────────────

export type Siaran = {
  id: string;
  id_user: string;
  nama: string;
  jabatan: string;
  jurusan: string;
  pesan: string;
  tgl_buat: string;
  target_roles: Role[];
  hapus: boolean;
};

export const mockSiaran: Siaran[] = [
  {
    id: "1", id_user: "2", nama: "Ferawaty S.Kom,. M.Kom.", jabatan: "kaprodi", jurusan: "Informatika",
    pesan: "Mohon seluruh dosen segera melengkapi data profil akademik sebelumnya",
    tgl_buat: "2024-03-01T07:00:00Z", target_roles: ["dosen"], hapus: false,
  },
  {
    id: "2", id_user: "2", nama: "Ferawaty S.Kom,. M.Kom.", jabatan: "kaprodi", jurusan: "Informatika",
    pesan: "Segera seluruh dosen segera melengkapi data profil akademik sebelumnya",
    tgl_buat: "2024-03-01T07:00:00Z", target_roles: ["admin", "dekan", "dosen", "kaprodi", "lppm", "prodi", "tata-usaha"], hapus: false,
  },
];

// ─────────────────────────────────────────────
// PENELITIAN
// ─────────────────────────────────────────────

export type StatusPenelitian =
  | "accepted" | "rejected" | "pending"
  | "none"                                        // belum ada proposal
  | "pending_kaprodi"                             // proposal diupload, menunggu kaprodi
  | "revision_kaprodi"                            // kaprodi tolak, dosen perlu revisi
  | "pending_lppm"                                // kaprodi setuju, menunggu lppm
  | "pending_surat_tugas"                         // lppm selesai (approved/rejected), menunggu TU
  | "ongoing";                                    // surat tugas diupload, dosen upload dokumen akhir


// Penelitian list item — derived subset of PenelitianDetail
export type Penelitian = Pick<PenelitianDetail, "id" | "judul" | "kode" | "sks" | "status" | "jurusan_id" | "dosen_id">;

export type PenelitianListResponse = {
  penelitian: Penelitian[];
};

export type PenelitianDetail = {
  id: number;
  judul: string;
  kode: string;
  ketua: string;
  periode: string;
  status: StatusPenelitian;
  // identifiers (single source of truth fields)
  dosen_id: string;
  semester_id: string;
  jurusan_id: number;
  sks: number;
  // dokumen
  proposal: string | null;
  laporan_akhir: string | null;
  loa: string | null;
  hasil_review_sederajat: string | null;
  reviews: ReviewAdministrasi[];
  // flow fields
  didanai: boolean | null;
  surat_tugas: string | null;
  kaprodi_rejection_reason?: string;
  kaprodi_revision_file?: string | null;
  lppm_rejection_reason?: string;
};


// ─────────────────────────────────────────────
// PENELITIAN — single source of truth
// Semua query (list, detail, filter) derive dari sini.
// mockPenelitian dihapus; gunakan helper functions di authService.
// ─────────────────────────────────────────────

export const mockPenelitianDetail: Record<string, PenelitianDetail> = {
  // ── Mangasa (dosen_id: "1") — Semester Ganjil 2025/2026 (s1) ──────────────

  // CASE: LPPM setuju + surat tugas terupload + dosen sedang upload dokumen akhir
  "1": {
    id: 1, judul: "Pengembangan Algoritma ML untuk Deteksi Dini Diabetes",
    kode: "IF2204", ketua: "Mangasa, M.T.", periode: "2026 - 2027",
    status: "ongoing", dosen_id: "1", semester_id: "s1", jurusan_id: 1, sks: 3,
    proposal: "Proposal_ML_Diabetes.pdf",
    laporan_akhir: "LaporanAkhir_ML_Diabetes.pdf",
    loa: null, hasil_review_sederajat: null,
    didanai: true, surat_tugas: "ST_Penelitian_Mangasa_s1_1.pdf",
    reviews: [],
  },

  // CASE: Kaprodi setuju, menunggu LPPM
  "2": {
    id: 2, judul: "Optimasi Algoritma Genetika untuk Penjadwalan Kuliah",
    kode: "IF2301", ketua: "Mangasa, M.T.", periode: "2026 - 2027",
    status: "pending_lppm", dosen_id: "1", semester_id: "s1", jurusan_id: 1, sks: 3,
    proposal: "Proposal_Genetika_Jadwal.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: null, surat_tugas: null,
    reviews: [],
  },

  // ── Dosen (dosen_id: "4") — Semester Ganjil 2025/2026 (s1) ───────────────

  // CASE: Kaprodi tolak — dosen perlu revisi (ada alasan + file revisi)
  "3": {
    id: 3, judul: "Sistem Rekomendasi Berbasis Collaborative Filtering",
    kode: "IF1984", ketua: "Dosen, S.Kom.", periode: "2026 - 2027",
    status: "revision_kaprodi", dosen_id: "4", semester_id: "s1", jurusan_id: 1, sks: 3,
    proposal: "Proposal_Rekomendasi_v1.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: null, surat_tugas: null,
    kaprodi_rejection_reason: "Rumusan masalah kurang tajam. Mohon perjelas kontribusi ilmiah dan novelty penelitian ini.",
    kaprodi_revision_file: "Revisi_Template_Rekomendasi.pdf",
    reviews: [],
  },

  // CASE: LPPM tolak (tidak didanai) — proses tetap lanjut, TU belum upload ST
  "4": {
    id: 4, judul: "Analisis Sentimen Media Sosial Menggunakan BERT",
    kode: "IF2330", ketua: "Dosen, S.Kom.", periode: "2026 - 2027",
    status: "pending_surat_tugas", dosen_id: "4", semester_id: "s1", jurusan_id: 2, sks: 3,
    proposal: "Proposal_Sentimen_BERT.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: false, surat_tugas: null,
    lppm_rejection_reason: "Topik tumpang tindih dengan penelitian yang sudah didanai tahun sebelumnya.",
    reviews: [{ id: "r4", reviewer: "LPPM UPH", pesan: "Topik tumpang tindih dengan penelitian yang sudah didanai tahun sebelumnya. Proses tetap dilanjutkan.", tgl_buat: "2026-09-01T09:00:00Z" }],
  },

  // CASE: Proposal baru diupload, menunggu Kaprodi
  "5": {
    id: 5, judul: "Implementasi IoT untuk Monitoring Kualitas Udara Dalam Ruangan",
    kode: "IF2410", ketua: "Dosen, S.Kom.", periode: "2026 - 2027",
    status: "pending_kaprodi", dosen_id: "4", semester_id: "s1", jurusan_id: 2, sks: 4,
    proposal: "Proposal_IoT_Kualitas_Udara.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: null, surat_tugas: null,
    reviews: [],
  },

  // ── Mangasa (dosen_id: "1") — Semester Genap 2024/2025 (s2) ─────────────

  // CASE: Semua dokumen akhir terupload (kasus selesai sempurna, didanai)
  "6": {
    id: 6, judul: "Penerapan Deep Learning pada Sistem Diagnosis Penyakit Kanker",
    kode: "IF2105", ketua: "Mangasa, M.T.", periode: "2025 - 2026",
    status: "ongoing", dosen_id: "1", semester_id: "s2", jurusan_id: 1, sks: 3,
    proposal: "Proposal_DeepLearning_Kanker.pdf",
    laporan_akhir: "LaporanAkhir_DeepLearning.pdf",
    loa: "LoA_Journal_IEEE.pdf",
    hasil_review_sederajat: "HasilReview_IEEE2026.pdf",
    didanai: true, surat_tugas: "ST_Penelitian_Mangasa_s2.pdf",
    reviews: [],
  },

  // ── Dosen (dosen_id: "4") — Semester Genap 2024/2025 (s2) ───────────────

  // CASE: LPPM tolak (tidak didanai) NAMUN TU sudah upload ST → berjalan tanpa pendanaan
  "7": {
    id: 7, judul: "Penerapan Blockchain untuk Keamanan Data Akademik",
    kode: "IF2105", ketua: "Dosen, S.Kom.", periode: "2025 - 2026",
    status: "ongoing", dosen_id: "4", semester_id: "s2", jurusan_id: 1, sks: 3,
    proposal: "Proposal_Blockchain_Akademik.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: false, surat_tugas: "ST_Blockchain_s2.pdf",
    lppm_rejection_reason: "Anggaran penelitian LPPM tahun ini sudah habis dialokasikan.",
    reviews: [{ id: "r7", reviewer: "LPPM UPH", pesan: "Anggaran penelitian LPPM tahun ini sudah habis. Penelitian tetap dapat dilanjutkan secara mandiri.", tgl_buat: "2025-09-15T09:00:00Z" }],
  },
};

export type DharmaType = "penelitian" | "pkm" | "penunjang";

export const mockPKMDetail: Record<string, PenelitianDetail> = {
  // Dosen Mangasa (dosen_id: "1") - Semester Ganjil 2025/2026 (s1)
  "11": {
    id: 11, judul: "PKM Sosialisasi Pemrograman untuk Anak SD",
    kode: "IF2204", ketua: "Mangasa, M.T.", periode: "2026 - 2027",
    status: "ongoing", dosen_id: "1", semester_id: "s1", jurusan_id: 1, sks: 3,
    proposal: "Proposal_PKM_SD.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: true, surat_tugas: "ST_PKM_Mangasa_s1.pdf",
    reviews: [],
  },
  // Dosen (dosen_id: "4") - Semester Ganjil 2025/2026 (s1)
  "12": {
    id: 12, judul: "Pemberdayaan UMKM melalui Digital Marketing",
    kode: "IF2301", ketua: "Dosen, S.Kom.", periode: "2026 - 2027",
    status: "pending_kaprodi", dosen_id: "4", semester_id: "s1", jurusan_id: 1, sks: 3,
    proposal: "Proposal_PKM_UMKM.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: null, surat_tugas: null,
    reviews: [],
  }
};

export const mockPenunjangDetail: Record<string, PenelitianDetail> = {
  // Dosen Mangasa (dosen_id: "1") - Semester Ganjil 2025/2026 (s1)
  "21": {
    id: 21, judul: "Seminar Nasional Teknologi Informasi",
    kode: "IF2204", ketua: "Mangasa, M.T.", periode: "2026 - 2027",
    status: "ongoing", dosen_id: "1", semester_id: "s1", jurusan_id: 1, sks: 3,
    proposal: "Flyer_Seminar_IT.pdf",
    laporan_akhir: null, loa: null, hasil_review_sederajat: null,
    didanai: null, surat_tugas: "ST_Seminar_Mangasa.pdf",
    reviews: [],
  },
  // Dosen (dosen_id: "4") - Semester Ganjil 2025/2026 (s1)
  "22": {
    id: 22, judul: "Workshop Pengajaran Hybrid",
    kode: "IF2301", ketua: "Dosen, S.Kom.", periode: "2026 - 2027",
    status: "accepted", dosen_id: "4", semester_id: "s1", jurusan_id: 1, sks: 3,
    proposal: "Flyer_Workshop_Hybrid.pdf",
    laporan_akhir: "Sertifikat_Workshop_Hybrid.pdf", loa: null, hasil_review_sederajat: null,
    didanai: null, surat_tugas: "ST_Workshop_Hybrid.pdf",
    reviews: [],
  }
};


