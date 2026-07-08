import Sidebar from '../components/ui/SideBar';
import NavBar from '../components/ui/NavBar';

export default function DashboardLayout({ children }) {
  return (
    <div
    className='flex h-screen h-screen bg-primary-cream'
    >
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <NavBar />
        <main className='flex-1 overflow-y-auto p-6 lg:p-10'>
          {children}
        </main>
      </div>
    </div>
  );
}