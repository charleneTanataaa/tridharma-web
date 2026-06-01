export type Semester = {
  id: string;
  label: string;
  active: boolean;
};

export type MataKuliah = {
  id: number;
  nama: string;
  kelas: string;
};

export type PembelajaranResponse = {
    surat_tugas: string | null;
    matakuliah: MataKuliah[];
}

export type ReviewAdministrasi = {
    id: string;
    reviewer: string;
    pesan: string;
    tgl_buat: string;
}


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

    reviews: ReviewAdministrasi[];
}
export type Notifikasi = {
    id: string;
    pesan: string;
    halamanWeb: string;
    halamanMobile: string;
    dibaca: boolean;
    tgl_buat: string;
}

export type Siaran = {
    id: string;
    id_user: string;
    nama: string;
    jabatan: string;
    jurusan: string;
    pesan: string;
    tgl_buat: string;
    hapus: boolean;
}

export const semesters: Semester[] = [
    {id: "s1", label: "Semester Ganjil 2025/2026", active: true},
    {id: "s2", label: "Semester Genap 2024/2025", active: false},
    {id: "s3", label: "Semester Ganjil 2024/2025", active: false},
]

export const mockPembelajaran: Record<string, PembelajaranResponse>={
    s1: {
        surat_tugas: null,
        matakuliah: [
            { id: 1, nama: "Matematika Diskrit", kelas: "19TI1"},
            { id: 2, nama: "Business Intelligence", kelas: "19TI2"},
            { id: 3, nama: "Pemrograman Web", kelas: "19TI3"},
        ],
    },
    s2: {
        surat_tugas: "surat-tugas-genap.pdf",
        matakuliah: [
            { id: 4, nama: "Basis Data", kelas: "20TI1"},
            { id: 5, nama: "Jaringan Komputer", kelas: "20TI2"},
            { id: 6, nama: "Pemrograman Web", kelas: "20TI3"},
        ],
    },
    s3: {
        surat_tugas: null,
        matakuliah: [],
    },
};

export const mockMataKuliahDetail: Record<string, MataKuliahDetail> = {
    "1": {
        id: 1,
        nama: "Matematika Diskrit",
        kode: "IF2204",
        semester: "Semester Ganjil 2026",
        kelas: "19TI1",
        sks: 3,
        dosen: "Ferawaty, S.Kom., M.T.",
        jumlah_mahasiswa: 38,
        soal_uas: "soal_uas.pdf",
        soal_uts: null,
        absensi: null,
        nilai: null,
        rps: null,
        berita_acara: null,
        link_lainnya: null,
        reviews: [],
    },
    "2": {
        id: 2,
        nama: "Business Intelligence",
        kode: "ID2204",
        semester: "Semester Ganjil 2026",
        kelas: "19TI1",
        sks: 3,
        dosen: "Ferawaty, S.Kim., M.T.",
        jumlah_mahasiswa: 38,
        soal_uas: null,
        soal_uts: null,
        absensi: null,
        nilai: null,
        rps: null,
        berita_acara: null,
        link_lainnya: null,
        reviews: [
            {
                id: "r1",
                reviewer: "Ferawaty, S.Kom., M.T.",
                pesan: "File UTS salah. Upload ulang",
                tgl_buat: "2026-03-10T09:00:00Z",
            },
        ],
    },
}
export const mockNotifikasi: Notifikasi[] = [
    {
        id: "1",
        pesan: "Surat tugas semester genap 2023/2024 telah diterbitkan",
        halamanWeb: "/tri-dharma/pembelajaran",
        halamanMobile: "PEMBELAJARAN_SCREEN",
        dibaca: false,
        tgl_buat: "2024-03-01T08:00:00Z",
    },
    {
        id: "2",
        pesan: "Proposal penelitian Anda telah disetujui oleh Kaprodi",
        halamanWeb: "/tri-dharma/penelitian",
        halamanMobile: "PEMBELAJARAN_SCREEN",
        dibaca: false,
        tgl_buat: "2024-03-02T08:00:00Z",
    },
]

export const mockSiaran: Siaran[] = [
    {
        id: "1",
        id_user: "2",
        nama: "Ferawaty S.Kom,. M.Kom.",
        jabatan: "kaprodi",
        jurusan: "Informatika",
        pesan: "Mohon seluruh dosen segera melengkapi data profil akademik sebelumnya",
        tgl_buat: "2024-03-01T07:00:00Z",
        hapus:false,
    },
    {
        id: "2",
        id_user: "2",
        nama: "Ferawaty S.Kom,. M.Kom.",
        jabatan: "kaprodi",
        jurusan: "Informatika",
        pesan: "Segera seluruh dosen segera melengkapi data profil akademik sebelumnya",
        tgl_buat: "2024-03-01T07:00:00Z",
        hapus:false,
    }
]