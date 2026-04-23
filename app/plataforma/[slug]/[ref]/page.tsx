import RelocationWrapper from "@/app/components/plataforma/reload-wrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ ref: string; slug: string }>;
}) {
  const { ref, slug } = await params;
  return <RelocationWrapper id={ref} tipo={slug} />;
}
