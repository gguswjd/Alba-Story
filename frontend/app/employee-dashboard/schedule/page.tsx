
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 현재 월의 첫 번째 날과 마지막 날
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // 캘린더에 표시할 날짜들
  const calendarDays = [];
  
  // 이전 달의 마지막 날들
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - i - 1);
    calendarDays.push(date);
  }
  
  // 현재 달의 날들
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }
  
  // 다음 달의 첫 번째 날들 (42개까지 채우기)
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day));
  }

  // 스케줄 데이터 (실제로는 API에서 가져올 데이터)
  const scheduleData = {
    '2024-12-16': { time: '14:00-20:00', workplace: '스타벅스 강남점', status: 'confirmed' },
    '2024-12-18': { time: '09:00-17:00', workplace: '스타벅스 강남점', status: 'confirmed' },
    '2024-12-20': { time: '14:00-22:00', workplace: '스타벅스 강남점', status: 'confirmed' },
    '2024-12-23': { time: '09:00-17:00', workplace: '스타벅스 강남점', status: 'pending' },
    '2024-12-25': { time: '휴무', workplace: '', status: 'holiday' },
    '2024-12-27': { time: '14:00-20:00', workplace: '스타벅스 강남점', status: 'confirmed' },
    '2024-12-30': { time: '09:00-17:00', workplace: '스타벅스 강남점', status: 'confirmed' },
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getScheduleForDate = (date: Date) => {
    return scheduleData[formatDate(date)];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'holiday':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    setSelectedDate(null);
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 월별 통계
  const monthlyStats = {
    totalDays: Object.keys(scheduleData).filter(date => {
      const d = new Date(date);
      return d.getMonth() === currentDate.getMonth() && scheduleData[date].status === 'confirmed';
    }).length,
    totalHours: Object.keys(scheduleData).reduce((total, date) => {
      const d = new Date(date);
      const schedule = scheduleData[date];
      if (d.getMonth() === currentDate.getMonth() && schedule.status === 'confirmed' && schedule.time !== '휴무') {
        const [start, end] = schedule.time.split('-');
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        return total + (endHour - startHour);
      }
      return total;
    }, 0),
    pendingDays: Object.keys(scheduleData).filter(date => {
      const d = new Date(date);
      return d.getMonth() === currentDate.getMonth() && scheduleData[date].status === 'pending';
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/employee-dashboard/workplace/1"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">내 스케줄</h1>
                <p className="text-gray-600">월별 근무 일정 확인</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Monthly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
            <div className="text-3xl font-bold mb-2 text-blue-500">{monthlyStats.totalDays}</div>
            <div className="text-gray-600">📅 이번달 근무일</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
            <div className="text-3xl font-bold mb-2 text-green-500">{monthlyStats.totalHours}</div>
            <div className="text-gray-600">⏰ 총 근무시간</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100">
            <div className="text-3xl font-bold mb-2 text-orange-500">{monthlyStats.pendingDays}</div>
            <div className="text-gray-600">⏳ 승인 대기</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-left-s-line text-gray-600"></i>
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl font-medium hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    오늘
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-gray-600"></i>
                  </button>
                </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day, index) => (
                  <div key={day} className={`text-center py-3 font-medium ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                  const schedule = getScheduleForDate(date);
                  const isCurrentMonthDate = isCurrentMonth(date);
                  const isTodayDate = isToday(date);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-[80px] p-2 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                        isTodayDate
                          ? 'bg-blue-50 border-blue-200'
                          : selectedDate && selectedDate.toDateString() === date.toDateString()
                          ? 'bg-purple-50 border-purple-200'
                          : isCurrentMonthDate
                          ? 'bg-white border-gray-100 hover:bg-gray-50'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isTodayDate
                          ? 'text-blue-600'
                          : isCurrentMonthDate
                          ? index % 7 === 0
                            ? 'text-red-500'
                            : index % 7 === 6
                            ? 'text-blue-500'
                            : 'text-gray-800'
                          : 'text-gray-400'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      {schedule && isCurrentMonthDate && (
                        <div className={`text-xs px-2 py-1 rounded-lg border ${getStatusColor(schedule.status)}`}>
                          {schedule.time}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">확정</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">승인대기</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">휴무</span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Detail */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="ri-calendar-check-line mr-3 text-green-500"></i>
                {selectedDate ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일` : '날짜를 선택하세요'}
              </h3>
              
              {selectedDate ? (
                <div>
                  {getScheduleForDate(selectedDate) ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border ${getStatusColor(getScheduleForDate(selectedDate)!.status)}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-800">근무 시간</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            getScheduleForDate(selectedDate)!.status === 'confirmed' ? 'bg-green-500 text-white' :
                            getScheduleForDate(selectedDate)!.status === 'pending' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {getScheduleForDate(selectedDate)!.status === 'confirmed' ? '확정' :
                             getScheduleForDate(selectedDate)!.status === 'pending' ? '승인대기' : '휴무'}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-800 mb-2">
                          {getScheduleForDate(selectedDate)!.time}
                        </p>
                        {getScheduleForDate(selectedDate)!.workplace && (
                          <p className="text-gray-600">
                            📍 {getScheduleForDate(selectedDate)!.workplace}
                          </p>
                        )}
                      </div>
                      
                      {getScheduleForDate(selectedDate)!.status === 'confirmed' && getScheduleForDate(selectedDate)!.time !== '휴무' && (
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                          <h4 className="font-medium text-gray-800 mb-3">예상 급여</h4>
                          <div className="text-2xl font-bold text-blue-500">
                            ₩{(() => {
                              const time = getScheduleForDate(selectedDate)!.time;
                              if (time === '휴무') return '0';
                              const [start, end] = time.split('-');
                              const startHour = parseInt(start.split(':')[0]);
                              const endHour = parseInt(end.split(':')[0]);
                              const hours = endHour - startHour;
                              return (hours * 9620).toLocaleString();
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500">이 날은 근무 일정이 없습니다</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-calendar-2-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">캘린더에서 날짜를 클릭하여<br />상세 정보를 확인하세요</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center">
                <i className="ri-download-line mr-2"></i>
                스케줄 다운로드
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
