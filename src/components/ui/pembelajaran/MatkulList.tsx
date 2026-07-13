import { MataKuliah } from "../../../mock/db";
import { StateDisplay } from "../StateDisplay";
import MatkulListItem from "./MatkulListItem";

interface MatkulListProps {
    matkul: MataKuliah[];
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    onSelect: (matkul: MataKuliah) => void;
}

export default function MatkulList({ matkul, loading, error, emptyMessage = "Belum ada mata kuliah", onSelect }: MatkulListProps) {
    if (loading) return <StateDisplay type="loading" />
    if (error) return <StateDisplay type="error" message={error} />
    if (matkul.length === 0) return <StateDisplay type="empty" message={emptyMessage} />

    return (
        <div className="bg-white rounded-2xl border border-card-cream divide-y divide-card-cream">
            {matkul.map((m) => (
                <MatkulListItem key={m.id} matkul={m} onClick={() => onSelect(m)} />
            ))}
        </div>
    )
}