import { useNavigate, useParams } from "react-router-dom"
import Breadcrumb from "../../components/ui/Breadcrumb"
import DashboardLayout from "../../layouts/DashboardLayout"

export default function PKM() {
    const navigate = useNavigate();
    const { dosenId } = useParams<{ dosenId?: string }>();
    return (
        <DashboardLayout>
            <Breadcrumb items={dosenId
                ? [
                    { label: "Data Dosen", onClick: () => navigate(`/data-dosen/${dosenId}`) },
                    { label: "PKM", isActive: true }
                ]
                : [
                    { label: "PKM" },
                    { label: "Semester", isActive: true }
                ]}
            />
        </DashboardLayout>
    )
}