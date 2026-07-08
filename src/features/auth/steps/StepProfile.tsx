import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import AuthLayout from "../../../layouts/AuthLayout";
import { FormField } from "../../../components/ui/FormField";

const jurusanOptions = [
    "Informatika", "Sistem Informasi", "Hukum", "Akuntansi", "Manajemen", "Hospitality",
] as const;

const schema = z.object({
    nama: z.string().min(1, "Nama lengkap wajib diisi"),
    jabatan: z.enum(["dosen", "dosen tetap"], {message: "Pilih jabatan",}),
    jurusan: z.string().min(1, "Jurusan wajib diisi"),
    tahunBergabung: z.string().optional(),
    jenjangAkademik: z.string().optional(),
    punyaSertifikat: z.enum(["yes", "no"]).optional(),
    nomorSertifikat: z.string().optional(),
    nidn: z.string().optional(),
    notelp: z.string().optional(),
    tglLahir: z.string().optional(),
}).refine(
    (data) => data.punyaSertifikat === "no" || !!data.nomorSertifikat, 
    { path: ['nomorSertifikat'], message: "Nomor sertifikat wajib diisi",}
);

type StepProfileProps = {
    email: string;
    onBack: () => void,
    onNext: (data: ProfileForm) => void;
}
const labelStyle= "text-sm text-muted-text font-medium";
export type ProfileForm = z.infer<typeof schema>;

export default function StepProfile({ email, onBack, onNext } : StepProfileProps){
    const {register, handleSubmit, control, formState: {errors, isSubmitting}} = useForm<ProfileForm>({
        resolver: zodResolver(schema),
    });

    const punyaSertifikat = useWatch({ control, name: "punyaSertifikat" });
    const onSubmit = async (data: ProfileForm) => {
        await onNext(data);
    }

    return(
        <AuthLayout>
            <h1 className="text-xl font-semibold">Lengkapi Profil</h1>
            <p className="text-gray-500 mb-6">
                Email: {email}
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField placeholder="Dr. Putri Rahayu, M.Pd" label="Nama Lengkap*" id="nama" error={errors.nama?.message} {...register("nama")}/>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelStyle}>Posisi / Jabatan*</label>
                        <select id="" className="w-full rounded h-10 bg-primary-cream p-4" {...register("jabatan")}>
                            <option value="">Pilih jabatan</option>
                            <option value="dosen">Dosen</option>
                            <option value="dosen tetap">Dosen Tetap</option>
                        </select>
                        <p className="text-red-500 text-sm">{errors.jabatan?.message}</p>
                    </div>
                    <div>
                        <label className={labelStyle}>
                            Jurusan*
                        </label>
                        <select className="w-full h-10 bg-primary-cream rounded-lg p-4" {...register("jurusan")}>
                            <option value="">Pilih Jurusan</option>
                            {jurusanOptions.map((item) => (
                                <option value={item} key={item}>{item}</option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm">{errors.jurusan?.message}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                <FormField placeholder="2018" label="Tahun Bergabung" id="tahunBergabung" type="number" {...register("tahunBergabung")} />
                <FormField placeholder="S1/D4, S2, S3" label="Jenjang Akademik" id="jenjangAkademik" {...register("jenjangAkademik")}/>
                </div>
                <div>
                    <label className={labelStyle}>Punya Sertifikat Dosen?</label>
                    <select id="" className="w-full h-10 bg-primary-cream w-full p-4 rounded" {...register("punyaSertifikat")}>
                        <option value="no">Tidak</option>
                        <option value="yes">Ya</option>
                    </select>
                </div>
                {punyaSertifikat === "yes" && (
                    <FormField placeholder="Masukkan nomor sertifikat" id="nomorSertifikat" label="Nomor Sertifikat Dosen" error={errors.nomorSertifikat?.message} {...register("nomorSertifikat")}/>
                )}
                <div className="grid grid-cols-2 gap-4">
                <FormField label="NIDN" placeholder="10 digit angka" id="nidn" error={errors.nidn?.message} {...register("nidn")}/>
                <FormField placeholder="08123456789" label="No. Telp" id="notelp" error={errors.notelp?.message} {...register("notelp")}/>
                </div>
                <FormField label="Tanggal Lahir" id="tglLahir" type="date" error={errors.tglLahir?.message} {...register("tglLahir")}/>

                <div className=" flex flex-col gap-3 items-center">
                    <button disabled={isSubmitting} type="submit" className="font-semibold w-[300px] text-sm bg-dark-navy text-white py-2 px-4 rounded-lg">Lanjut</button>
                    <button type="button" onClick={onBack} className="text-sm text-primary-gold">Kembali</button>
                </div>
            </form>
        </AuthLayout>
    )
}