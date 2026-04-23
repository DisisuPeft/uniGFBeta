import RequireAuth from "@/app/utils/auth/require-auth";
import AsideCurso from "@/app/components/plataforma/aside-left-curso";
import AsideRigthCurso from "@/app/components/plataforma/aside-rigth-curso";
interface Children {
  children: React.ReactNode;
  params: Promise<{ ref: string; slug: string }>;
}
export default async function Layout({ children, params }: Children) {
  const allowedRoles = ["Estudiante", "Guest"];
  const { ref, slug } = await params;
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <div className="h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center h-14 px-4 gap-4">
            {/* Search in course */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder={`Buscar en el ${slug}`}
                className="flex-1 h-9 px-3 border border-gray-300 rounded-l-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0056D2] bg-white"
              />
              <button className="h-9 px-4 bg-[#0056D2] text-white text-sm font-semibold rounded-r-md hover:bg-[#004BB5] transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </header>
        <div className="flex">
          <AsideCurso id={ref} slug={slug} />
          {/* Center Content */}
          <main className="flex-1 min-w-0 border-r border-gray-200">
            {children}
          </main>
          {/* Right Sidebar - Learning Plan + Timeline */}
          <AsideRigthCurso id={ref} slug={slug} />
        </div>
      </div>
    </RequireAuth>
  );
}
