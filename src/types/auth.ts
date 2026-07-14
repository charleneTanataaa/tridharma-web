export type Role =
  | "dekan"
  | "kaprodi"
  | "lppm"
  | "prodi"
  | "tata-usaha"
  | "dosen"
  | "dosen-tetap"
  | "admin";

export type Jurusan =
  | "Informatika"
  | "Sistem Informasi"
  | "Hukum"
  | "Akuntansi"
  | "Manajemen"
  | "Hospitality"

export interface User {
  id: string;
  nama: string;
  nim: string; // email
  jabatan: Role;
  jurusan: Jurusan;
  foto: string | null;

  thn_masuk: number | null;
  jenjang_akademik: string | null;
  no_sertifikat: string | null;
  nidn: string | null;
  no_telepon: string | null;
  tgl_lahir: string | null;
}

export interface AuthUser {
  id: string;
  nama: string;
  nim: string;
  jabatan: Role | null;
  jurusan: string | null;
  foto: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
}

export interface Certificate {
  id: string;
  id_user: string;
  nama_file: string;
  tanggal_upload: string;
}