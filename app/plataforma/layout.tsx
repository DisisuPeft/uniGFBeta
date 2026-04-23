import RequireAuth from "../utils/auth/require-auth";
import Navbar from "../components/plataforma/nav-bar";

interface Children {
  children: React.ReactNode;
}
export default function Layout({ children }: Children) {
  const allowedRoles = ["Estudiante", "Guest"];
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="h-screen bg-white">
        {/* Navbar */}
        <Navbar />
        {/* <PlataformaEducativa /> */}
        <main className="p-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
