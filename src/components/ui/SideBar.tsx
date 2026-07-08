"use client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { menuItems } from "../../types/sidebarMenu";
import { useAuthStore } from "../../stores/auth.store";
import { Role } from "../../types/auth";
import { IconType } from "react-icons";
import {
    MdMenu, MdClose,
    MdDashboard, MdBook, MdSearch, MdGroup, MdStar, MdPerson, MdSettings, MdViewModule, MdCalendarToday, MdGroupWork,MdAllInbox,
    MdLogout,
    MdKeyboardArrowDown
    } from "react-icons/md";
import { useState } from "react";

const iconMap: Record<string, IconType> = {
  dashboard:    MdDashboard,
  book:         MdBook,
  search:       MdSearch,
  users:        MdGroup,
  group:        MdGroupWork,
  star:         MdStar,
  inbox:        MdAllInbox,
  user:         MdPerson,
  settings:     MdSettings,
  layout:       MdViewModule,
  calendar:      MdCalendarToday,
};

function NavIcon({ name }: { name?: string }) {
  if (!name) return null;
  const Icon = iconMap[name];
  return Icon ? <Icon size={18} /> : null;
}

function SidebarNav({ user, pathname, onNavigate}: {
    user: {jabatan: Role},
    pathname: string,
    onNavigate?: () => void,
}) {
    const filtered = menuItems.filter((item) => item.allowedRoles.includes(user.jabatan));
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        () => filtered.reduce((acc, item) => {
            if(item.isSection) acc[item.path] = true;
            return acc;
        }, {} as Record<string, boolean>)
    )
    const toggleSection = (path: string) => {
        setOpenSections((prev) => ({...prev, [path]: !prev[path]}));
    }
    
    return(
        <nav className="flex-1 overflow-y-auto text-[18px]">
            {filtered.map((item) => {
                if (item.isSection && item.children){
                    const visibleChildren = item.children.filter((c) => c.allowedRoles.includes(user.jabatan) );
                    if(visibleChildren.length === 0) return null;
                    const isOpen = openSections[item.path] ?? true;
                    return(
                        <div key={item.path} className="mt-4">
                            <div className="flex items-center justify-between px-5 pb-3">
                            <p className="uppercase text-light-blue font-semibold">
                                {item.label}
                            </p>
                            <button type="button" className="" onClick={() => toggleSection(item.path)}><MdKeyboardArrowDown size={20} className={`transition-transform text-white duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}/></button>
                            </div>
                            {isOpen && visibleChildren.map((child) => {
                                const isActive = pathname === child.path || pathname.startsWith(`${child.path}/`);

                                return(
                                <Link key={child.path} to={child.path} onClick={onNavigate} 
                                className={`flex items-center gap-3 px-5 py-4 transition ${
                                    isActive? "bg-medium-navy text-white" : "text-light-blue hover:bg-primary-gold hover:text-white"
                                }`}
                                >
                                    <NavIcon name={child.icon}/>
                                    {child.label}
                                </Link>
                                )
                            })}
                        </div>
                    );
                }

                const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                return (
                    <Link key ={item.path} to={item.path} onClick={onNavigate} 
                    className={`flex items-center gap-3 px-5 py-4 transition ${
                        isActive ? "bg-medium-navy text-white" : "text-muted-text hover:bg-primary-gold hover:text-white"
                    }`}>
                        <NavIcon name={item.icon} />
                        {item.label}
                    </Link>
                );
            })}        
        </nav>
    );
}
function LogoutButton({ onClick } : {onClick: () => void}){
    return(
        <div className="border-t border-muted-text">
            <button onClick={onClick} className="flex items-center justify-center gap-3 w-full px-5 py-4 text-light-blue hover:bg-primary-gold hover:text-white transition">
                <MdLogout size={24}/>
                Logout
            </button>
        </div>
    )
}
export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  if (!user) return null;

  const navigate = useNavigate();
  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <>
        {/* menu icon for when mobile */}
        <button
        onClick={() => setIsOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-40 bg-dark-navy text-white p-2 rounded ${
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
            <MdMenu size={24}/>
        </button>
        <aside className="hidden lg:flex w-64 h-screen bg-dark-navy flex-col shrink-0 text-[18px]">
            
            {/* Header */}
            <div className="px-6 py-5">
                <p className="text-white font-bold tracking-widest uppercase text-center">
                Sistem Tridharma
                </p>
            </div>
            <SidebarNav user={user} pathname={pathname}/>
            <LogoutButton onClick={handleLogout}></LogoutButton>
        </aside>

        {/* mobile */}
        {isOpen && (
        <div 
        className={`fixed inset-0 min-h-screen z-50 lg:hidden bg-dark-navy transition transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted-text">
                <p className="text-white font-bold text-sm tracking-widest uppercase">
                    Sistem Tridharma
                </p>
                <button className="text-white" onClick={() => setIsOpen(false)}>
                    <MdClose size={24}/>
                </button>
            </div>

            <SidebarNav 
            user={user} 
            pathname={pathname} 
            onNavigate={()=> setIsOpen(false)}
            />
            <LogoutButton onClick={handleLogout}></LogoutButton>

        </div>
        )}
       
    </>
  );
}