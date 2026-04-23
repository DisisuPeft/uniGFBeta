import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/dash/nav-bar";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  return (
    <RequireAuth allowedRoles={["Administrador", "Vendedor", "Tutor"]}>
      <div className="h-screen bg-white">
        {/* Navbar */}
        <Navbar />
        <div className="flex-1 flex flex-col">
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
