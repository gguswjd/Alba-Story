
'use client';

import { useState } from 'react';

interface JoinWorkplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinWorkplaceModal({ isOpen, onClose }: JoinWorkplaceModalProps) {
  const [formData, setFormData] = useState({
    workplaceCode: '',
    name: '',
    phone: '',
    email: '',
    availableDays: [] as string[],
    availableTime: {
      start: '09:00',
      end: '18:00'
    },
    workType: 'regular', // 'regular' or 'schedule'
    position: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekDays = [
    { value: 'monday', label: '월' },
    { value: 'tuesday', label: '화' },
    { value: 'wednesday', label: '수' },
    { value: 'thursday', label: '목' },
    { value: 'friday', label: '금' },
    { value: 'saturday', label: '토' },
    { value: 'sunday', label: '일' }
  ];

  const positionOptions = [
    '매니저', '팀장', '주임', '사원', '아르바이트', '인턴', '계약직', '정규직'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (timeType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      availableTime: {
        ...prev.availableTime,
        [timeType]: value
      }
    }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleWorkTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      workType: type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 시뮬레이션: 실제로는 API 호출
    setTimeout(() => {
      console.log('근무지 참여 신청:', formData);
      alert('근무지 참여 신청이 완료되었습니다! 🎉\n사장님의 승인을 기다려주세요.');
      setIsSubmitting(false);
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      workplaceCode: '',
      name: '',
      phone: '',
      email: '',
      availableDays: [],
      availableTime: {
        start: '09:00',
        end: '18:00'
      },
      workType: 'regular',
      position: ''
    });
    setStep(1);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">새 근무지 참여 🏪</h2>
              <p className="text-gray-600 mt-1">근무지 코드로 참여 신청하세요</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="relative">
              {/* 연결선 */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200"></div>
              <div className={`absolute top-4 left-0 h-1 bg-blue-500 transition-all duration-300 ${
                step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'
              }`}></div>
              
              {/* 단계 번호들 */}
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <span className="text-sm text-gray-600 mt-2">근무지 찾기</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className="text-sm text-gray-600 mt-2">개인정보</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                  <span className="text-sm text-gray-600 mt-2">근무조건</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: 근무지 찾기 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  근무지 코드 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.workplaceCode}
                  onChange={(e) => handleInputChange('workplaceCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="예: STARBUCKS2024"
                />
                <p className="text-xs text-gray-500 mt-1">사장님께 받은 근무지 코드를 입력해주세요</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <i className="ri-information-line mr-2 text-blue-500"></i>
                  근무지 코드란?
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 각 근무지마다 고유한 코드가 있어요</li>
                  <li>• 사장님이나 매니저에게 코드를 받으세요</li>
                  <li>• 코드 입력 후 근무지 정보를 확인할 수 있어요</li>
                </ul>
              </div>

              {formData.workplaceCode && (
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center space-x-4">
                    <img 
                      src="https://readdy.ai/api/search-image?query=modern%20cozy%20coffee%20shop%20exterior%20with%20glass%20windows%2C%20warm%20lighting%2C%20coffee%20shop%20sign%2C%20urban%20street%20setting%2C%20inviting%20atmosphere%2C%20contemporary%20design&width=80&height=80&seq=workplace-preview&orientation=squarish"
                      alt="근무지"
                      className="w-16 h-16 rounded-xl object-cover object-top"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">스타벅스 강남점</h4>
                      <p className="text-sm text-gray-600">서울시 강남구 테헤란로 123</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">모집중</span>
                        <span className="text-xs text-gray-500 ml-2">시급 10,000원</span>
                      </div>
                    </div>
                    <i className="ri-check-circle-fill text-green-500 text-xl"></i>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.workplaceCode}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  다음 단계
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 개인정보 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="홍길동"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="example@email.com"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  이전 단계
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.name || !formData.phone || !formData.email}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  다음 단계
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 근무조건 */}
          {step === 3 && (
            <div className="space-y-6">
              {/* 근무 형태 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  근무 형태 *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleWorkTypeChange('regular')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      formData.workType === 'regular'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <i className="ri-calendar-line text-2xl mb-2"></i>
                      <h3 className="font-bold">정규 근무</h3>
                      <p className="text-sm mt-1">고정된 요일과 시간</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWorkTypeChange('schedule')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      formData.workType === 'schedule'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <i className="ri-calendar-schedule-line text-2xl mb-2"></i>
                      <h3 className="font-bold">스케줄 근무</h3>
                      <p className="text-sm mt-1">유동적인 스케줄</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 직급 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  희망 직급 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {positionOptions.map((position) => (
                    <button
                      key={position}
                      type="button"
                      onClick={() => handleInputChange('position', position)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                        formData.position === position
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>

              {/* 근무 요일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  근무 요일 *
                </label>
                <div className="flex flex-wrap gap-3">
                  {weekDays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`w-12 h-12 rounded-full border-2 transition-all cursor-pointer font-medium ${
                        formData.availableDays.includes(day.value)
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">근무 가능한 요일을 선택해주세요</p>
              </div>

              {/* 근무 시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  근무 시간 *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">시작 시간</label>
                    <input
                      type="time"
                      required
                      value={formData.availableTime.start}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">종료 시간</label>
                    <input
                      type="time"
                      required
                      value={formData.availableTime.end}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  이전 단계
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.workType || !formData.position || formData.availableDays.length === 0}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line mr-2 animate-spin"></i>
                      신청 중...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line mr-2"></i>
                      참여 신청
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
