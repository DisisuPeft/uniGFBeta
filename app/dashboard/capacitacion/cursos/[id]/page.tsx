import CursoEditorView from "@/app/components/dash/capacitacion/curso-editor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <CursoEditorView cursoId={Number(id)} />;
}