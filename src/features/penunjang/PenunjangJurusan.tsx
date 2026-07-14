import Breadcrumb from "../../components/ui/Breadcrumb";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function PenunjangJurusan() {
    const navigate = useNavigate();
    const { jurusanId } = useParams<{ jurusanId?: string }>();
    return (
        <DashboardLayout>
            <Breadcrumb items={[
                { label: "Penunjang", onClick: () => navigate("/tri-dharma/penunjang") },
                { label: "Jurusan", onClick: () => navigate("/tri-dharma/penunjang/jurusan") },
                { label: jurusanId ?? "...", isActive: true },
            ]} />
        </DashboardLayout>
    )
}