"use client";

import { useGetEvaluacionQuery } from "@/redux/features/capacitacion/plataformaApiSlice";
import EvaluacionViewer from "@/app/components/plataforma/evaluacion-viewer";

export default function EvaluacionClient({
  cursoId,
  evalId,
}: {
  cursoId: number;
  evalId: number;
}) {
  const { data: evaluacion, isLoading } = useGetEvaluacionQuery(evalId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!evaluacion) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <EvaluacionViewer cursoId={cursoId} evaluacion={evaluacion} />
    </div>
  );
}