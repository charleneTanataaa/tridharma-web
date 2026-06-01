import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuthStore } from "../../stores/auth.store";
import { createSiaranAPI, getSiaranAPI } from "../../mock/authService";
import { Siaran } from "../../mock/data";
import { MdCampaign, MdSend } from "react-icons/md";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [siaran, setSiaran] = useState<Siaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canBroadcast = user?.jabatan === "kaprodi" || user?.jabatan === "dekan";

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    setLoading(true);
    setError(null);
    getSiaranAPI()
    .then(setSiaran)
    .catch(() => setError("Gagal memuat siaran. Silahkan coba lagi."))
    .finally(() => setLoading(false))
  }, [user]);

  if (!user) return null;

  const handleBroadcast = async () => {
    if(!pesan.trim() || submitting) return;
    try{
      setSubmitting(true);
      setError(null);
      const trimmedPesan = pesan.trim();
      setPesan("");

      const newSiaran = await createSiaranAPI(trimmedPesan, user);
      setSiaran((prev) => [newSiaran, ...prev]);
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
    if (siaran.length === 0) return( <StateDisplay type="empty" icon={<MdCampaign size={32}/>} message="Belum ada siaran"/> )

    return (
      <>
      {
        siaran.map((item) => (
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
      <div className="bg-dark-navy rounded-2xl w-full px-10 py-6 mb-6">
        <h1 className="text-[22px] md:text-[30px] pb-2 text-white font-semibold">
          Welcome, {user.nama}
        </h1>
        <p className="capitalize text-muted-text text-[15px] md:text-[18px]">
          {user.jabatan}
        </p>
      </div>
      
      
      <h2 className="text-dark-navy text-[25px]">Siaran</h2>
      <div className="">
        {/* Siaran */}
        <div className="flex flex-col gap-5">
          {renderContent()}

          {canBroadcast && (
            <div className="w-full flex flex-row items-center gap-3">
              <textarea value={pesan} placeholder="Kirim broadcast" onChange={(e) => setPesan(e.target.value)} rows={2} className="flex-1  p-2 outline-none text-primary-gold border bg-white border-gray-300 rounded-xl"></textarea>
              <button
              onClick={handleBroadcast}
              disabled={submitting || !pesan.trim()}
              className="bg-primary-gold text-white flex gap-2 items-center justify-center p-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50">
                <MdSend size={20}/> Kirim
              </button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}