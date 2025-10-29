
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function NewWorkplace() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    phone: '',
    description: '',
    operatingHours: {
      weekday: { open: '09:00', close: '22:00', closed: false },
      weekend: { open: '10:00', close: '21:00', closed: false }
    },
    maxEmployees: '',
    hourlyWage: '',
    benefits: [],
    businessRegistration: {
      number: '',
      location: '',
      businessName: '',
      ownerName: '',
      businessType: ''
    },
    positions: [],
    departments: [],
    shiftTimes: {
      morning: { start: '09:00', end: '15:00' },
      afternoon: { start: '15:00', end: '21:00' },
      evening: { start: '21:00', end: '24:00' },
      middle: { start: '12:00', end: '18:00' },
      full: { start: '09:00', end: '22:00' }
    }
  });

  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [customPosition, setCustomPosition] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [businessImage, setBusinessImage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedShiftTypes, setSelectedShiftTypes] = useState<string[]>(['morning', 'afternoon']);

  const workplaceTypes = [
    { value: '카페', label: '카페', color: 'brown' },
    { value: '패스트푸드', label: '패스트푸드', color: 'red' },
    { value: '편의점', label: '편의점', color: 'blue' },
    { value: '레스토랑', label: '레스토랑', color: 'green' },
    { value: '베이커리', label: '베이커리', color: 'orange' },
    { value: '치킨집', label: '치킨집', color: 'yellow' },
    { value: '피자집', label: '피자집', color: 'red' },
    { value: '분식점', label: '분식점', color: 'orange' },
    { value: '한식당', label: '한식당', color: 'green' },
    { value: '중식당', label: '중식당', color: 'red' },
    { value: '일식당', label: '일식당', color: 'blue' },
    { value: '양식당', label: '양식당', color: 'purple' },
    { value: '술집', label: '술집', color: 'amber' },
    { value: '노래방', label: '노래방', color: 'pink' },
    { value: 'PC방', label: 'PC방', color: 'blue' },
    { value: '미용실', label: '미용실', color: 'purple' },
    { value: '네일샵', label: '네일샵', color: 'pink' },
    { value: '마사지샵', label: '마사지샵', color: 'green' },
    { value: '세탁소', label: '세탁소', color: 'blue' },
    { value: '문구점', label: '문구점', color: 'yellow' },
    { value: '서점', label: '서점', color: 'brown' },
    { value: '옷가게', label: '옷가게', color: 'purple' },
    { value: '신발가게', label: '신발가게', color: 'gray' },
    { value: '화장품가게', label: '화장품가게', color: 'pink' },
    { value: '약국', label: '약국', color: 'green' },
    { value: '병원', label: '병원', color: 'blue' },
    { value: '치과', label: '치과', color: 'white' },
    { value: '학원', label: '학원', color: 'blue' },
    { value: '헬스장', label: '헬스장', color: 'red' },
    { value: '요가원', label: '요가원', color: 'purple' },
    { value: '수영장', label: '수영장', color: 'blue' },
    { value: '펜션', label: '펜션', color: 'green' },
    { value: '모텔', label: '모텔', color: 'gray' },
    { value: '호텔', label: '호텔', color: 'gold' },
    { value: '게스트하우스', label: '게스트하우스', color: 'brown' },
    { value: '기타', label: '기타', color: 'gray' }
  ];

  const benefitOptions = [
    '식사 제공', '교통비 지원', '야간 수당', '주휴수당', '성과급', 
    '유니폼 제공', '교육비 지원', '건강검진', '휴가비 지원', '보너스'
  ];

  const positionOptions = [
    '매니저', '아르바이트'
  ];

  const departmentOptions = [
    '주방', '홀 서빙', '캐셔', '바리스타', '청소', '재고관리', '배달', '드라이브스루'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessRegistrationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      businessRegistration: {
        ...prev.businessRegistration,
        [field]: value
      }
    }));
  };

  const handleTimeChange = (day: string, timeType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [timeType]: value
        }
      }
    }));
  };

  const toggleDayOff = (day: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          closed: !prev.operatingHours[day as keyof typeof prev.operatingHours].closed
        }
      }
    }));
  };

  const toggleBenefit = (benefit: string) => {
    setSelectedBenefits(prev => 
      prev.includes(benefit) 
        ? prev.filter(b => b !== benefit)
        : [...prev, benefit]
    );
  };

  const togglePosition = (position: string) => {
    setSelectedPositions(prev => 
      prev.includes(position) 
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };

  const addCustomPosition = () => {
    if (customPosition.trim() && !selectedPositions.includes(customPosition.trim())) {
      setSelectedPositions(prev => [...prev, customPosition.trim()]);
      setCustomPosition('');
    }
  };

  const removePosition = (position: string) => {
    setSelectedPositions(prev => prev.filter(p => p !== position));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBusinessImage(result);
        extractBusinessInfo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractBusinessInfo = async (imageData: string) => {
    setIsExtracting(true);
    
    // 시뮬레이션: 실제로는 OCR API를 사용
    setTimeout(() => {
      const mockData = {
        number: '123-45-67890',
        location: '서울특별시 강남구 테헤란로 123',
        businessName: '스타벅스 강남점',
        ownerName: '김사장',
        businessType: '카페'
      };
      
      setFormData(prev => ({
        ...prev,
        businessRegistration: mockData,
        name: mockData.businessName,
        address: mockData.location,
        type: mockData.businessType
      }));
      
      setIsExtracting(false);
    }, 2000);
  };

  const verifyBusinessNumber = () => {
    if (!formData.businessRegistration.number) {
      alert('사업자 등록번호를 입력해주세요.');
      return;
    }
    
    // 시뮬레이션: 실제로는 국세청 API 사용
    alert('✅ 유효한 사업자 등록번호입니다.');
  };

  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const addCustomDepartment = () => {
    if (customDepartment.trim() && !selectedDepartments.includes(customDepartment.trim())) {
      setSelectedDepartments(prev => [...prev, customDepartment.trim()]);
      setCustomDepartment('');
    }
  };

  const removeDepartment = (department: string) => {
    setSelectedDepartments(prev => prev.filter(d => d !== department));
  };

  const handleShiftTimeChange = (shift: string, timeType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shiftTimes: {
        ...prev.shiftTimes,
        [shift]: {
          ...prev.shiftTimes[shift as keyof typeof prev.shiftTimes],
          [timeType]: value
        }
      }
    }));
  };

  const shiftTypeOptions = [
    { 
      key: 'morning', 
      label: '오전', 
      icon: 'ri-sun-line', 
      color: 'yellow',
      defaultTime: { start: '09:00', end: '15:00' }
    },
    { 
      key: 'afternoon', 
      label: '오후', 
      icon: 'ri-sun-cloudy-line', 
      color: 'blue',
      defaultTime: { start: '15:00', end: '21:00' }
    },
    { 
      key: 'middle', 
      label: '미들', 
      icon: 'ri-time-line', 
      color: 'green',
      defaultTime: { start: '12:00', end: '18:00' }
    },
    { 
      key: 'evening', 
      label: '야간', 
      icon: 'ri-moon-line', 
      color: 'purple',
      defaultTime: { start: '21:00', end: '24:00' }
    },
    { 
      key: 'full', 
      label: '풀타임', 
      icon: 'ri-24-hours-line', 
      color: 'gray',
      defaultTime: { start: '09:00', end: '22:00' }
    }
  ];

  const toggleShiftType = (shiftKey: string) => {
    setSelectedShiftTypes(prev => {
      if (prev.includes(shiftKey)) {
        return prev.filter(key => key !== shiftKey);
      } else {
        return [...prev, shiftKey];
      }
    });
  };

  const getShiftColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      yellow: isSelected ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-600',
      blue: isSelected ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600',
      green: isSelected ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600',
      purple: isSelected ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600',
      gray: isSelected ? 'bg-gray-100 border-gray-400 text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getShiftDetailColorClasses = (color: string) => {
    const colorMap = {
      yellow: 'bg-yellow-50 border-yellow-100',
      blue: 'bg-blue-50 border-blue-100',
      green: 'bg-green-50 border-green-100',
      purple: 'bg-purple-50 border-purple-100',
      gray: 'bg-gray-50 border-gray-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const payload = {
      workName: formData.name,
      address: formData.address,
      regNumber: formData.businessRegistration.number,
    };

    try {
      const res = await fetch('http://localhost:8080/api/workplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('근무지 생성 실패:', res.status, text);
        alert('근무지 생성에 실패했습니다. 입력값을 확인해 주세요.');
        return;
      }

      // 성공 시 대시보드로 이동하여 목록에서 확인
      alert('매장이 성공적으로 등록되었습니다! 🎉');
      window.location.href = '/boss-dashboard?tab=workplaces';
    } catch (err) {
      console.error('근무지 생성 에러:', err);
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/boss-dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">새 매장 등록</h1>
              <p className="text-gray-600 mt-1">새로운 매장 정보를 입력해주세요</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Registration */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              사업자 등록증
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업자 등록증 이미지 업로드 *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                {businessImage ? (
                  <div className="space-y-4">
                    <img 
                      src={businessImage} 
                      alt="사업자 등록증" 
                      className="max-h-48 mx-auto rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setBusinessImage(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      이미지 삭제
                    </button>
                  </div>
                ) : (
                  <div>
                    <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600 mb-2">사업자 등록증을 업로드하세요</p>
                    <p className="text-sm text-gray-500">JPG, PNG 파일만 지원</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="business-image"
                />
                <label
                  htmlFor="business-image"
                  className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  {businessImage ? '다시 업로드' : '파일 선택'}
                </label>
              </div>
              
              {isExtracting && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-blue-700">사업자 등록증 정보를 추출하고 있습니다...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업자 등록번호 *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={formData.businessRegistration.number}
                    onChange={(e) => handleBusinessRegistrationChange('number', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="123-45-67890"
                  />
                  <button
                    type="button"
                    onClick={verifyBusinessNumber}
                    className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    조회
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업장 위치
                </label>
                <input
                  type="text"
                  value={formData.businessRegistration.location}
                  onChange={(e) => handleBusinessRegistrationChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-5 0 focus:border-transparent text-sm"
                  placeholder="자동 추출됩니다"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상호명
                </label>
                <input
                  type="text"
                  value={formData.businessRegistration.businessName}
                  onChange={(e) => handleBusinessRegistrationChange('businessName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="자동 추출됩니다"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표자명
                </label>
                <input
                  type="text"
                  value={formData.businessRegistration.ownerName}
                  onChange={(e) => handleBusinessRegistrationChange('ownerName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="자동 추출됩니다"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              기본 정보
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  매장명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="예: 스타벅스 강남점"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  업종 *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="">업종을 선택해주세요</option>
                    {workplaceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="예: 서울시 강남구 테헤란로 123"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="예: 02-1234-5678"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                매장 소개
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                placeholder="매장에 대한 간단한 소개를 입력해주세요"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500자</p>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              운영 시간
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">평일 (월-금)</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.operatingHours.weekday.closed || false}
                      onChange={() => toggleDayOff('weekday')}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">휴무</span>
                  </label>
                </div>
                {!formData.operatingHours.weekday.closed && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">오픈</label>
                      <input
                        type="time"
                        value={formData.operatingHours.weekday.open}
                        onChange={(e) => handleTimeChange('weekday', 'open', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="text-gray-400">~</div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">마감</label>
                      <input
                        type="time"
                        value={formData.operatingHours.weekday.close}
                        onChange={(e) => handleTimeChange('weekday', 'close', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
                {formData.operatingHours.weekday.closed && (
                  <div className="text-center py-8 text-gray-500">
                    평일 휴무
                  </div>
                )}
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">주말 (토-일)</h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.operatingHours.weekend.closed || false}
                      onChange={() => toggleDayOff('weekend')}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">휴무</span>
                  </label>
                </div>
                {!formData.operatingHours.weekend.closed && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">오픈</label>
                      <input
                        type="time"
                        value={formData.operatingHours.weekend.open}
                        onChange={(e) => handleTimeChange('weekend', 'open', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="text-gray-400">~</div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">마감</label>
                      <input
                        type="time"
                        value={formData.operatingHours.weekend.close}
                        onChange={(e) => handleTimeChange('weekend', 'close', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
                {formData.operatingHours.weekend.closed && (
                  <div className="text-center py-8 text-gray-500">
                    주말 휴무
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4">세부 운영 시간 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                  <div key={day} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-center">
                      <h4 className="font-medium text-gray-800 mb-2">{day}</h4>
                      <label className="flex items-center justify-center space-x-1 mb-2">
                        <input
                          type="checkbox"
                          className="rounded text-xs"
                        />
                        <span className="text-xs text-gray-600">휴무</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="time"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          placeholder="오픈"
                        />
                        <input
                          type="time"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          placeholder="마감"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">각 요일별로 다른 운영시간을 설정할 수 있습니다</p>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              고용 정보
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 직원 수 *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.maxEmployees}
                  onChange={(e) => handleInputChange('maxEmployees', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="예: 15"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시급 *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="9620"
                    value={formData.hourlyWage}
                    onChange={(e) => handleInputChange('hourlyWage', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="9620"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>
            </div>

            {/* 근무 시간대 설정 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                근무 시간대 설정 *
              </label>
              
              {/* 시간대 선택 버튼들 */}
              <div className="flex flex-wrap gap-3 mb-6">
                {shiftTypeOptions.map((shift) => (
                  <button
                    key={shift.key}
                    type="button"
                    onClick={() => toggleShiftType(shift.key)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all cursor-pointer font-medium whitespace-nowrap flex items-center ${getShiftColorClasses(shift.color, selectedShiftTypes.includes(shift.key))}`}
                  >
                    <i className={`${shift.icon} mr-2`}></i>
                    {shift.label}
                  </button>
                ))}
              </div>

              {/* 선택된 시간대 설정 */}
              {selectedShiftTypes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedShiftTypes.map((shiftKey) => {
                    const shift = shiftTypeOptions.find(s => s.key === shiftKey);
                    if (!shift) return null;

                    return (
                      <div key={shiftKey} className={`rounded-2xl p-6 border ${getShiftDetailColorClasses(shift.color)}`}>
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                          <i className={`${shift.icon} mr-2 text-${shift.color}-500`}></i>
                          {shift.label} 시간대
                        </h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">시작</label>
                            <input
                              type="time"
                              value={formData.shiftTimes[shiftKey as keyof typeof formData.shiftTimes].start}
                              onChange={(e) => handleShiftTimeChange(shiftKey, 'start', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div className="text-gray-400">~</div>
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">종료</label>
                            <input
                              type="time"
                              value={formData.shiftTimes[shiftKey as keyof typeof formData.shiftTimes].end}
                              onChange={(e) => handleShiftTimeChange(shiftKey, 'end', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-3">매장에서 운영할 시간대를 선택하고 각 시간대별 근무 시간을 설정해주세요.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                직급 설정 *
              </label>
              
              {/* 기본 직급 선택 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {positionOptions.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => togglePosition(position)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${selectedPositions.includes(position)
                        ? 'bg-purple-100 border border-purple-300 text-purple-700'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {position}
                  </button>
                ))}
              </div>

              {/* 직급 직접 입력 */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPosition())}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="직급을 직접 입력하세요"
                />
                <button
                  type="button"
                  onClick={addCustomPosition}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <i className="ri-add-line mr-1"></i>
                  추가
                </button>
              </div>

              {/* 선택된 직급 목록 */}
              {selectedPositions.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">선택된 직급</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPositions.map((position) => (
                      <div
                        key={position}
                        className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm"
                      >
                        <span>{position}</span>
                        <button
                          type="button"
                          onClick={() => removePosition(position)}
                          className="ml-2 text-purple-500 hover:text-purple-700"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">매장에서 사용할 직급을 선택하거나 직접 입력해주세요</p>
            </div>

            {/* 파트 설정 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                파트 설정 *
              </label>
              
              {/* 기본 파트 선택 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {departmentOptions.map((department) => (
                  <button
                    key={department}
                    type="button"
                    onClick={() => toggleDepartment(department)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${selectedDepartments.includes(department)
                        ? 'bg-green-100 border border-green-300 text-green-700'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {department}
                  </button>
                ))}
              </div>

              {/* 파트 직접 입력 */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomDepartment())}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="파트를 직접 입력하세요"
                />
                <button
                  type="button"
                  onClick={addCustomDepartment}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <i className="ri-add-line mr-1"></i>
                  추가
                </button>
              </div>

              {/* 선택된 파트 목록 */}
              {selectedDepartments.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">선택된 파트</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepartments.map((department) => (
                      <div
                        key={department}
                        className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm"
                      >
                        <span>{department}</span>
                        <button
                          type="button"
                          onClick={() => removeDepartment(department)}
                          className="ml-2 text-green-500 hover:text-green-700"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">매장에서 운영할 파트를 선택하거나 직접 입력해주세요</p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center space-x-4">
            <Link 
              href="/boss-dashboard"
              className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-8 py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <i className="ri-check-line mr-2"></i>
              매장 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
