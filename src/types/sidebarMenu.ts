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
        allowedRoles: ["dekan", "kaprodi", "lppm", "tata-usaha", "prodi", "dosen", "admin"],
    },
    {
        label: "Tri Dharma",
        path: "/tri-dharma",
        isSection: true,
        allowedRoles: ["dekan", "kaprodi", "prodi", "tata-usaha", "lppm", "dosen", "dosen-tetap"],
        children: [
            { path: "/tri-dharma/pembelajaran", label: "Pembelajaran", icon: "book", allowedRoles: ["dosen", "dosen-tetap"], },
            // selain dosen: lewat jurusan dulu
            { path: "/tri-dharma/pembelajaran/jurusan", label: "Pembelajaran", icon: "book", allowedRoles: ["dekan", "kaprodi", "prodi", "tata-usaha"], },
            { label: "Penelitian",   path: "/tri-dharma/penelitian", icon: "search",  allowedRoles: ["dekan", "prodi", "kaprodi", "tata-usaha", "lppm", "dosen"] },
            { label: "PKM",          path: "/tri-dharma/pkm", icon: "group",         allowedRoles: ["dekan", "prodi", "kaprodi", "tata-usaha", "lppm", "dosen"] },
            { label: "Penunjang",    path: "/tri-dharma/penunjang", icon: "inbox",    allowedRoles: ["dekan", "prodi", "kaprodi", "tata-usaha", "lppm", "dosen"] },
        ],
    },
    {
        label: "Others",
        path: "",
        isSection: true,
        allowedRoles: ["dekan", "prodi", "kaprodi", "lppm", "dosen", "tata-usaha", "dosen-tetap"],
        children: [
            { label: "Data Dosen", path: "/data-dosen", icon: "user", allowedRoles: ["dekan", "prodi", "dosen", "kaprodi", "lppm", "tata-usaha"],},
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