import EditProgramaPage from "@/app/components/control-escolar/programas/edit/program-edit-form";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <EditProgramaPage uuid={uuid} />;
}
