import DashboardLayout from "../../layouts/DashboardLayout";
import JurusanPicker from "../../components/ui/JurusanPicker"

export default function PilihJurusanPenunjang() {
    return (
        <JurusanPicker
            basePath="/tri-dharma/penunjang"
            title="Penunjang"
            description="Pilih Jurusan untuk melihat penunjang"
            breadcrumbLabel="Penunjang" />
    )
}