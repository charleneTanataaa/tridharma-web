import { MataKuliahDetail } from "../../../mock/db"

type Props = {
    data: MataKuliahDetail;
};

export default function MataKuliahHeader({ data }: Props) {
    return (
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
            </div>
        </div>
    )
}