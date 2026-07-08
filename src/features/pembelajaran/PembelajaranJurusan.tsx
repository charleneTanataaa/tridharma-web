import { useNavigate, useParams } from 'react-router-dom'
import { jurusan as jurusanList } from './PilihJurusan';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useMemo, useState } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { StateDisplay } from '../../components/ui/StateDisplay';
import { FaPlus } from 'react-icons/fa6';
import AddSemesterModal from '../../components/ui/TambahSemester';
import TambahMataKuliah from '../../components/ui/TambahMataKuliah';
import { useAuthStore } from '../../stores/auth.store';

export const matkulList = [
  { id: 1, nama: "Matematika Diskrit", kode: "IF2204", jurusan_id: 1, sks: 3, semester_id: 1},
  { id: 2, nama: "Struktur Data", kode: "IF2205", jurusan_id: 1, sks: 3, semester_id: 1 },
  { id: 3, nama: "Pemrograman Web", kode: "IF2210", jurusan_id: 1, sks: 3, semester_id: 1 },
  { id: 4, nama: "Basis Data", kode: "SI2101", jurusan_id: 2, sks: 3, semester_id: 1 },
  { id: 5, nama: "Analisis Sistem Informasi", kode: "SI2205", jurusan_id: 2, sks: 3, semester_id: 2 },
  { id: 6, nama: "Akuntansi Keuangan", kode: "AK1101", jurusan_id: 3, sks: 3, semester_id: 2 },
  { id: 7, nama: "Pemrograman Web II", kode: "IF2021", jurusan_id: 1, sks: 3, semester_id: 2 },
]
export const semesterList = [
  { id: 1, nama: "Semester Genap 2025" },
  { id: 2, nama: "Semester Ganjil 2025"},
]

export default function PembelajaranJurusan() {
  const {jurusanId} = useParams();
  const user = useAuthStore();
  const isTataUsaha = (user.user?.jabatan === 'tata-usaha');
  const navigate = useNavigate();
  const [ search, setSearch ] = useState("")
  const [ showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [ showAddMatkulModal, setShowAddMatkulModal] = useState(false);
  const [ selectedSemesterId, setSelectedSemesterId ] = useState<number>(semesterList[0]?.id ?? 0);

  const jurusanIdNum = Number(jurusanId);
  const jurusan = jurusanList.find((j) => j.id === jurusanIdNum);
  const filteredMatkul = useMemo(() => {
    return matkulList
    .filter((m) => m.jurusan_id === jurusanIdNum)
    .filter((m) => m.semester_id === selectedSemesterId)
    .filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()));
  }, [jurusanIdNum, search, selectedSemesterId]);
  
  return (
      <DashboardLayout>
        <Breadcrumb items={[
          { label: "Pembelajaran", onClick: () => navigate("/tri-dharma/pembelajaran") },
          { label: "Jurusan", onClick: () => navigate("/tri-dharma/pembelajaran/jurusan") },
          { label: jurusan?.nama ?? "...", isActive: true },
        ]} />
        <div className='bg-dark-navy rounded-2xl px-8 py-8 mb-8'>
          <h1 className="text-2xl font-semibold text-white">{jurusan?.nama ?? "Jurusan"}</h1>
          <p className="text-light-blue mt-2">Daftar mata kuliah pada jurusan ini.</p>
          <div className='flex flex-col md:flex-row gap-5  mt-5  items-center'>
            <select value={selectedSemesterId} onChange={(e) => setSelectedSemesterId(Number(e.target.value))} 
            className="border bg-medium-navy rounded-xl border-light-blue w-full lg:w-110 h-10  text-white focus:outline-none">
              {semesterList.map((s) => (
                <option value={s.id} key={s.id}>{s.nama}</option>
              ))}
            </select>
            { 
            isTataUsaha && (
              <button onClick={() => setShowAddSemesterModal(true)} className="flex justify-center w-full md:w-fit md:justify-start items-center font-medium bg-primary-gold gap-2 text-dark-navy rounded-lg px-2 py-3 text-xs">
                <FaPlus /> Tambah Semester Baru
              </button>
              )
            }
            
          </div>
          
          
        </div>

        <div className='flex flex-col md:flex-row gap-3 items-center  mb-3'>
          <input type="text" placeholder="Cari mata kuliah..." value={search} onChange={(e) => setSearch(e.target.value)} className='border bg-white border-gray-300 rounded px-4 h-11 w-full  focus:outline-none focus:border-primary-gold' />
          
        </div>
        {filteredMatkul.length === 0 ? (
          <StateDisplay type='empty' message='Belum ada mata kuliah pada jurusan ini'/>
        ) : (
          <div className="bg-white rounded-2xl border border-card-cream divide-y divide-card-cream">
            {filteredMatkul.map((m) => (
              <div key={m.id} onClick={() => navigate(`/tri-dharma/pembelajaran/${jurusanIdNum}/${m.id}`)} className="flex justify-between items-center px-6 py-4 cursor-pointer transition">
                <div>
                  <p className="font-semibold">{m.nama}</p>
                  <p className="text-sm text-gray-500">{m.kode}</p>
                </div>
                <p className="text-sm text-gray-500">{m.sks} SKS</p>
              </div>
            ))}
          </div>
        )}
        { showAddSemesterModal && (
          <AddSemesterModal open={true} onClose={() => setShowAddSemesterModal(false)} />
        )}

        { showAddMatkulModal && (
          <TambahMataKuliah open={true} onClose={() => setShowAddMatkulModal(false)}/>
        )}
      </DashboardLayout>
  )
}
