import ComentariosView from "@/app/components/plataforma/comentarios-view";

interface Props {
  params: Promise<{ ref: string }>;
}

export default async function ComentariosPage({ params }: Props) {
  const { ref } = await params;
  return <ComentariosView diplomadoId={ref} />;
}
