export default function AuthLayout({ children }) {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#0B1F3A] overflow-hidden">
      <div className="absolute -top-40 -right-40 rounded-full w-150 h-150 bg-primary-gold/20"/>
      <div className="absolute -bottom-40 -left-40 rounded-full w-150 h-150 bg-primary-gold/20"/>

      <div className="relative bg-white py-12 px-8 rounded-3xl w-[643px] z-10">
        {children}
      </div>
    </div>
  );
}