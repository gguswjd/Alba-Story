
'use client';

export default function BossQuickActions() {
  const quickActions = [
    { id: 1, title: '긴급 공지', description: '모든 직원에게 즉시 알림', icon: 'notification-3', color: 'red' },
    { id: 2, title: '스케줄 조정', description: '오늘/내일 근무 일정 변경', icon: 'calendar-event', color: 'blue' },
    { id: 3, title: '급여 확인', description: '이번 달 급여 현황 보기', icon: 'money-dollar-circle', color: 'green' },
    { id: 5, title: '직원 평가', description: '직원 성과 평가 및 피드백', icon: 'star', color: 'yellow' },
    { id: 6, title: '신규 채용', description: '새로운 직원 모집 공고', icon: 'user-add', color: 'orange' }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">⚡</span>
        빠른 작업
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            className={`bg-${action.color}-50 border border-${action.color}-100 rounded-2xl p-6 text-left hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                <i className={`ri-${action.icon}-line text-${action.color}-500 text-xl`}></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
