
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

function ScheduleRequestContent() {
  const searchParams = useSearchParams();
  const workplaceId = searchParams.get('workplaceId') || '1';
  
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const timeSlots = [
    '09:00 - 12:00 (오전)',
    '12:00 - 15:00 (점심)',
    '15:00 - 18:00 (오후)',
    '18:00 - 21:00 (저녁)',
    '21:00 - 24:00 (야간)'
  ];

  // 캘린더 관련 함수들
  const firstDayOfMonth = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays = [];
  
  // 이전 달의 마지막 날들
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - i - 1);
    calendarDays.push(date);
  }
  
  // 현재 달의 날들
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    calendarDays.push(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), day));
  }
  
  // 다음 달의 첫 번째 날들 (42개까지 채우기)
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, day));
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentCalendarDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const toggleDate = (date: Date) => {
    if (!isCurrentMonth(date) || isPastDate(date)) return;
    
    const dateStr = formatDate(date);
    setSelectedDates(prev => 
      prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const navigateMonth = (direction: number) => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + direction, 1));
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDates.length === 0) {
      alert('근무 희망 날짜를 선택해주세요.');
      return;
    }

    console.log('스케줄 신청 데이터:', {
      dates: selectedDates,
      message: message
    });

    alert(`스케줄 신청이 완료되었습니다! 🎉\n신청한 날짜: ${selectedDates.length}일\n매장에서 검토 후 연락드릴게요.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/employee-dashboard/workplace/${workplaceId}`}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">스케줄 신청</h1>
                <p className="text-gray-600">원하는 날짜를 선택해서 근무 신청하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Calendar Selection */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">📅</span>
              근무 희망 날짜 선택 * ({selectedDates.length}일 선택됨)
            </h2>
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {currentCalendarDate.getFullYear()}년 {monthNames[currentCalendarDate.getMonth()]}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => navigateMonth(-1)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-s-line text-gray-600"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentCalendarDate(new Date())}
                  className="px-4 py-2 bg-green-100 text-green-600 rounded-xl font-medium hover:bg-green-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  이번달
                </button>
                <button
                  type="button"
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
                const isCurrentMonthDate = isCurrentMonth(date);
                const isTodayDate = isToday(date);
                const isPast = isPastDate(date);
                const isSelected = selectedDates.includes(formatDate(date));
                
                return (
                  <div
                    key={index}
                    onClick={() => toggleDate(date)}
                    className={`min-h-[60px] p-2 rounded-xl border transition-all ${
                      !isCurrentMonthDate
                        ? 'bg-gray-50 border-gray-100 cursor-not-allowed'
                        : isPast
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-green-500 border-green-500 text-white cursor-pointer'
                        : isTodayDate
                        ? 'bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100'
                        : 'bg-white border-gray-100 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-sm font-medium text-center ${
                      !isCurrentMonthDate
                        ? 'text-gray-400'
                        : isPast
                        ? 'text-gray-400'
                        : isSelected
                        ? 'text-white'
                        : isTodayDate
                        ? 'text-blue-600'
                        : index % 7 === 0
                        ? 'text-red-500'
                        : index % 7 === 6
                        ? 'text-blue-500'
                        : 'text-gray-800'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    {isSelected && (
                      <div className="flex justify-center mt-1">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <i className="ri-information-line"></i>
                <span>클릭하여 근무 희망 날짜를 선택하세요. 여러 날짜를 선택할 수 있습니다.</span>
              </div>
            </div>
          </div>

          {/* Time Preference */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🕐</span>
              선호 근무 시간 (참고용)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timeSlots.map((time) => (
                <label
                  key={time}
                  className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-orange-200 hover:bg-orange-25 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 font-medium text-gray-800">{time}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">선호하는 시간대를 선택하면 매장에서 참고합니다</p>
          </div>

          {/* Additional Message */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">💬</span>
              추가 메시지 (선택사항)
            </h2>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              placeholder="매장에 전달하고 싶은 메시지가 있다면 입력해주세요"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/500자</p>
          </div>

          {/* Selected Dates Summary */}
          {selectedDates.length > 0 && (
            <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <i className="ri-calendar-check-line mr-2"></i>
                선택한 날짜 요약
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedDates.sort().map((dateStr) => {
                  const date = new Date(dateStr);
                  return (
                    <div key={dateStr} className="bg-white rounded-lg p-3 text-center border border-blue-110">
                      <div className="text-sm font-medium text-gray-800">
                        {date.getMonth() + 1}월 {date.getDate()}일
                      </div>
                      <div className="text-xs text-gray-500">
                        {dayNames[date.getDay()]}요일
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <span className="text-blue-700 font-medium">총 {selectedDates.length}일 신청</span>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-center space-x-4">
            <Link 
              href={`/employee-dashboard/workplace/${workplaceId}`}
              className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-8 py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <i className="ri-calendar-add-line mr-2"></i>
              월간 스케줄 신청하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ScheduleRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScheduleRequestContent />
    </Suspense>
  );
}
