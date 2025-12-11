// app/boss-dashboard/workplace/[id]/page.tsx

import WorkplaceManageDetail from './WorkplaceManageDetail';

type WorkplaceManagePageProps = {
  // ✅ Next 15: params 가 Promise 로 온다
  params: Promise<{ id: string }>;
};

export default async function WorkplaceManagePage(props: WorkplaceManagePageProps) {
  // ✅ 여기서 먼저 await 해서 실제 값 꺼냄
  const resolvedParams = await props.params;
  const { id } = resolvedParams;

  console.log('👉 [server] resolved params:', resolvedParams);
  console.log('👉 [server] resolved id:', id);

  return <WorkplaceManageDetail workplaceId={id} />;
}
