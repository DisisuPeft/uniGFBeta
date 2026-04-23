import LeadDetailView from "@/app/components/crm/lead-detail/lead-detail-view";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { uuid } = await params;
  const { ref } = await searchParams;

  return <LeadDetailView uuid={uuid} refParam={ref} />;
}