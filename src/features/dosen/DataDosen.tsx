import DashboardLayout from "../../layouts/DashboardLayout"
import Breadcrumb from "../../components/ui/Breadcrumb";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { useEffect, useMemo, useState } from "react";
import { DosenListItem, getDosenAPI } from "../../mock/authService";
import { StateDisplay } from "../../components/ui/StateDisplay";
import { useNavigate } from "react-router-dom";

export default function DataDosen() {
  const navigate = useNavigate();
  const [ dosenList, setDosenList ] = useState<DosenListItem[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ search, setSearch ] = useState("");
  const [ filter, setFilter ]= useState("");

  useEffect(() => {
    getDosenAPI()
    .then(setDosenList)
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
  }, []);
  const filteredDosen = useMemo(() => {
    return dosenList.filter((d) => {
      const matchesSearch = d.nama.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "" 
        ? true 
        : filter === "dosen tetap"  
        ? d.jabatan?.toLowerCase() === "dosen tetap"  // "dosen tetap"
        : true; // "dosen"
        return matchesSearch && matchesFilter;
    });
  }, [dosenList, search, filter]);
  return (
    <DashboardLayout>
      <Breadcrumb items={[ {label: "Data Dosen", isActive: true} ]} />
      <div className="flex gap-2 w-full">
        <div className="flex flex-1 items-center justify-center shadow rounded bg-white gap-2 px-5 py-2 border border-primary-cream">
          <FaSearch size={16} className="shrink-0"/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" name="search" id="search" className="flex-1 outline-none cursor-pointer" placeholder="Cari nama dosen..." /> 
        </div>

        <div className="relative flex items-center gap-2 p-1 bg-white shadow rounded cursor-pointer border border-primary-cream">
          <CiFilter size={20} className="shrink-0 m-2"/>
          <select name="filter" id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="absolute inset-0 h-full opacity-0 cursor-pointer">
              <option value="">Semua</option>
              <option value="dosen">Dosen</option>
              <option value="dosen tetap">Dosen Tetap</option>
            </select>
          </div>
      </div>

      {loading && <StateDisplay type="loading" />}
      {error && <StateDisplay type="error" message={error} />}

      {!loading && !error && (
        <div className="grid gap-3 pt-5">
          {filteredDosen.length === 0 && (
            <StateDisplay type="empty" message="Tidak ditemukan."/>
          )}
          {filteredDosen.map((d) => (
            <div onClick={() => navigate(`/data-dosen/${d.id}`)} key={d.id} className="flex items-center justify-between bg-white p-4 rounded shadow border-primary-cream cursor-pointer hover:bg-gray-50 transition">
              <div>
                <p className="font-semibold">{d.nama}</p>
                <p className="text-sm text-gray-500">{d.jurusan}</p>
              </div>
              <span className="text-sm px-2 py-1 rounded bg-primary-cream">
                {d.jabatan}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
