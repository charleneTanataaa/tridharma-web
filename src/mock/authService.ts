import { mockUsers } from "./users";
import { User } from "../types/auth";
import { MataKuliahDetail, mockMataKuliahDetail, mockNotifikasi, mockPembelajaran, mockSiaran, Notifikasi, PembelajaranResponse, ReviewAdministrasi, Siaran } from "./data";

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export async function loginAPI(email: string, password:string) {
    await delay();
    const found = mockUsers.find(
        (u) => u.email === email && u.password === password
    );
    if(!found) throw new Error("Email atau password salah");
    return {access_token: found.access_token};
}

export async function getUserAPI(token: string): Promise<User>{
    await delay();
    const found = mockUsers.find((u) => u.access_token === token);
    if(!found) throw new Error("Unauthorized");
    const { password, access_token, ...user } = found;
    return user;
}

export async function sendOtpAPI(email: string): Promise<void>{
    await delay();
    const exists = mockUsers.find((u) => u.email === email);
    if(!exists) throw new Error("Email tidak ditemukan");
    console.log(`[MOCK] OTP sent to ${email}: 123456`);
}

export async function verifyOtpAPI(email: string, otp: string): Promise<void>{
    await delay();
    if(otp !== "123456") throw new Error("Kode OTP salah");
}

export async function resetPasswordAPI(email: string, newPassword: string): Promise<void>{
    await delay();
    const user = mockUsers.find((u) => u.email === email);
    if(!user) throw new Error("Email tidak ditemukan");
    user.password = newPassword;
    console.log(`[MOCK] Password updated for ${email}`)
}

export async function getNotifikasiAPI(): Promise<Notifikasi[]>{
    await delay();
    return mockNotifikasi;
}

export async function readNotifikasiAPI(id: string): Promise<void>{
    await delay();
    const found = mockNotifikasi.find((n) => n.id === id);
    if(!found) throw new Error("Notifikasi tidak ditemukan");
    found.dibaca = true;
}

export async function getSiaranAPI(): Promise<Siaran[]>{
    await delay();
    return mockSiaran;
}

export async function createSiaranAPI(pesan: string, user: User): Promise<Siaran> {
    await delay();
    const newSiaran: Siaran = {
        id: String(Date.now()),
        id_user: user.id,
        nama: user.nama,
        jabatan: user.jabatan,
        jurusan: user.jurusan,
        pesan,
        tgl_buat: new Date().toISOString(),
        hapus: true,
    };
    return newSiaran;
}

export async function getPembelajaran(idSem: string): Promise<PembelajaranResponse>{
    await delay();
    const data = mockPembelajaran[idSem];
    if(!data) throw new Error("Semester tidak ditemukan");
    return data;
}

export async function getHasilMataKuliahAPI(id: string): Promise<MataKuliahDetail>{
    await delay();
    const found = mockMataKuliahDetail[id];
    if(!found) throw new Error("Data tidak ditemukan");
    return found;
}

export async function uploadHasilMataKuliahAPI(
    id: string, 
    field: keyof Pick<MataKuliahDetail, "soal_uas" | "soal_uts" | "absensi" | "nilai" | "rps" | "berita_acara">,
    fileName: string
): Promise<void>{
    await delay();
    const found = mockMataKuliahDetail[id];
    if (!found) throw new Error("Data tidak ditemukan");
    found[field]= fileName;
}

export async function addReviewAPI(id: string, pesan: string, reviewer: string): Promise<ReviewAdministrasi>{
    await delay();
    const found = mockMataKuliahDetail[id];
    if(!found) throw new Error('Data tidak ditemukan');
    const review: ReviewAdministrasi = {
        id: String(Date.now()),
        reviewer,
        pesan,
        tgl_buat: new Date().toISOString(),
    };
    found.reviews.push(review);
    return review;
}