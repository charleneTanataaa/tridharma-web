import { IoMdClose } from "react-icons/io";

type TambahMataKuliahProps = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (payload: {
        semester:string;
        tahun: string;
    }) => void;
}
export default function TambahMataKuliah({open, onClose, onSubmit}: TambahMataKuliahProps) {
    if(!open) return null;
  return (
    <div onClick={onClose} className="w-screen h-screen bg-black/80 z-100 fixed top-0 left-0 flex items-center justify-center">
        <div className="bg-white p-5 rounded-lg min-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-dark-navy">Tambah Mata Kuliah</h3>
                <button type="button" onClick={onClose}>
                    <IoMdClose className="text-dark-navy hover:text-primary-gold transition duration-300"/>
                </button>
            </div>
        
        <form className="grid grid-cols-2 gap-2" onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            onSubmit?.({
                semester: form.get("semester")?.toString() ?? "",
                tahun: form.get("tahun")?.toString() ?? "",
            });
        }}>
            <div className="flex flex-col">
                <label htmlFor="semester" className="text-gray-600 font-medium text-sm">Semester</label>
                <select name="semester" id="semester" className="flex-1 bg-gray-100 rounded">
                    <option value="ganjil">Ganjil</option>
                    <option value="genap">Genap</option>
                </select>
            </div>
        </form>
       </div>
    </div>
  )
}
