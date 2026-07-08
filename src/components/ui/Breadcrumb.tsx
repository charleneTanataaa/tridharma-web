import { MdKeyboardArrowRight } from "react-icons/md";

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

interface BreadcrumbProps{
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items}: BreadcrumbProps) {
    return(
        <div className="flex gap-2 text-xs lg:text-md items-center pb-3">
            { items.map((item, index) => (
                <div className="flex items-center gap-2" key={index}>
                    <span className={`${ item.isActive ? "text-primary-gold" : ""} ${ item.onClick ? "hover:underline cursor-pointer transition" : ""}`}
                    onClick={item.onClick}>
                        {item.label}
                    </span>
                    {index < items.length - 1 && <MdKeyboardArrowRight/>}
                </div>
            ))}
        </div>
    )
}