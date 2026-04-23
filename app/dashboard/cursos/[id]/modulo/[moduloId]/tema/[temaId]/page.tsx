import CursoTema from "@/app/components/dash/cursos/detail/curso-tema";

interface Props {
  params: Promise<{ id: string; moduloId: string; temaId: string }>;
}

export default async function TemaPage({ params }: Props) {
  const { id, moduloId, temaId } = await params;
  return (
    <CursoTema
      cursoId={Number(id)}
      moduloId={Number(moduloId)}
      temaId={Number(temaId)}
    />
  );
}
