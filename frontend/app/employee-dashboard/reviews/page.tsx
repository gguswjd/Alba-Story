'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function ReviewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const workplaceReviews = [
    {
      id: 1,
      workplaceName: '스타벅스 강남점',
      type: '카페',
      averageRating: 4.8,
      reviewCount: 24,
      tags: ['분위기 좋음', '교육 체계적', '복지 우수']
    },
    {
      id: 2,
      workplaceName: '맥도날드 홍대점',
      type: '패스트푸드',
      averageRating: 4.5,
      reviewCount: 18,
      tags: ['시급 높음', '근무 환경 좋음', '동료 친절']
    },
    {
      id: 3,
      workplaceName: 'CU 편의점 신촌점',
      type: '편의점',
      averageRating: 4.2,
      reviewCount: 15,
      tags: ['자유로운 분위기', '야간 수당 좋음', '근무 편함']
    },
    {
      id: 4,
      workplaceName: '아웃백 스테이크하우스 강남점',
      type: '레스토랑',
      averageRating: 4.6,
      reviewCount: 21,
      tags: ['팁 많음', '식사 제공', '교육 좋음']
    },
    {
      id: 5,
      workplaceName: '파리바게뜨 역삼점',
      type: '베이커리',
      averageRating: 4.3,
      reviewCount: 12,
      tags: ['빵 할인', '분위기 좋음', '근무 시간 유연']
    },
    {
      id: 6,
      workplaceName: '투썸플레이스 서초점',
      type: '카페',
      averageRating: 4.7,
      reviewCount: 19,
      tags: ['복지 좋음', '교육 체계적', '근무 환경 쾌적']
    },
    {
      id: 7,
      workplaceName: 'GS25 편의점 이태원점',
      type: '편의점',
      averageRating: 4.1,
      reviewCount: 10,
      tags: ['야간 수당', '자유로움', '근무 편함']
    },
    {
      id: 8,
      workplaceName: '버거킹 신림점',
      type: '패스트푸드',
      averageRating: 4.4,
      reviewCount: 16,
      tags: ['시급 좋음', '식사 제공', '동료 좋음']
    },
    {
      id: 9,
      workplaceName: '빕스 잠실점',
      type: '레스토랑',
      averageRating: 4.5,
      reviewCount: 14,
      tags: ['식사 제공', '팁 있음', '근무 환경 좋음']
    },
    {
      id: 10,
      workplaceName: '던킨도너츠 종로점',
      type: '베이커리',
      averageRating: 4.2,
      reviewCount: 11,
      tags: ['도넛 할인', '분위기 좋음', '근무 편함']
    }
  ];

  const categories = ['전체', '카페', '패스트푸드', '편의점', '레스토랑', '베이커리'];

  const filteredReviews = workplaceReviews.filter(review => {
    const matchesCategory = selectedCategory === '전체' || review.type === selectedCategory;
    const matchesSearch = review.workplaceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/employee-dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <i className="ri-arrow-left-line text-gray-600"></i>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">근무지 후기</h1>
                <p className="text-gray-600 mt-1">다른 알바생들의 솔직한 후기를 확인하세요</p>
              </div>
            </div>
            <Link
              href="/employee-dashboard/reviews/write"
              className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2 shadow-sm"
            >
              <i className="ri-edit-line"></i>
              <span>후기 작성하기</span>
            </Link>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="근무지 이름으로 검색하세요..."
              className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white cursor-pointer whitespace-nowrap"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Link
              key={review.id}
              href={`/employee-dashboard/reviews/workplace/${review.id}`}
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{review.workplaceName}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium">
                      {review.type}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <i className="ri-star-fill text-yellow-400 text-lg"></i>
                      <span className="text-xl font-bold text-gray-800">{review.averageRating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{review.reviewCount}개 후기</p>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
