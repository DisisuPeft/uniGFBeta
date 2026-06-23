import RequireAuth from "@/app/utils/auth/require-auth";
import CapacitacionSidebar from "@/app/components/dash/capacitacion/capacitacion-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function CapacitacionLayout({ children }: Props) {
  return (
    <RequireAuth allowedRoles={["Administrador"]}>
      <div className="min-h-[calc(100vh-56px)]">
        <CapacitacionSidebar />
        <main className="md:ml-60 min-h-[calc(100vh-56px)] bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}