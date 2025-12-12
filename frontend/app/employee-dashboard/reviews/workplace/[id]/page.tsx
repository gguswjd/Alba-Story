import WorkplaceReviews from './WorkplaceReviews';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

export default function WorkplaceReviewsPage({ params }: { params: { id: string } }) {
  const workplaceId = parseInt(params.id);
  return <WorkplaceReviews workplaceId={workplaceId} />;
}
