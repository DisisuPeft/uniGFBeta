import CursoAside from "@/app/components/dash/cursos/detail/curso-aside";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CursoDetailLayout({ children, params }: Props) {
  const { id } = await params;

  return (
    <div className="-m-6 flex h-[calc(100vh-56px)]">
      <CursoAside cursoId={Number(id)} />
      <main className="flex-1 min-w-0 overflow-y-auto border-l border-gray-100">
        {children}
      </main>
    </div>
  );
}
