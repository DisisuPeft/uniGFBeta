import SubmoduloWrapper from "@/app/components/plataforma/submodulo-wrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ submodulo: string }>;
}) {
  const { submodulo } = await params;
  return <SubmoduloWrapper submoduloId={submodulo} />;
}
