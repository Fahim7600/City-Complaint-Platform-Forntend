import { redirect } from "next/navigation";

interface AdminComplaintIdPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminComplaintIdRedirectPage({
  params,
}: AdminComplaintIdPageProps) {
  const { id } = await params;
  redirect(`/admin/complaints?id=${id}`);
}
