import { Role } from "../types/auth";

type MenuItem = {
    label: string;
    path: string;
    allowedRoles: Role[];
    icon? : string;
    isSection?: boolean;
    children?: MenuItem[];
};

export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
        allowedRoles: ["dekan", "kaprodi", "lppm", "tata-usaha", "dosen", "admin"],
    },
    {
        label: "Tri Dharma",
        path: "/tri-dharma",
        isSection: true,
        allowedRoles: ["dekan", "kaprodi", "tata-usaha", "lppm", "dosen"],
        children: [
            { label: "Pembelajaran", path: "/tri-dharma/pembelajaran", icon: "book", allowedRoles: ["dekan", "kaprodi", "tata-usaha", "lppm", "dosen"] },
            { label: "Penelitian",   path: "/tri-dharma/penelitian", icon: "search",  allowedRoles: ["dekan", "kaprodi", "lppm", "dosen"] },
            { label: "PKM",          path: "/tri-dharma/pkm", icon: "group",         allowedRoles: ["dekan", "kaprodi", "lppm", "dosen"] },
            { label: "Penunjang",    path: "/tri-dharma/penunjang", icon: "inbox",    allowedRoles: ["dekan", "kaprodi", "lppm", "dosen"] },
        ],
    },
    {
        label: "Others",
        path: "",
        isSection: true,
        allowedRoles: ["dekan", "kaprodi", "lppm", "dosen"],
        children: [
            { label: "Data Dosen", path: "/data-dosen", icon: "user", allowedRoles: ["dekan", "dosen", "kaprodi", "lppm", "tata-usaha"],},
            { label: "Kelola Member", path: "/kelola-member", icon: "user", allowedRoles: ["admin"], },
        ]
    },
    
    {
        label: "Admin",
        path: "/admin",
        isSection: true,
        allowedRoles: ["admin"],
        children: [
            { label: "Data Kelas",       path: "/admin/kelas", icon: "layout",      allowedRoles: ["admin"] },
            { label: "Data Mata Kuliah", path: "/admin/mata-kuliah", icon: "book", allowedRoles: ["admin"] },
            { label: "Data Semester",    path: "/admin/semester", icon: "calendar",   allowedRoles: ["admin"] },
        ],
    },
];