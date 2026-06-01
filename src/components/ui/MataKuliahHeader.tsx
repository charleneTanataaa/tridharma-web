import { MataKuliahDetail } from "../../mock/data"

type Props = {
    data: MataKuliahDetail;
};

export default function MataKuliahHeader({ data,} : Props){
    return(
        <div className=" bg-dark-navy rounded-2xl p-8 text-white ">
            <div className="flex justify-between gap-5">
                <div>
                <h1 className="text-4xl font-bold">
                    {data.nama}
                </h1>

                <p className="text-light-blue text-xl mt-2">
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

                <button
                className=" h-fit bg-primary-gold text-dark-navy font-semibold px-5 py-3 rounded-xl">
                Unduh Surat Tugas
                </button>
            </div>
        </div>
    )
}