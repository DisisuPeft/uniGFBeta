import RequireAuth from "@/app/utils/auth/require-auth";
import ConfigSidebar from "@/app/components/dash/configuracion/config-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function ConfiguracionLayout({ children }: Props) {
  return (
    <RequireAuth allowedRoles={["Administrador"]}>
      <div className="min-h-[calc(100vh-56px)]">
        <ConfigSidebar />
        {/* offset por el sidebar fijo en desktop */}
        <main className="md:ml-60 min-h-[calc(100vh-56px)] bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}