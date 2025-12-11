'use client';

import { useState, useEffect } from 'react';

interface Workplace {
  workplaceId: number | string;
  workName: string;
  address: string;
}

interface JoinWorkplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinWorkplaceModal({ isOpen, onClose }: JoinWorkplaceModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCodeChecked, setIsCodeChecked] = useState(false);

  const [formData, setFormData] = useState({
    workplaceCode: '', // ← 여기엔 workplace_id를 입력/표시
    name: '',
    phone: '',
    email: '',
    availableDays: [] as string[],
    availableTime: { start: '09:00', end: '18:00' },
    workType: 'regular' as 'regular' | 'schedule',
    position: '',
  });

  const [availableWorkplaces, setAvailableWorkplaces] = useState<Workplace[]>([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);

  useEffect(() => {
    if (isOpen) fetchAvailableWorkplaces();
  }, [isOpen]);

  // 🔹 신청한 근무지 workplaceId를 localStorage에 저장
  const savePendingWorkplaceId = (workplaceId: number | string) => {
    if (typeof window === 'undefined') return;

    const key = 'pendingWorkplaceIds';
    const idStr = String(workplaceId);

    try {
      const raw = localStorage.getItem(key);
      let ids: string[] = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(ids)) {
        ids = [];
      }

      if (!ids.includes(idStr)) {
        ids.push(idStr);
        localStorage.setItem(key, JSON.stringify(ids));
      }
    } catch (e) {
      console.error('pendingWorkplaceIds 저장 중 오류:', e);
      // 깨졌을 수 있으니 그냥 새로 저장
      localStorage.setItem(key, JSON.stringify([idStr]));
    }
  };

  // 근무지 리스트 조회
  const fetchAvailableWorkplaces = async () => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const res = await fetch('http://localhost:8080/api/workplace', {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      if (!res.ok) {
        console.error('근무지 목록 응답 코드:', res.status);
        throw new Error('Failed to fetch workplaces');
      }

      const raw = await res.json();
      // 배열 / 페이지 응답 둘 다 대응
      const data: Workplace[] = Array.isArray(raw)
        ? raw
        : raw.content ?? raw.data ?? [];

      console.log('근무지 목록 응답 raw:', raw, '파싱 결과:', data);
      setAvailableWorkplaces(data || []);
    } catch (error) {
      console.error('근무지 목록 조회 실패:', error);
      setAvailableWorkplaces([]);
    }
  };

  // 🔹 코드 입력을 기준으로 화면에 보여줄 근무지 필터링
  const filteredWorkplaces = formData.workplaceCode.trim()
    ? availableWorkplaces.filter((w) =>
        String(w.workplaceId).includes(formData.workplaceCode.trim())
      )
    : [];

  const weekDays = [
    { value: 'monday', label: '월' },
    { value: 'tuesday', label: '화' },
    { value: 'wednesday', label: '수' },
    { value: 'thursday', label: '목' },
    { value: 'friday', label: '금' },
    { value: 'saturday', label: '토' },
    { value: 'sunday', label: '일' },
  ];
  const positionOptions = ['매니저', '팀장', '주임', '사원', '아르바이트', '인턴', '계약직', '정규직'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (timeType: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      availableTime: { ...prev.availableTime, [timeType]: value },
    }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleWorkTypeChange = (type: 'regular' | 'schedule') => {
    setFormData(prev => ({ ...prev, workType: type }));
  };

  // 코드(= workplace_id)로 근무지 선택 (조회 실패해도 막지 않음)
  const selectWorkplaceByCode = async () => {
    const code = formData.workplaceCode.trim();
    if (!code) {
      alert('근무지 코드를 입력해주세요. (workplace_id)');
      return;
    }

    setIsCodeChecked(true);

    console.log('현재 availableWorkplaces:', availableWorkplaces);

    // ① 목록에서 workplace_id 매칭
    const found = availableWorkplaces.find(w => String(w.workplaceId) === code);
    if (found) {
      console.log('리스트에서 매칭된 근무지:', found);
      setSelectedWorkplace(found);
      return;
    }

    // ② API로 단건 조회 시도 (없어도 통과)
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const res = await fetch(
        `http://localhost:8080/api/workplace/${encodeURIComponent(code)}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      console.log(`/api/workplace/${code} 응답 status:`, res.status);

      if (res.ok) {
        const w = await res.json();
        console.log('단건 조회 응답:', w);

        // snake_case / camelCase 둘 다 대비해서 정규화
        const normalized: Workplace = {
          workplaceId: (w.workplaceId ?? w.workplace_id) as number | string,
          workName: w.workName ?? w.work_name,
          address: w.address,
        };

        if (normalized.workplaceId) {
          setSelectedWorkplace(normalized);
          return;
        }
      }
    } catch (e) {
      console.error('단건 근무지 조회 실패:', e);
    }

    // 조회가 안돼도 다음 스텝 가능하므로 선택은 null로 유지
    setSelectedWorkplace(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const workplaceIdToSend =
      selectedWorkplace?.workplaceId ?? formData.workplaceCode.trim();

    if (!workplaceIdToSend) {
      alert('workplace_id가 없습니다. Step 1에서 코드를 입력해주세요.');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/workplace/join?workplaceId=${encodeURIComponent(
          String(workplaceIdToSend)
        )}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ ...formData }),
        }
      );

      if (res.ok) {
        // 🔹 여기서 pending workplaceId 저장
        savePendingWorkplaceId(workplaceIdToSend);

        alert('근무지 참여 신청이 완료되었습니다! 🎉\n사장님의 승인을 기다려주세요.');
        onClose();
        resetForm();
      } else {
        const error = await res.json().catch(() => ({}));
        alert(error?.message || '신청에 실패했습니다.');
      }
    } catch (error) {
      console.error('근무지 가입 신청 실패:', error);
      alert('신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      workplaceCode: '',
      name: '',
      phone: '',
      email: '',
      availableDays: [],
      availableTime: { start: '09:00', end: '18:00' },
      workType: 'regular',
      position: '',
    });
    setSelectedWorkplace(null);
    setIsCodeChecked(false);
    setStep(1);
  };

  const nextStep = () => setStep(prev => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  const prevStep = () => setStep(prev => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));

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
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200"></div>
              <div
                className={`absolute top-4 left-0 h-1 bg-blue-500 transition-all duration-300 ${
                  step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'
                }`}
              ></div>

              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                  <span className="text-sm text-gray-600 mt-2">근무지 찾기</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                  <span className="text-sm text-gray-600 mt-2">개인정보</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
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
              {/* 근무지 코드 입력 */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  근무지 코드 *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.workplaceCode}
                    onChange={(e) => {
                      handleInputChange('workplaceCode', e.target.value);
                      setIsCodeChecked(false);   // ← 코드를 바꾸면 다시 false
                    }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="예) 1024 또는 ABC123"
                  />
                  <button
                    type="button"
                    onClick={selectWorkplaceByCode}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    코드로 확인
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  근무지 그룹 코드를 입력해주세요.
                </p>
              </div>

              {/* 근무지 리스트 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  근무지 선택 (선택)
                </label>

                {/* 코드 확인 전에는 아무것도 안 보여줌 */}
                {!isCodeChecked && (
                  <p className="text-xs text-gray-500">코드를 입력 후 "코드로 확인"을 눌러주세요.</p>
                )}

                <div className="space-y-3">
                  {/* 코드 확인됨 + 결과 있음 */}
                  {isCodeChecked && filteredWorkplaces.length > 0 &&
                    filteredWorkplaces.map((workplace) => (
                      <button
                        key={workplace.workplaceId}
                        type="button"
                        onClick={() => {
                          setSelectedWorkplace(workplace);
                          handleInputChange('workplaceCode', String(workplace.workplaceId));
                        }}
                        className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                          selectedWorkplace?.workplaceId === workplace.workplaceId
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{workplace.workName}</h4>
                            <p className="text-sm text-gray-600">{workplace.address}</p>
                          </div>
                          {selectedWorkplace?.workplaceId === workplace.workplaceId && (
                            <i className="ri-check-circle-fill text-blue-500 text-xl"></i>
                          )}
                        </div>
                      </button>
                    ))}

                  {/* 코드 확인됨 + 결과 없음 */}
                  {isCodeChecked && filteredWorkplaces.length === 0 && (
                    <p className="text-xs text-red-500">해당 코드의 근무지를 찾을 수 없습니다.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    !formData.workplaceCode.trim() || // 코드 비어 있으면 X
                    !isCodeChecked                    // 코드로 확인 안 했으면 X
                  }
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">근무 형태 *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">희망 직급 *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">근무 요일 *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">근무 시간 *</label>
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
