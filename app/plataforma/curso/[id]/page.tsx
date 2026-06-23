import CursoOverviewClient from "@/app/components/plataforma/curso-overview-client";

export default async function CursoOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CursoOverviewClient cursoId={parseInt(id)} />;
}