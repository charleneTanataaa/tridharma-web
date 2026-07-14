import { Role } from "../types/auth";

type MenuItem = {
    label: string;
    path: string;
    allowedRoles: Role[];
    icon?: string;
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
        allowedRoles: ["dekan", "kaprodi", "prodi", "tata-usaha", "lppm", "dosen"],
        children: [
            { path: "/tri-dharma/pembelajaran", label: "Pembelajaran", icon: "book", allowedRoles: ["dosen"], },
            { path: "/tri-dharma/penelitian", label: "Penelitian", icon: "search", allowedRoles: ["dosen"] },
            { path: "/tri-dharma/pkm", label: "PKM", icon: "search", allowedRoles: ["dosen"] },
            { path: "/tri-dharma/penunjang", label: "Penunjang", icon: "search", allowedRoles: ["dosen"] },
            // selain dosen: lewat jurusan dulu
            { label: "Pembelajaran", path: "/tri-dharma/pembelajaran/jurusan", icon: "book", allowedRoles: ["dekan", "kaprodi", "prodi", "tata-usaha"], },
            { label: "Penelitian", path: "/tri-dharma/penelitian/jurusan", icon: "search", allowedRoles: ["dekan", "prodi", "kaprodi", "tata-usaha", "lppm"] },
            { label: "PKM", path: "/tri-dharma/pkm/jurusan", icon: "group", allowedRoles: ["dekan", "prodi", "kaprodi", "tata-usaha", "lppm"] },
            { label: "Penunjang", path: "/tri-dharma/penunjang/jurusan", icon: "inbox", allowedRoles: ["dekan", "prodi", "kaprodi", "tata-usaha", "lppm"] },
        ],
    },
    {
        label: "Others",
        path: "",
        isSection: true,
        allowedRoles: ["dekan", "prodi", "kaprodi", "lppm", "dosen", "tata-usaha"],
        children: [
            { label: "Data Dosen", path: "/data-dosen", icon: "user", allowedRoles: ["dekan", "prodi", "kaprodi", "lppm", "tata-usaha"], },
            { label: "Kelola Member", path: "/kelola-member", icon: "user", allowedRoles: ["admin"], },
        ]
    },

    {
        label: "Admin",
        path: "/admin",
        isSection: true,
        allowedRoles: ["admin"],
        children: [
            { label: "Data Kelas", path: "/admin/kelas", icon: "layout", allowedRoles: ["admin"] },
            { label: "Data Mata Kuliah", path: "/admin/mata-kuliah", icon: "book", allowedRoles: ["admin"] },
            { label: "Data Semester", path: "/admin/semester", icon: "calendar", allowedRoles: ["admin"] },
        ],
    },
];