import { useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout';
import { useState } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { FaPlus } from 'react-icons/fa6';
import AddSemesterModal from '../../components/ui/TambahSemester';
import { useAuthStore } from '../../stores/auth.store';
import { toast } from 'sonner';
import { jurusanData, semesters } from '../../mock/db';
import SemesterSelector from '../../components/ui/SemesterSelector';
import { useFetchData } from '../../hooks/useFetchData';
import { getMatkulByJurusan } from '../../mock/authService';
import MatkulList from '../../components/ui/pembelajaran/MatkulList';
import TambahMataKuliah from '../../components/ui/data-dosen/TambahMataKuliah';
export default function PembelajaranJurusan() {
  const { jurusanId } = useParams();
  const user = useAuthStore((state) => state.user);
  const isTataUsaha = user?.jabatan === 'tata-usaha';
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [showAddMatkulModal, setShowAddMatkulModal] = useState(false);
  const [showAddKelasModal, setShowAddKelasModal] = useState(false);

  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(semesters[0]?.id ?? "s1");

  const jurusanIdNum = Number(jurusanId);
  const jurusan = jurusanData.find((j) => j.id === jurusanIdNum);
  const { data, loading, error } = useFetchData({
    fetchFn: () => getMatkulByJurusan(jurusanIdNum, selectedSemesterId, search),
    dependencies: [jurusanIdNum, selectedSemesterId, search],
  });

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
        <div className='flex flex-col lg:flex-row gap-5  mt-5  items-center'>
          <SemesterSelector value={selectedSemesterId} onChange={setSelectedSemesterId} className="mt-5" />
          {
            isTataUsaha && (
              <>
                <button onClick={() => setShowAddSemesterModal(true)} className="flex justify-center hover:scale-102 transition w-full md:w-fit md:justify-start items-center font-medium bg-primary-gold gap-2 text-dark-navy rounded-lg px-2 py-3 text-xs">
                  <FaPlus /> Tambah Semester Baru
                </button>
                <button onClick={() => setShowAddKelasModal(true)} className="flex justify-center hover:scale-102 transition w-full md:w-fit md:justify-start items-center font-medium bg-primary-gold gap-2 text-dark-navy rounded-lg px-2 py-3 text-xs">
                  <FaPlus /> Tambah Kelas Baru
                </button>
                <button onClick={() => setShowAddMatkulModal(true)} className="flex justify-center hover:scale-102 transition w-full md:w-fit md:justify-start items-center font-medium bg-primary-gold gap-2 text-dark-navy rounded-lg px-2 py-3 text-xs">
                  <FaPlus /> Tambah Mata Kuliah
                </button>
              </>
            )}
        </div>
      </div>

      <h2 className='font-semibold text-xl text-primary-text mb-3'>
        Daftar Mata kuliah
      </h2>

      <div className='flex flex-col md:flex-row gap-3 items-center  mb-3'>
        <input type="text" placeholder="Cari mata kuliah..." value={search} onChange={(e) => setSearch(e.target.value)} className='border bg-white border-gray-300 rounded px-4 h-11 w-full  focus:outline-none focus:border-primary-gold' />
      </div>

      <MatkulList matkul={data?.matakuliah ?? []} loading={loading} error={error} emptyMessage='Belum ada mata kuliah pada jurusan ini' onSelect={(m) => navigate(`/tri-dharma/pembelajaran/${jurusanIdNum}/${m.id}`)} />

      {showAddSemesterModal && (
        <AddSemesterModal open={true} onClose={() => setShowAddSemesterModal(false)} />
      )}

      {showAddMatkulModal && (
        <TambahMataKuliah open={true} onClose={() => setShowAddMatkulModal(false)} onSubmit={() => { toast("Tambah mata kuliah clicked!") }} />
      )}

      {showAddKelasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white border border-border-gold shadow-xl">
            <div className="flex items-center justify-between  px-6 pt-10 pb-6">
              <h2 className='font-semibold text-primary-text text-lg'>Tambah Kelas Baru</h2>
              <button type='button' className='text-gray-400 hover:text-gray-600' onClick={() => setShowAddKelasModal(false)}>✕</button>
            </div>

            <form action="" className='space-y-6 px-6'>
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Informasi Kelas
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Tahun
                    </label>
                    <input type="number" placeholder='23' required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Kode Jurusan
                    </label>
                    <input type="text" placeholder='TI' className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nomor Kelas
                    </label>
                    <input type="number" placeholder='2' className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Jurusan
                    </label>
                    <select name="" id="" required className='w-full p-2'>
                      <option value="informatika">Informatika</option>
                      <option value="si">Sistem Informasi</option>
                      <option value="akuntansi">Akuntansi</option>
                    </select>
                  </div>
                  <button type="submit" className='mb-6 bg-primary-gold w-full p-2 rounded text-white font-semibold'>Tambah Kelas</button>

                </div>
              </section>
            </form>

          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
