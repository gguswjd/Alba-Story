'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WriteReviewForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    workplaceName: '',
    category: '카페',
    role: '',
    workPeriod: '',
    overallRating: 5,
    workEnvironment: 5,
    management: 5,
    salary: 5,
    title: '',
    pros: '',
    cons: '',
    advice: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = ['카페', '패스트푸드', '편의점', '레스토랑', '베이커리', '소매점', '기타'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setTimeout(() => {
      router.push('/employee-dashboard/reviews');
    }, 2000);
  };

  const handleRatingChange = (field: string, value: number) => {
    setFormData({ ...formData, [field]: value });
  };

  const RatingSelector = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="w-10 h-10 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
          >
            <i className={`${value >= rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'} text-2xl`}></i>
          </button>
        ))}
        <span className="ml-2 text-lg font-bold text-gray-800">{value}.0</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/employee-dashboard/reviews"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-gray-600"></i>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">근무지 후기 작성 ✍️</h1>
              <p className="text-gray-600">솔직한 후기로 다른 알바생들을 도와주세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="ri-building-line mr-2 text-purple-500"></i>
              근무지 정보
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  근무지 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.workplaceName}
                  onChange={(e) => setFormData({ ...formData, workplaceName: e.target.value })}
                  placeholder="예: 스타벅스 강남점"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    업종 <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직무 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="예: 바리스타, 홀서빙"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  근무 기간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.workPeriod}
                  onChange={(e) => setFormData({ ...formData, workPeriod: e.target.value })}
                  placeholder="예: 6개월, 1년"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="ri-star-line mr-2 text-purple-500"></i>
              평가하기
            </h2>
            
            <div className="space-y-6">
              <RatingSelector
                label="전체 평점"
                value={formData.overallRating}
                onChange={(value) => handleRatingChange('overallRating', value)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <RatingSelector
                  label="근무 환경"
                  value={formData.workEnvironment}
                  onChange={(value) => handleRatingChange('workEnvironment', value)}
                />
                <RatingSelector
                  label="경영진"
                  value={formData.management}
                  onChange={(value) => handleRatingChange('management', value)}
                />
                <RatingSelector
                  label="급여/복지"
                  value={formData.salary}
                  onChange={(value) => handleRatingChange('salary', value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="ri-file-text-line mr-2 text-purple-500"></i>
              상세 후기
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  후기 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="한 줄로 요약해주세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-600 mb-2">
                  👍 장점 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.pros}
                  onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                  placeholder="이 근무지의 좋았던 점을 자세히 알려주세요"
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.pros.length}/500자</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  👎 단점 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.cons}
                  onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                  placeholder="이 근무지의 아쉬웠던 점을 솔직하게 알려주세요"
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.cons.length}/500자</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  💡 조언 (선택)
                </label>
                <textarea
                  value={formData.advice}
                  onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
                  placeholder="경영진이나 미래의 알바생들에게 하고 싶은 말이 있나요?"
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.advice.length}/500자</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-blue-500 text-xl mt-0.5"></i>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-2">후기 작성 안내</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 모든 후기는 익명으로 게시됩니다</li>
                  <li>• 솔직하고 구체적인 후기가 다른 알바생들에게 큰 도움이 됩니다</li>
                  <li>• 욕설이나 비방은 삼가주세요</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/employee-dashboard/reviews"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
            >
              <i className="ri-send-plane-fill"></i>
              <span>후기 등록하기</span>
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-3xl text-green-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">후기가 등록되었습니다! 🎉</h3>
            <p className="text-gray-600">소중한 후기 감사합니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
