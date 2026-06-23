import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { ref } = await searchParams;
  redirect(
    ref
      ? `/dashboard/configuracion/empresas?ref=${ref}`
      : "/dashboard/configuracion/empresas"
  );
}