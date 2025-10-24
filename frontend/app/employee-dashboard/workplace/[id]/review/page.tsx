import ReviewForm from './ReviewForm';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function ReviewPage({ params }: { params: { id: string } }) {
  return <ReviewForm workplaceId={params.id} />;
}
