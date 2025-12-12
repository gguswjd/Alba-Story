// app/employee-dashboard/workplace/[id]/page.tsx

import WorkplaceDetail from './WorkplaceDetail';

interface WorkplacePageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkplacePage({ params }: WorkplacePageProps) {
  const { id } = await params;

  return <WorkplaceDetail workplaceId={id} />;
}
