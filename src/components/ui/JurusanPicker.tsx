import { useMemo, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from './Breadcrumb';
import { StateDisplay } from './StateDisplay';
import { jurusanData } from '../../mock/db';

interface JurusanPickerProps {
    basePath: string;
    title: string;
    description: string;
    breadcrumbLabel: string;
}
export default function JurusanPicker({ basePath, title, description, breadcrumbLabel }: JurusanPickerProps) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    // const {data, loading, error} = useFetchData({ fetchFn: getJurusan, dependencies: []});
    const filteredJurusan = useMemo(() => {
        return jurusanData.filter((j) => j.nama.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    return (
        <DashboardLayout>
            <Breadcrumb items={[{ label: breadcrumbLabel }, { label: "Jurusan", isActive: true },]} />
            <div className='bg-dark-navy rounded-2xl px-8 py-8 mb-8'>
                <h1 className='text-2xl font-semibold text-white'>{title}</h1>
                <p className="text-light-blue mt-2">{description}</p>
            </div>
            <input type="text" placeholder='Cari jurusan...' value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 bg-white rounded px-4 h-11 w-full mb-6 focus:outline-none focus:border-border-gold" />

            {filteredJurusan.length === 0 ? (
                <StateDisplay type='empty' message='Jurusan tidak ditemukan' />
            ) : (
                <div className="bg-white rounded-2xl border border-border-gold divide-y divide-border-gold ">
                    {filteredJurusan.map((j) => (
                        <div key={j.id} onClick={() => navigate(`${basePath}/${j.id}`)}
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
