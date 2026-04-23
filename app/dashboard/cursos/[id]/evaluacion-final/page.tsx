import CursoEvaluacionFinal from "@/app/components/dash/cursos/detail/curso-evaluacion-final";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EvaluacionFinalPage({ params }: Props) {
  const { id } = await params;
  return <CursoEvaluacionFinal cursoId={Number(id)} />;
}
