
import WorkplaceDetail from './WorkplaceDetail';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function WorkplacePage({ params }: { params: { id: string } }) {
  return <WorkplaceDetail workplaceId={params.id} />;
}
