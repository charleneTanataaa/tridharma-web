import { FaFileAlt, FaUpload } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import {AdminItem} from '../../types/mataKuliah';
import { useRef } from 'react';
import { toast } from "sonner";

type Props = {
    item: AdminItem;
    value: string | null;
    jabatan: string;
    onFileSelect?: (file:File) => void;
}

export default function AdminCard({item, value, jabatan, onFileSelect }: Props) {
  const uploaded = !!value;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('label', item.label);
    try{
      await toast.promise(
        
        Promise.resolve(onFileSelect?.(file)),
        {
          loading: "Mengupload file...",
          success: `${file.name} berhasil diupload!`,
          error: `Upload gagal. Coba lagi.`,
        }
      );
    } finally {
      e.target.value = '';
    }
  };
  
  return (
    <div className=" bg-white border border-card-cream rounded-2xl overflow-hidden">
      {/* Top title, description & status */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-lg text-dark-navy">{item.label}</p>
            <p className="text-sm text-muted-text mt-1">{item.description}</p>
          </div>
          <StatusBadge uploaded={uploaded} />
        </div>
      </div>

      {/* Bottom File details & upload file*/}
      <div className=" border-t border-card-cream px-5 py-4 flex items-center justify-between gap-3 ">
        {uploaded ? (
          <div className="flex items-center gap-2 text-primary-gold text-sm">
            <FaFileAlt size={14} />
            <span className="truncate"> {value} </span>
          </div>
        ) : (
          <span className="text-sm text-muted-text">Belum ada file</span>
        )}

        { jabatan === "dosen" && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange}
            className='hidden' accept=".pdf,.doc,.docs,.png,.jpg,.jpeg" />
            <button onClick={handleButtonClick} className="bg-primary-gold text-dark-navy font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                <FaUpload size={14} />
                {uploaded ? "Update" : "Upload"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
