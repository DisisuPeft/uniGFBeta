import EvaluacionClient from "@/app/components/plataforma/evaluacion-client";

export default async function EvaluacionPage({
  params,
}: {
  params: Promise<{ id: string; evalId: string }>;
}) {
  const { id, evalId } = await params;
  return <EvaluacionClient cursoId={parseInt(id)} evalId={parseInt(evalId)} />;
}