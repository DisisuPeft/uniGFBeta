import UserEditForm from "@/app/components/dash/sistema/sistema/usuarios-edit-form";

export default async function Page({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <UserEditForm uuid={uuid} />;
}
