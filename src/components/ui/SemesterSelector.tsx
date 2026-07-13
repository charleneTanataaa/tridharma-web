import { semesters } from "../../mock/db";

interface SemesterSelectorProps {
    value: string;
    onChange: (id: string) => void;
    className?: string;
}

export default function SemesterSelector({ value, onChange, className }: SemesterSelectorProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`border bg-medium-navy rounded-xl border-light-blue w-full lg:w-110 h-10 text-white focus:outline-none ${className ?? ""}`}>
            {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>{semester.label}</option>
            ))}
        </select>
    )
}