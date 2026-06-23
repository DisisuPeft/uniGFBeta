import CursoSidebar from "@/app/components/plataforma/curso-sidebar";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CursoLayout({ children, params }: Props) {
  const { id } = await params;
  const cursoId = parseInt(id);

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <CursoSidebar cursoId={cursoId} />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}