export type Role = "dekan" | "kaprodi" | "lppm" | "tata-usaha" | "dosen" | "admin";
export type Jurusan = "Informatika" | "Sistem Informasi" | "Hukum" | "Akuntansi" | "Manajemen" | "Hospitality" | "All";
export type User = {
    id: string;
    email: string;
    nama: string;
    jabatan: Role;
    jurusan: Jurusan;
    foto: string | null;
};