import ModuloView from "@/app/components/plataforma/modulo-view";

interface Props {
  params: Promise<{ id: number; ref: string }>;
}

export default async function Page({ params }: Props) {
  const { id, ref } = await params;

  return <ModuloView uuid={ref} moduloId={id} />;
}
