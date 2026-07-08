import { FaFileAlt, FaUpload } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import {AdminItem} from '../../types/mataKuliah';
import { useEffect, useState } from 'react';
import { toast } from "sonner";

type Props = {
    item: AdminItem;
    value: string | null;
    jabatan: string;
    onLinkSubmit?: (link: string) => void;
}

export default function AdminCard({item, value, jabatan, onLinkSubmit }: Props) {
  const uploaded = !!value;
  const [ isEditing, setIsEditing ] = useState(!uploaded);
  const [ inputValue, setInputValue ] = useState(value ?? "");

  useEffect(() => {
    setInputValue(value ?? "");
    setIsEditing(!value);
  }, [value]);

  const handleButtonClick = async () => {
    // not upload yet, still in editing mode -> when click, submits
    if(isEditing) {
      const trimmed = inputValue.trim();
      if(!trimmed){
        toast.error("Link tidak boleh kosong.");
        return;
      }
      try{
        await toast.promise(
          Promise.resolve(onLinkSubmit?.(trimmed)),
        {loading: "Menyimpan upload...",
          success: "Berhasil disimpan!",
          error: "Gagal menyimpan link. Coba lagi."
        });
        setIsEditing(false);
      } catch {
        
      } 
      return;
    }
    setIsEditing(true);
  };
  
  return (
    <div className=" bg-white border border-card-cream rounded-2xl overflow-hidden">
      {/* Top title, description & status */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-md lg:text-lg text-dark-navy">{item.label}</p>
            <p className="text-xs lg:text-sm text-muted-text mt-1">{item.description}</p>
          </div>
          <StatusBadge uploaded={uploaded} />
        </div>
      </div>

      {/* Bottom File details & upload file*/}
      <div className=" border-t border-card-cream px-5 py-4 flex items-center justify-between gap-3 ">
        { jabatan === "dosen" ? (
          <>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {uploaded && !isEditing && <FaFileAlt size={14} className='text-primary-gold shrink-0' />}
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={!isEditing} placeholder='Masukkan link' 
              className={`w-full text-sm rounded-lg px-3 py-2 border outline-none ${
                isEditing 
                ? "border-gray-300 bg-white text-dark-navy"
                : "border-transparent bg-gray-100 text-muted-text cursor-not-allowed"
              }`} 
              />
          </div>
          <button onClick={handleButtonClick} className="bg-primary-gold text-sm lg:text-base text-dark-navy font-medium px-4 py-2 rounded-lg flex items-center gap-2 shrink-0">
            <FaUpload size={14}/>{!uploaded ? "Upload" : isEditing ? "Submit" : "Update"}
          </button>
          </>
        ) : (
          uploaded ? (
            <div className="flex items-center gap-2 text-primary-gold text-sm">
              <FaFileAlt size={14}/><span className="truncate">{value}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-text">Belum diupload</span>
          )
        )}
      </div>
    </div>
  );
}

