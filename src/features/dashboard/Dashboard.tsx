import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuthStore } from "../../stores/auth.store";
import { createSiaranAPI, getSiaranAPI } from "../../mock/authService";
import { MdCampaign, MdSend } from "react-icons/md";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { toast } from "sonner";
import { useFetchData } from "../../hooks/useFetchData";
import { Siaran } from "../../mock/data";
import AddSemesterModal from "../../components/ui/TambahSemester";
import { FaPlus } from "react-icons/fa";
import { Role } from "../../types/auth";

const availableRoles: Role[] = [
  "dosen-tetap",
  "dosen",
  "kaprodi",
  "tata-usaha",
  "admin",
  "dekan",
  "lppm",
  "prodi"
]

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { data:siaran, loading, error, setData: setSiaran } = useFetchData<Siaran[]>({ fetchFn: getSiaranAPI, dependencies: [user?.id]});

  const [pesan, setPesan] = useState("");
  const [ targetRoles, setTargetRoles ] = useState<Role[]>([]); 
  const allSelected = targetRoles.length === availableRoles.length;

  const [submitting, setSubmitting] = useState(false);
  const canBroadcast = user?.jabatan === "kaprodi" || user?.jabatan === "dekan";
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);

  if (!user) return null;

  const toggleAll = () => {
    setTargetRoles((prev) => (ProgressEvent.length === availableRoles.length ? [] : availableRoles));
  };

  const toggleRole = (role: Role) => {
    setTargetRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role])
  };

  const handleBroadcast = async () => {
    if(!pesan.trim() || submitting) return;
    try{
      setSubmitting(true);
      const trimmedPesan = pesan.trim();
      setPesan("");
      setTargetRoles([]);

      const newSiaran = await createSiaranAPI(trimmedPesan, user, targetRoles);
      setSiaran((prev) => [newSiaran, ...(prev ?? [])]);
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
          {user.jabatan.replace("-", " ")}
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
                <button onClick={handleBroadcast} disabled={submitting || !pesan.trim() || targetRoles.length === 0 } className="w-full bg-primary-gold text-white flex gap-2 items-center justify-center p-2.5 rounded-xl disabled:opacity-50">
                  <MdSend size={20}/> Kirim
                </button>
              </div>
              <div >
                <div>
                  <span className="text-sm text-muted-text">Kirim ke:</span>  
                </div>
                <div className="w-full grid grid-cols-3 lg:grid-cols-4">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll}/>
                    <span>Semua</span>
                  </label>
                {availableRoles.map((role) => (
                  <label key={role} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={targetRoles.includes(role)} onChange={() => toggleRole(role)} />
                    <span className="capitalize">{role.replace("-", " ")}</span>
                  </label>
                ))}
                </div>
              </div>
            </div>
            
          )}
        </div>
      </div>
      { showAddSemesterModal && (
        <AddSemesterModal onSubmit={(payload) => { console.log(payload); }} onClose={() => setShowAddSemesterModal(false)} open={showAddSemesterModal} />
      )}
    </DashboardLayout>
  );
}