import TemaClient from "@/app/components/plataforma/tema-client";

export default async function TemaPage({
  params,
}: {
  params: Promise<{ id: string; temaId: string }>;
}) {
  const { id, temaId } = await params;
  return <TemaClient cursoId={parseInt(id)} temaId={parseInt(temaId)} />;
}