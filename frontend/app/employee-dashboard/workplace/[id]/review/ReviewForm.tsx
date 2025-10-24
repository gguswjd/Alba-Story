
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ReviewFormProps {
  workplaceId: string;
}

export default function ReviewForm({ workplaceId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    workEnvironment: 0,
    management: 0,
    salary: 0,
    title: '',
    pros: '',
    cons: '',
    advice: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workplace = {
    id: parseInt(workplaceId),
    name: workplaceId === '1' ? '스타벅스 강남점' : '맥도날드 홍대점',
    role: workplaceId === '1' ? '바리스타' : '크루',
    image: workplaceId === '1'
      ? 'https://readdy.ai/api/search-image?query=modern%20cozy%20coffee%20shop%20interior%20with%20warm%20lighting%2C%20barista%20counter%2C%20coffee%20machines%2C%20comfortable%20seating%20area%2C%20wooden%20furniture%2C%20plants%2C%20minimalist%20design%2C%20bright%20atmosphere&width=800&height=300&seq=workplace1review&orientation=landscape'
      : 'https://readdy.ai/api/search-image?query=modern%20fast%20food%20restaurant%20interior%20with%20red%20and%20yellow%20colors%2C%20clean%20counter%20area%2C%20digital%20menu%20boards%2C%20bright%20lighting%2C%20organized%20kitchen%20space%2C%20contemporary%20design&width=800&height=300&seq=workplace2review&orientation=landscape',
  };

  const categories = [
    { key: 'workEnvironment', label: '근무 환경', icon: 'ri-building-line', color: 'blue' },
    { key: 'management', label: '경영진', icon: 'ri-user-star-line', color: 'purple' },
    { key: 'salary', label: '급여/복지', icon: 'ri-money-dollar-circle-line', color: 'green' }
  ];

  const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: { [key: string]: { [key: string]: string } } = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
      green: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' }
    };
    return colors[color][type];
  };

  const handleCategoryRating = (category: string, value: number) => {
    setReviewData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateOverallRating = () => {
    const ratings = [
      reviewData.workEnvironment,
      reviewData.management,
      reviewData.salary
    ];
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / ratings.length;
    return Math.round(avg * 10) / 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const overallRating = calculateOverallRating();
    if (overallRating === 0) {
      alert('최소 하나 이상의 항목에 평가를 남겨주세요.');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('평가 제출:', {
        workplaceId,
        overallRating,
        ...reviewData
      });
      alert('평가가 성공적으로 등록되었습니다! ⭐\n소중한 의견 감사합니다.');
      setIsSubmitting(false);
      window.location.href = `/employee-dashboard/workplace/${workplaceId}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/employee-dashboard/workplace/${workplaceId}`}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">근무지 평가</h1>
                <p className="text-gray-600">솔직한 평가를 남겨주세요</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-star-fill text-yellow-400 text-xl"></i>
              <span className="text-2xl font-bold text-gray-800">{calculateOverallRating().toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workplace Info */}
        <div className="relative mb-8">
          <img
            src={workplace.image}
            alt={workplace.name}
            className="w-full h-64 object-cover object-top rounded-3xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
          <div className="absolute bottom-6 left-6">
            <div className="bg-white bg-opacity-95 rounded-2xl p-4">
              <h2 className="text-xl font-bold text-gray-800">{workplace.name}</h2>
              <p className="text-gray-600">{workplace.role}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Ratings */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="ri-star-line mr-3 text-purple-500"></i>
              항목별 평가
            </h3>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className={`${category.icon} ${getColorClass(category.color, 'text')} text-xl`}></i>
                      <span className="font-medium text-gray-800">{category.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleCategoryRating(category.key, star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <i
                            className={`text-2xl ${
                              star <= (reviewData[category.key as keyof typeof reviewData] as number)
                                ? 'ri-star-fill text-yellow-400'
                                : 'ri-star-line text-gray-300'
                            }`}
                          ></i>
                        </button>
                      ))}
                      <span className="text-sm font-medium text-gray-600 ml-2 w-8">
                        {(reviewData[category.key as keyof typeof reviewData] as number) > 0
                          ? `${reviewData[category.key as keyof typeof reviewData]}.0`
                          : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getColorClass(category.color, 'bg')} transition-all duration-300`}
                      style={{ width: `${((reviewData[category.key as keyof typeof reviewData] as number) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="ri-edit-line mr-3 text-blue-500"></i>
              한 줄 평가
            </h3>
            <input
              type="text"
              value={reviewData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="이 근무지를 한 줄로 표현한다면?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-2">{reviewData.title.length}/100자</p>
          </div>

          {/* Detailed Review */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="ri-file-text-line mr-3 text-green-500"></i>
              상세 평가
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👍 장점
                </label>
                <textarea
                  value={reviewData.pros}
                  onChange={(e) => handleInputChange('pros', e.target.value)}
                  placeholder="이 근무지의 좋았던 점을 알려주세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{reviewData.pros.length}/500자</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👎 단점
                </label>
                <textarea
                  value={reviewData.cons}
                  onChange={(e) => handleInputChange('cons', e.target.value)}
                  placeholder="이 근무지의 아쉬웠던 점을 알려주세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{reviewData.cons.length}/500자</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💡 경영진에게 하고 싶은 말
                </label>
                <textarea
                  value={reviewData.advice}
                  onChange={(e) => handleInputChange('advice', e.target.value)}
                  placeholder="경영진에게 전하고 싶은 조언이나 제안사항을 남겨주세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{reviewData.advice.length}/500자</p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="ri-information-line mr-3 text-blue-500"></i>
              평가 작성 가이드
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  이렇게 작성해주세요
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 구체적이고 객관적인 경험</li>
                  <li>• 건설적인 피드백</li>
                  <li>• 다른 직원들에게 도움이 되는 정보</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-4">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <i className="ri-close-line text-red-500 mr-2"></i>
                  이런 내용은 피해주세요
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 욕설이나 비방</li>
                  <li>• 개인정보 노출</li>
                  <li>• 근거 없는 주장</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Link
              href={`/employee-dashboard/workplace/${workplaceId}`}
              className="flex-1 bg-gray-100 text-gray-600 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
            >
              <i className="ri-close-line mr-2"></i>
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || calculateOverallRating() === 0}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line mr-2 animate-spin"></i>
                  제출 중...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-fill mr-2"></i>
                  평가 등록하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
