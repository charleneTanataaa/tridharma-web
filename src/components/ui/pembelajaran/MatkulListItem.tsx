import { MataKuliah } from "../../../mock/db";
interface MatkulListItemProps {
    matkul: MataKuliah;
    onClick: () => void;
}

export default function MatkulListItem({ matkul, onClick }: MatkulListItemProps) {
    return (
        <div onClick={onClick}
            className="flex justify-between items-center px-6 py-4 cursor-pointer">
            <div>
                <p className="font-semibold text-primary-text">{matkul.nama}</p>
                <p className="text-sm text-gray-500">{matkul.kode} - {matkul.kelas}</p>
            </div>
            <p className="text-sm tet-gray-500">{matkul.sks} SKS</p>
        </div>
    )
}