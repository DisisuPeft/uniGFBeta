import EstudianteEditPage from "@/app/components/control-escolar/alumnos/alumnos-edit-form";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return <EstudianteEditPage uuid={uuid} />;
}
