import { IoMdClose } from "react-icons/io";
import { useAuthStore } from "../../stores/auth.store";

type AddSemesterModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (payload: {
        semester:string;
        tahun: string;
    }) => void;
};

export default function AddSemesterModal({ open, onClose, onSubmit } : AddSemesterModalProps) {
    const user = useAuthStore((state) => state.user);
    if(!open) return null;

    if (user?.jabatan !== "tata-usaha") {
        return (
            <div onClick={onClose} className="fixed top-0 left-0 z-100 bg-black/80 w-screen h-screen flex items-center justify-center">
                <div className="bg-white p-5 rounded-lg text-center min-w-md" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-red-600 mb-2">Akses Ditolak</h3>
                    <p className="text-gray-600 mb-4 text-sm">Hanya Tata Usaha yang dapat menambahkan semester baru.</p>
                    <button onClick={onClose} className="bg-primary-gold px-4 py-2 rounded-lg text-sm font-semibold">Tutup</button>
                </div>
            </div>
        );
    }
    return (
        <div onClick={onClose} className="fixed top-0 left-0 z-100 bg-black/80 w-screen h-screen flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg min-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-dark-navy">Tambah Semester</h3>
                    <button type="button" onClick={onClose}>
                        <IoMdClose className="text-dark-navy hover:text-primary-gold transition duration-300"/>
                    </button>
                </div>
                <form className="grid grid-cols-2 gap-3" onSubmit={(e) => {
                    // tambah api function here
                    e.preventDefault(); 
                    const form = new FormData(e.currentTarget);
                    onSubmit?.({ 
                        semester: form.get("semester")?.toString() ?? "",
                        tahun: form.get("tahun")?.toString() ?? "",
                    });
                    onClose();
                }}>
                    <div className="flex flex-col">
                        <label htmlFor="semester" className="text-gray-600 font-medium text-sm">Semester</label>
                        <select name="semester" id="semester" className="flex-1 bg-gray-100 rounded">
                            <option value="ganjil">Ganjil</option>
                            <option value="genap">Genap</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="tahun" className=" text-gray-600 font-medium text-sm">Tahun</label>
                        <input type="number" name="tahun" id="tahun" placeholder="2026" className="p-2 rounded-lg bg-gray-100"/>
                    </div>
                    <button type="submit" className="bg-primary-gold col-span-2 rounded-lg py-2 font-medium">Tambah semester</button>
                </form>
            </div>
        </div>
    )
}