import RequireAuth from "@/app/utils/auth/require-auth";
import ConfigSidebar from "@/app/components/dash/configuracion/config-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function ConfiguracionLayout({ children }: Props) {
  return (
    <RequireAuth allowedRoles={["Administrador"]}>
      <div className="-m-6 min-h-[calc(100vh-56px)] flex relative overflow-hidden w-[calc(100%+3rem)]">
        <ConfigSidebar />
        {/* offset por el sidebar fijo en desktop */}
        <main className="flex-1 md:ml-60 min-h-[calc(100vh-56px)] bg-white p-6 sm:p-8 w-full">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}