'use client';

import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: 'ri-calendar-check-line',
      title: '스케줄 확인',
      description: '이번 주 근무 일정을 확인하세요',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: () => {
        router.push('/employee-dashboard/schedule');
      }
    },
    {
      icon: 'ri-notification-line',
      title: '알림 설정',
      description: '근무 관련 알림을 설정하세요',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => {
        router.push('/employee-dashboard/notifications');
      }
    },
    {
      icon: 'ri-question-line',
      title: '도움말',
      description: '사용법을 확인하세요',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: () => {
        router.push('/employee-dashboard/help');
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="bg-white rounded-xl p-6 text-left hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group cursor-pointer"
        >
          <div className={`w-12 h-12 flex items-center justify-center ${action.color} ${action.hoverColor} rounded-lg mb-4 group-hover:scale-105 transition-transform`}>
            <i className={`${action.icon} text-white text-xl`}></i>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
          <p className="text-sm text-gray-500">{action.description}</p>
        </button>
      ))}
    </div>
  );
}
