
import WorkplaceManageDetail from './WorkplaceManageDetail';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default async function WorkplaceManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkplaceManageDetail workplaceId={id} />;
}
