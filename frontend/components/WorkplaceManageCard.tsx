'use client';

import Link from 'next/link';

interface Workplace {
  workplaceId?: number;
  id?: number;
  name: string;
  type: string;
  status: string;
  employees: number;
  todayShifts: number;
  rating: number;
}

interface WorkplaceManageCardProps {
  workplace: Workplace;
}

export default function WorkplaceManageCard({ workplace }: WorkplaceManageCardProps) {
  console.log('🧩 WorkplaceManageCard workplace:', workplace);


  const isActive = workplace.status === 'active';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-lg transition-all">
      {/* 상단 헤더 (이미지 대신) */}
      <div className="px-6 pt-5 pb-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{workplace.name}</h3>
            <p className="text-sm text-gray-600">{workplace.type}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {isActive ? '운영중' : '휴업'}
            </span>
            <div className="flex items-center space-x-1 text-sm">
              <i className="ri-star-fill text-yellow-400" />
              <span className="font-medium">{workplace.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{workplace.employees}</div>
            <div className="text-sm text-gray-600">총 직원수</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="text-2xl font-bold text-green-600">{workplace.todayShifts}</div>
            <div className="text-sm text-gray-600">오늘 근무자</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">그룹 코드</span>
            <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">
              {workplace.workplaceId ? workplace.workplaceId : '코드 없음'}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href={`/boss-dashboard/workplace/${workplace.workplaceId ?? workplace.id}`} className="w-full">
            <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-settings-line mr-2" />
              관리하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
