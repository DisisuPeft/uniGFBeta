import CursoModuloView from "@/app/components/dash/cursos/detail/curso-modulo";

interface Props {
  params: Promise<{ id: string; moduloId: string }>;
}

export default async function ModuloPage({ params }: Props) {
  const { id, moduloId } = await params;
  return <CursoModuloView cursoId={Number(id)} moduloId={Number(moduloId)} />;
}
