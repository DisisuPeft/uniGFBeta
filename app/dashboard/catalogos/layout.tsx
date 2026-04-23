import RequireAuth from "@/app/utils/auth/require-auth";
import TabsPanelWrapper from "@/app/components/dash/menu-tabs";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  const allowedRoles = ["Administrador"];
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="w-full">
        {/* Client Component solo para las tabs */}
        <TabsPanelWrapper />

        {/* El contenido sigue siendo Server Component por defecto */}
        <main className="mt-6 bg-white p-12 font-serif">{children}</main>
      </div>
    </RequireAuth>
  );
}
