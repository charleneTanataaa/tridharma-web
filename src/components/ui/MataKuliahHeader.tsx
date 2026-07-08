import { MataKuliahDetail } from "../../mock/data"
import { useAuthStore } from "../../stores/auth.store";

type Props = {
    data: MataKuliahDetail;
    onUploadUlangSuratTugas: () => void;
};

export default function MataKuliahHeader({ data, onUploadUlangSuratTugas } : Props){
    const user  = useAuthStore((state) => state.user);
    if(!user) return null;
    const isTataUsaha = user.jabatan === "tata-usaha";
    return(
        <div className=" bg-dark-navy rounded-2xl p-8 text-white ">
            <div className="flex flex-col lg:flex-row  justify-between gap-4 lg:gap-1 lg:gap-5">
                <div className="">
                    <h1 className="text-2xl font-bold">
                        {data.nama}
                    </h1>

                    <p className="text-light-blue text-sm  mt-2">
                        {data.kode} • {data.sks} SKS •{" "}
                        {data.semester}
                    </p>

                    <div className="flex gap-3 mt-5 flex-wrap">
                        <div className="bg-medium-navy px-4 py-2 rounded-xl">
                        {data.dosen}
                        </div>

                        <div className=" bg-medium-navy px-4 py-2 rounded-xl">
                        {data.jumlah_mahasiswa} Mahasiswa
                        </div>

                        <div className="bg-medium-navy px-4 py-2 rounded-xl">
                        Kelas {data.kelas}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <button
                    className="text-xs lg:text-base h-fit bg-primary-gold text-dark-navy font-semibold px-5 py-3 rounded-xl">
                    Unduh Surat Tugas
                    </button>
                    {isTataUsaha && (
                        <button
                        onClick={onUploadUlangSuratTugas}
                        className="text-xs lg:text-base h-fit bg-primary-gold text-dark-navy font-semibold px-5 py-3 rounded-xl">
                        Unggah Ulang Surat Tugas
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}