import JurusanPicker from '../../components/ui/JurusanPicker';

export default function PilihJurusan() {
    return (
        <>
            <JurusanPicker
                basePath="/tri-dharma/pembelajaran"
                title="Pembelajaran"
                breadcrumbLabel="Pembelajaran"
                description="Pilih jurusan untuk mengelola mata kuliah, jadwal, dan dosen pengampu."
            />
        </>
    );
}