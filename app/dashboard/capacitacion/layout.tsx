import RequireAuth from "@/app/utils/auth/require-auth";
import CapacitacionSidebar from "@/app/components/dash/capacitacion/capacitacion-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function CapacitacionLayout({ children }: Props) {
  return (
    <RequireAuth allowedRoles={["Administrador"]}>
      <div className="-m-6 min-h-[calc(100vh-56px)] flex relative overflow-hidden w-[calc(100%+3rem)]">
        <CapacitacionSidebar />
        <main className="flex-1 md:ml-60 min-h-[calc(100vh-56px)] bg-white p-6 sm:p-8 w-full">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}