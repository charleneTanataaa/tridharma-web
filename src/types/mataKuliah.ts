import { MataKuliahDetail } from "../mock/data";

type UploadField = keyof Pick< MataKuliahDetail,
    | "soal_uas"
    | "soal_uts"
    | "absensi"
    | "nilai"
    | "rps"
    | "berita_acara"
>;

export type AdminItem = {
  field: UploadField;
  label: string;
  description: string;
};

export const ADMIN_ITEMS: AdminItem[] = [
  { field: "rps", label: "Rencana Pembelajaran Semester (RPS)", description: "Dokumen kurikulum mata kuliah",},
  { field: "absensi", label: "Absensi Mahasiswa", description: "Kehadiran mahasiswa",},
  { field: "soal_uts", label: "Soal UTS", description: "Berkas soal ujian tengah semester",},
  { field: "soal_uas", label: "Soal UAS", description: "Berkas soal ujian akhir semester", },
  { field: "berita_acara", label: "Berita Acara Perkuliahan", description: "Laporan pelaksanaan perkuliahan", },
  { field: "nilai", label: "Nilai Akhir", description: "Nilai mahasiswa", },
  { field: "nilai", label: "Nilai Akhir", description: "Nilai mahasiswa", },
];