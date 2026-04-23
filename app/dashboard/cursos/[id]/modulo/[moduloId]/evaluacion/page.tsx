import CursoEvaluacion from "@/app/components/dash/cursos/detail/curso-evaluacion";

interface Props {
  params: Promise<{ id: string; moduloId: string }>;
}

export default async function EvaluacionPage({ params }: Props) {
  const { id, moduloId } = await params;
  return <CursoEvaluacion cursoId={Number(id)} moduloId={Number(moduloId)} />;
}
