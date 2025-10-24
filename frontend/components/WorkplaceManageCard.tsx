
'use client';

import Link from 'next/link';

interface Workplace {
  id: number;
  name: string;
  type: string;
  status: string;
  employees: number;
  todayShifts: number;
  rating: number;
  groupCode: string;
  image: string;
}

interface WorkplaceManageCardProps {
  workplace: Workplace;
}

export default function WorkplaceManageCard({ workplace }: WorkplaceManageCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48">
        <img 
          src={workplace.image} 
          alt={workplace.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            workplace.status === 'active' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {workplace.status === 'active' ? '운영중' : '휴업'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{workplace.name}</h3>
            <p className="text-gray-600">{workplace.type}</p>
          </div>
          <div className="flex items-center space-x-1">
            <i className="ri-star-fill text-yellow-400"></i>
            <span className="font-medium">{workplace.rating}</span>
          </div>
        </div>

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
            <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">{workplace.groupCode}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href={`/boss-dashboard/workplace/${workplace.id}`} className="w-full">
            <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-settings-line mr-2"></i>
              관리하기
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
