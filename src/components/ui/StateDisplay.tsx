import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdErrorOutline, MdInbox } from "react-icons/md";

type StateDisplayProps = {
    type: "loading" | "error" | "empty";
    message?: string;
    icon?: React.ReactNode;
};

export function StateDisplay({ type, message, icon} : StateDisplayProps){
    if(type === "loading"){
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                <AiOutlineLoading3Quarters size={28} className="animate-spin text-primary-gold"/>
                <p className="text-sm">{ message ?? "Memuat data..." }</p>
            </div>
        );
    }

    if (type === "error"){
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
                <MdErrorOutline size={32}/>
                <p className="text-sm">{ message ?? "Terjadi kesalahan. Coba lagi."}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
            {icon ?? <MdInbox size={32} />}
            <p className="text-sm">{ message ?? "Tidak ada data."}</p>
        </div>
    );
}