import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/plataforma/nav-bar";
import CapacitacionSidebar from "../components/dash/capacitacion/capacitacion-sidebar";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  const allowedRoles = ["Colaborador", "Guest"];
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="h-screen bg-white flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        <div className="flex-1 flex relative overflow-hidden">
          {/* Sidebar */}
          <CapacitacionSidebar />
          
          {/* Contenido principal al lado del sidebar */}
          <main className="flex-1 md:ml-60 overflow-y-auto bg-[#F9FAFB]">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
