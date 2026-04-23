import ArchivosProgramaView from "@/app/components/plataforma/archivos-programa-view";

interface Props {
  params: Promise<{ ref: string }>;
}

export default async function ArchivosPage({ params }: Props) {
  const { ref } = await params;
  return <ArchivosProgramaView programaId={ref} />;
}
