import React, { useMemo, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { useFetchData } from '../../hooks/useFetchData';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { StateDisplay } from '../../components/ui/StateDisplay';

export const jurusan = [
    { 
        id: 1,
        nama: "Informatika",
        jumlahMatkul: 42,
    },
    {
        id: 2,
        nama: "Sistem Informasi",
        jumlahMatkul: 38
    },
    {
        id: 3,
        nama: "Akuntansi",
        jumlahMatkul: 38
    },
    {
        id: 4,
        nama: "Hukum",
        jumlahMatkul: 22
    },
    {
        id: 5,
        nama: "Manajemen",
        jumlahMatkul: 21
    },
    {
        id: 6,
        nama: "Hospitality",
        jumlahMatkul: 20
    },
]


export default function PilihJurusan() {
    const navigate = useNavigate();
    const[search, setSearch] = useState("");
    // const {data, loading, error} = useFetchData({ fetchFn: getJurusan, dependencies: []});
    const filteredJurusan = useMemo(() => {
         return jurusan.filter((j) => j.nama.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

  return (
    <DashboardLayout>
        <Breadcrumb items={[ { label: "Pembelajaran" }, { label: "Jurusan", isActive: true}, ]}/>
        <div className='bg-dark-navy rounded-2xl px-8 py-8 mb-8'>
            <h1 className='text-2xl font-semibold text-white'>Pembelajaran</h1>
            <p className="text-light-blue mt-2">Pilih jurusan untuk mengelola mata kuliah, jadwal, dan dosen pengampu.</p>
        </div>
        <input type="text" placeholder='Cari jurusan...' value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 bg-white rounded px-4 h-11 w-full mb-6 focus:outline-none focus:border-border-gold" />

        {filteredJurusan.length === 0 ? (
            <StateDisplay type='empty' message='Jurusan tidak ditemukan '/>
        ) : (
            <div className="bg-white rounded-2xl border border-border-gold divide-y divide-border-gold ">
                {filteredJurusan.map((j) => (
                    <div key={j.id} onClick={() => navigate(`/tri-dharma/pembelajaran/${j.id}`)}
                    className='flex justify-between items-center px-6 py-4 cursor-pointer  transition'>
                        <p className="font-medium">{j.nama}</p>
                        <p className="text-sm text-gray-500">{j.jumlahMatkul}</p>
                    </div>
                ))}
            </div>
        )}
    </DashboardLayout>
  )
}
