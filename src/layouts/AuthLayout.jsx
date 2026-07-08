export default function AuthLayout({ children }) {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#0B1F3A] overflow-hidden">
      <div className="hidden lg:block absolute -top-40 -right-40 rounded-full w-150 h-150 bg-primary-gold/20"/>
      <div className="hidden lg:block absolute -bottom-40 -left-40 rounded-full w-150 h-150 bg-primary-gold/20"/>
      <div className="relative bg-white py-12 px-5 lg:px-8 mx-10 rounded-3xl w-[500px] max-h-[90vh] overflow-y-auto overscroll-container lg:w-[643px] z-10">
        {children}
      </div>
    </div>
  );
}