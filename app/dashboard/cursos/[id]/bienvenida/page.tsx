import CursoBienvenida from "@/app/components/dash/cursos/detail/curso-bienvenida";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BienvenidaPage({ params }: Props) {
  const { id } = await params;
  return <CursoBienvenida cursoId={Number(id)} />;
}
