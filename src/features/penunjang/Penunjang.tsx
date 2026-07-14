import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Breadcrumb from "../../components/ui/Breadcrumb";

export default function Penunjang() {
    const navigate = useNavigate();
    const { dosenId } = useParams<{ dosenId?: string }>();
    return (
        <DashboardLayout>
            <Breadcrumb items={dosenId
                ? [
                    { label: "Data Dosen", onClick: () => navigate(`/data-dosen/${dosenId}`) },
                    { label: "Penunjang", isActive: true }
                ]
                : [
                    { label: "Penunjang" },
                    { label: "Semester", isActive: true }
                ]}
            />
        </DashboardLayout>
    )
}