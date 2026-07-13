import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuthStore } from "../../stores/auth.store";
import { createSiaranAPI, getSiaranAPI } from "../../mock/authService";
import { MdCampaign, MdSend } from "react-icons/md";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { toast } from "sonner";
import { useFetchData } from "../../hooks/useFetchData";
import { Siaran } from "../../mock/db";
import { Jurusan } from "../../types/auth";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: siaran, loading, error, setData: setSiaran } = useFetchData<Siaran[]>({ fetchFn: getSiaranAPI, dependencies: [user?.id]});
  
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canBroadcast = user?.jabatan === "kaprodi" || user?.jabatan === "dekan";

  if (!user) return null;

  const handleBroadcast = async () => {
    if (!pesan.trim() || submitting || !user.jabatan) return;
    try {
      setSubmitting(true);
      const trimmedPesan = pesan.trim();
      const newSiaran = await createSiaranAPI(trimmedPesan, {
        id: user.id, 
        nama: user.nama, 
        jabatan: user.jabatan, 
        jurusan: user.jurusan as Jurusan
      }, []);
      
      setSiaran((prev) => [newSiaran, ...(prev ?? [])]);
      setPesan("");
      toast.success("Siaran berhasil dikirim.");
    } catch {
      toast.error("Tidak bisa mengirim siaran. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if(loading) return <StateDisplay type="loading" message="Memuat broadcast..."/>
    if(error) return <StateDisplay type="error" message={error}/>
    if (!siaran || siaran.length === 0) return( <StateDisplay type="empty" icon={<MdCampaign size={32}/>} message="Belum ada siaran"/> )

    return (
      <>
      {
        siaran?.map((item) => (
          <div key={item.id} className="p-4 bg-white flex items-center gap-5 border border-card-cream rounded-xl">
              <div className="w-15 shrink-0 h-15 bg-dark-navy rounded-full"/>
              <div className="">
                <p className="text-dark-navy text-lg lg:text-xl">{item.nama} <span className="capitalize text-muted-text"> - {item.jabatan}</span></p>
                <p className="text-md text-primary-gold">{item.pesan}</p>
                <p className="text-md text-muted-text">{new Date(item.tgl_buat).toLocaleDateString()}</p>
              </div>
          </div>
        ))
      }
      </>
    )
  }

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="bg-dark-navy rounded-2xl w-full px-10 py-6 mb-6 flex flex-col md:flex-row items-start justify-between">
        <div>
        <h1 className="text-[22px] md:text-[30px] pb-2 text-white font-semibold">
          Welcome, {user.nama}
        </h1>
        <p className="capitalize text-muted-text text-[15px] md:text-[18px]">
          {user.jabatan?.replace("-", " ")}
        </p>
        </div>
        
      </div>
      
      
      <h2 className="text-dark-navy text-[25px]">Siaran</h2>
      <div className="">
        {/* Siaran */}
        <div className="flex flex-col gap-5">
          {renderContent()}

          {canBroadcast && (
            <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-card-cream">
              <div className="">
                <textarea value={pesan} placeholder="Kirim broadcast" rows={3} onChange={(e) => setPesan(e.target.value)} className="w-full h-20 resize-none p-2 outline-none bg-card-cream border border-gray-300 rounded-xl" />
                <button onClick={handleBroadcast} disabled={submitting || !pesan.trim() } className="w-full bg-primary-gold text-white flex gap-2 items-center justify-center p-2.5 rounded-xl disabled:opacity-50">
                  <MdSend size={20}/> Kirim
                </button>
              </div>
            </div>
            
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}