'use client';

import Link from 'next/link';

interface WorkplaceCardProps {
  workplace: {
    id: number;
    name: string;
    role: string;
    status: string;
    nextShift: string;
    manager: string;
    rating: number;
    image: string;
  };
  onJoinClick?: (workplace: any) => void;
}

export default function WorkplaceCard({ workplace, onJoinClick }: WorkplaceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-gray-400';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '근무중';
      case 'pending':
        return '승인 대기중'; // 🔹 여기만 변경
      case 'inactive':
        return '휴무';
      default:
        return '상태';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 hover:border-gray-200">
      {/* Header Image */}
      <div className="h-40 relative overflow-hidden">
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(workplace.status)}`}></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{workplace.name}</h3>
            <p className="text-sm text-gray-500">{workplace.role}</p>
          </div>
          <div className="flex items-center text-gray-400">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                workplace.status === 'active'
                  ? 'bg-green-100 text-green-600'
                  : workplace.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {getStatusText(workplace.status)}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <i className="ri-time-line mr-2"></i>
            <span>{workplace.nextShift}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <i className="ri-user-line mr-2"></i>
            <span>{workplace.manager}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <i className="ri-star-fill mr-2 text-yellow-400"></i>
            <span>{workplace.rating}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            href={`/employee-dashboard/workplace/${workplace.id}`}
            className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors text-center cursor-pointer whitespace-nowrap"
          >
            상세보기
          </Link>
          {onJoinClick && (
            <button
              onClick={() => onJoinClick(workplace)}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              참여하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
