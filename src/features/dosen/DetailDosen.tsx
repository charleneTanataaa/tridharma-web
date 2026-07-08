import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner';
import { FaArrowLeft, FaSchool, FaFlask, FaUsers, FaStar, FaUser, FaPhone, FaEnvelope, FaCalendar, FaIdCard, FaGraduationCap, FaCertificate } from 'react-icons/fa';
import { getDosenDetailAPI } from '../../mock/authService';
import { StateDisplay } from '../../components/ui/StateDisplay';
import { User } from '../../types/auth';

interface DosenDetailData {
  id: string;
  nama: string;
  jabatan: string;
  jurusan: string;
  jenjang_akademik?: string;
  no_sertifikat?: string;
  nidn?: string;
  nim: string;
  no_telepon: string;
  thn_masuk: string;
  tgl_lahir: string;
  foto?: string;
}

export default function DetailDosen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [dosenDetails, setDosenDetails] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDosenDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (id) {
          const response = await getDosenDetailAPI(id);
          if (response) {
            setDosenDetails(response);
          } else {
            setError('Data dosen tidak ditemukan');
          }
        } else {
          setError('ID dosen tidak valid');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data dosen');
        toast.error('Gagal memuat data dosen');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDosenDetails();
  }, [id, location.state]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr || dateStr === '0000-00-00' || dateStr === '') {
      return '-';
    }
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const InfoRow = ({ icon: Icon, label, value, isLast = false }: { 
    icon?: any; 
    label: string; 
    value: string | number;
    isLast?: boolean;
  }) => (
    <div className={`flex items-start py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      {Icon && (
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
          <Icon className="text-blue-600 text-sm" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5 break-words">{value || '-'}</p>
      </div>
    </div>
  );

  const MenuCard = ({ icon: Icon, label, onClick, disabled = false }: { 
    icon: any; 
    label: string; 
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center p-4 rounded-xl transition-all ${
        disabled 
          ? 'bg-gray-100 opacity-60 cursor-not-allowed' 
          : 'bg-[#F1EFE6] hover:bg-[#E8E5D8] cursor-pointer'
      }`}
    >
      <Icon className={`text-xl mr-4 ${disabled ? 'text-gray-400' : 'text-[#0A1B36]'}`} />
      <span className="flex-1 text-base font-semibold text-gray-800">{label}</span>
      {!disabled && (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Memuat data dosen...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <StateDisplay type="error" message={error} />
        </div>
      </DashboardLayout>
    );
  }

  if (!dosenDetails) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <StateDisplay type="empty" message="Data dosen tidak ditemukan" />
        </div>
      </DashboardLayout>
    );
  }

  const data = dosenDetails;

  return (
    <DashboardLayout>
      <div className="bg-white shadow-sm p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/data-dosen')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <button 
            onClick={() => navigate('/data-dosen')}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              {data.foto ? (
                <img  src={data.foto}  alt={data.nama}  className="w-28 h-28 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <FaUser className="w-12 h-12 text-gray-500" />
              )}
            </div>
            
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-4">{data.nama || 'Nama tidak tersedia'}</h2>
          <span className="mt-1 px-4 py-1.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
            {data.jabatan || 'Dosen'}
          </span>
        </div>

        {/* Informasi Lengkap */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-primary-gold mb-4 flex items-center gap-2">
            Informasi Lengkap
          </h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <InfoRow label="Posisi" value={data.jabatan || '-'} />
            <InfoRow label="Jurusan" value={data.jurusan || '-'} />
            <InfoRow label="Jenjang Akademik" value={data.jenjang_akademik || '-'} />
            <InfoRow label="Nomor Sertifikat Dosen" value={data.no_sertifikat || '-'} />
            <InfoRow label="NIDN" value={data.nidn || '-'} />
            <InfoRow label="Email" value={data.nim || '-'} />
            <InfoRow label="Nomor Telepon" value={data.no_telepon || '-'} />
            <InfoRow label="Tanggal Lahir" value={formatDate(data.tgl_lahir)} isLast />
          </div>
        </div>

        {/* Sertifikasi */}
        {data.no_sertifikat && data.no_sertifikat.trim() && data.no_sertifikat !== '-' && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-primary-gold mb-4 flex items-center gap-2">
              Daftar Sertifikasi
            </h3>
            <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-gray-300 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <FaCertificate className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{data.no_sertifikat}</p>
                <p className="text-sm text-gray-500">Sertifikat Dosen</p>
              </div>
            </div>
          </div>
        )}

        {/* Tri Dharma */}
        <div>
          <h3 className="text-lg font-bold text-primary-gold mb-4 flex items-center gap-2">
            Tri Dharma
          </h3>
          <div className="space-y-3">
            <MenuCard 
              icon={FaSchool}
              label="Pembelajaran"
              onClick={() => {
                navigate(`/tri-dharma/pembelajaran/${data.id}`);
              }}
            />
            <MenuCard 
              icon={FaFlask}
              label="Penelitian"
              onClick={() => {
                toast.info('Fitur Penelitian akan segera hadir');
                // navigate(`/dosen/${data.id}/penelitian`, { state: { dosen: data } });
              }}
            />
            <MenuCard 
              icon={FaUsers}
              label="Pengabdian Kepada Masyarakat"
              onClick={() => {
                toast.info('Fitur Pengabdian akan segera hadir');
              }}
              disabled
            />
            <MenuCard 
              icon={FaStar}
              label="Penunjang"
              onClick={() => {
                toast.info('Fitur Penunjang akan segera hadir');
              }}
              disabled
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}