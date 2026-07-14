import Breadcrumb from "../../components/ui/Breadcrumb";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { jurusanData } from "../../mock/db";

export default function PKMJurusan() {
    const navigate = useNavigate();
    const { jurusanId } = useParams<{ jurusanId?: string }>();
    const jurusanIdNum = Number(jurusanId);
    const jurusan = jurusanData.find((j) => j.id === jurusanIdNum);
    return (
        <DashboardLayout>
            <Breadcrumb items={[
                { label: "PKM", onClick: () => navigate("/tri-dharma/pkm") },
                { label: "Jurusan", onClick: () => navigate("/tri-dharma/pkm/jurusan") },
                { label: jurusan?.nama ?? "...", isActive: true },
            ]} />
        </DashboardLayout>
    )
}