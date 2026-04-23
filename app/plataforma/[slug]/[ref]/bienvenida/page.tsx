import BienvenidaView from "@/app/components/plataforma/bienvenida-view";

interface Props {
  params: Promise<{ ref: string; slug: string }>;
}

export default async function BienvenidaPage({ params }: Props) {
  const { ref, slug } = await params;
  return <BienvenidaView programaId={ref} slug={slug} />;
}
