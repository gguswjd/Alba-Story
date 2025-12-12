'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Review {
  id: number;
  workplaceId: number;
  workplaceName: string;
  category: string;
  role: string;
  author: string;
  workPeriod: string;
  overallRating: number;
  workEnvironment: number;
  management: number;
  salary: number;
  title: string;
  pros: string;
  cons: string;
  advice: string;
  likes: number;
  date: string;
}

interface WorkplaceReviewsProps {
  workplaceId: number;
}

export default function WorkplaceReviews({ workplaceId }: WorkplaceReviewsProps) {
  const [likedReviews, setLikedReviews] = useState<number[]>([]);

  const allReviews: Review[] = [
    {
      id: 1,
      workplaceId: 1,
      workplaceName: '스타벅스 강남점',
      category: '카페',
      role: '바리스타',
      author: '익명',
      workPeriod: '6개월',
      overallRating: 4.5,
      workEnvironment: 5,
      management: 4,
      salary: 4,
      title: '분위기 좋고 배울 것도 많은 곳',
      pros: '매장 분위기가 좋고 동료들이 친절해요. 커피 만드는 기술을 배울 수 있어서 좋았습니다. 직원 할인도 있어서 커피를 저렴하게 마실 수 있어요.',
      cons: '피크 타임에는 정말 바빠서 힘들어요. 손님이 많을 때는 쉴 틈이 없습니다.',
      advice: '피크 타임 인력 배치를 좀 더 늘려주시면 좋겠어요.',
      likes: 24,
      date: '2024-01-15'
    },
    {
      id: 2,
      workplaceId: 2,
      workplaceName: '맥도날드 홍대점',
      category: '패스트푸드',
      role: '크루',
      author: '익명',
      workPeriod: '1년',
      overallRating: 4.0,
      workEnvironment: 4,
      management: 4,
      salary: 4,
      title: '체계적인 시스템이 장점',
      pros: '매뉴얼이 잘 되어있어서 일하기 편해요. 시급도 괜찮고 주휴수당도 잘 나옵니다. 직원 식사 제공도 좋아요.',
      cons: '주말에는 정말 바쁘고, 손님 응대가 힘들 때가 있어요.',
      advice: '주말 인력을 더 충원해주시면 좋겠습니다.',
      likes: 18,
      date: '2024-01-14'
    },
    {
      id: 3,
      workplaceId: 3,
      workplaceName: 'CU 신촌점',
      category: '편의점',
      role: '점원',
      author: '익명',
      workPeriod: '3개월',
      overallRating: 3.5,
      workEnvironment: 3,
      management: 4,
      salary: 3,
      title: '혼자 일하는 시간이 많아요',
      pros: '일이 단순하고 배우기 쉬워요. 점주님이 친절하시고 융통성이 있어요.',
      cons: '혼자 일하는 시간이 많아서 화장실도 못 가요. 야간 근무는 무서워요.',
      advice: '2인 근무 시간을 늘려주시면 좋겠어요.',
      likes: 12,
      date: '2024-01-13'
    },
    {
      id: 4,
      workplaceId: 4,
      workplaceName: '투썸플레이스 이대점',
      category: '카페',
      role: '바리스타',
      author: '익명',
      workPeriod: '8개월',
      overallRating: 4.8,
      workEnvironment: 5,
      management: 5,
      salary: 4,
      title: '최고의 알바 경험!',
      pros: '점장님이 정말 좋으시고 동료들과 분위기가 최고예요. 케이크 만드는 것도 배울 수 있어요. 근무 환경이 쾌적하고 복지도 좋아요.',
      cons: '특별히 단점은 없어요. 가끔 손님이 많을 때 바쁜 정도?',
      advice: '지금처럼만 해주세요!',
      likes: 31,
      date: '2024-01-12'
    },
    {
      id: 5,
      workplaceId: 5,
      workplaceName: '버거킹 신림점',
      category: '패스트푸드',
      role: '크루',
      author: '익명',
      workPeriod: '4개월',
      overallRating: 3.8,
      workEnvironment: 4,
      management: 3,
      salary: 4,
      title: '일은 힘들지만 시급은 괜찮아요',
      pros: '시급이 다른 곳보다 높아요. 직원 할인이 50%라서 좋아요. 일이 단순해서 금방 익숙해져요.',
      cons: '주방이 더워요. 매니저마다 스타일이 달라서 혼란스러울 때가 있어요.',
      advice: '매뉴얼을 좀 더 통일해주시면 좋겠어요.',
      likes: 9,
      date: '2024-01-11'
    },
    {
      id: 6,
      workplaceId: 6,
      workplaceName: '올리브영 명동점',
      category: '소매점',
      role: '판매사원',
      author: '익명',
      workPeriod: '5개월',
      overallRating: 4.2,
      workEnvironment: 4,
      management: 4,
      salary: 4,
      title: '화장품 좋아하면 추천!',
      pros: '직원 할인이 좋아요. 신제품을 먼저 써볼 수 있어요. 동료들이 친절하고 분위기가 좋아요.',
      cons: '서서 일하는 시간이 길어서 다리가 아파요. 손님 응대가 많아서 피곤해요.',
      advice: '휴게 시간을 좀 더 자주 가질 수 있으면 좋겠어요.',
      likes: 15,
      date: '2024-01-10'
    }
  ];

  const workplaceReviews = allReviews.filter(review => review.workplaceId === workplaceId);
  const workplace = workplaceReviews[0];

  if (!workplace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/employee-dashboard/reviews"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-line text-gray-600"></i>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">해당 매장의 후기가 없습니다</h1>
                  <p className="text-gray-600">해당 매장의 후기가 없습니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl p-12 text-center">
            <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600">해당 매장의 후기가 없습니다</p>
            <Link
              href="/employee-dashboard/reviews"
              className="inline-block mt-6 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              전체 후기 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = (
    workplaceReviews.reduce((sum, review) => sum + review.overallRating, 0) / workplaceReviews.length
  ).toFixed(1);

  const averageWorkEnvironment = (
    workplaceReviews.reduce((sum, review) => sum + review.workEnvironment, 0) / workplaceReviews.length
  ).toFixed(1);

  const averageManagement = (
    workplaceReviews.reduce((sum, review) => sum + review.management, 0) / workplaceReviews.length
  ).toFixed(1);

  const averageSalary = (
    workplaceReviews.reduce((sum, review) => sum + review.salary, 0) / workplaceReviews.length
  ).toFixed(1);

  const handleLike = (reviewId: number) => {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(likedReviews.filter(id => id !== reviewId));
    } else {
      setLikedReviews([...likedReviews, reviewId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/employee-dashboard/reviews"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{workplace.workplaceName} 후기</h1>
                <p className="text-gray-600">이 매장의 모든 후기를 확인하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                  {workplace.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{workplace.workplaceName}</h1>
              <p className="text-gray-600">총 {workplaceReviews.length}개의 후기</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-star-fill text-yellow-400 text-3xl"></i>
                <span className="text-4xl font-bold text-gray-800">{averageRating}</span>
              </div>
              <p className="text-sm text-gray-600">평균 평점</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="text-center bg-blue-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">근무 환경</p>
              <div className="flex items-center justify-center space-x-1">
                <i className="ri-star-fill text-yellow-400"></i>
                <span className="text-xl font-bold text-gray-800">{averageWorkEnvironment}</span>
              </div>
            </div>
            <div className="text-center bg-green-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">경영진</p>
              <div className="flex items-center justify-center space-x-1">
                <i className="ri-star-fill text-yellow-400"></i>
                <span className="text-xl font-bold text-gray-800">{averageManagement}</span>
              </div>
            </div>
            <div className="text-center bg-purple-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600 mb-2">급여/복지</p>
              <div className="flex items-center justify-center space-x-1">
                <i className="ri-star-fill text-yellow-400"></i>
                <span className="text-xl font-bold text-gray-800">{averageSalary}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <i className="ri-file-list-line mr-2 text-purple-500"></i>
            후기 목록
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {workplaceReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      익명 · {review.role} · {review.workPeriod} 근무
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-star-fill text-yellow-400 text-xl"></i>
                    <span className="text-2xl font-bold text-gray-800">
                      {review.overallRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">근무 환경</p>
                    <div className="flex items-center justify-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      <span className="font-medium text-gray-800">{review.workEnvironment.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">경영진</p>
                    <div className="flex items-center justify-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      <span className="font-medium text-gray-800">{review.management.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">급여/복지</p>
                    <div className="flex items-center justify-center space-x-1">
                      <i className="ri-star-fill text-yellow-400 text-sm"></i>
                      <span className="font-medium text-gray-800">{review.salary.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-3 text-lg">
                  "{review.title}"
                </h4>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">👍 장점</p>
                    <p className="text-sm text-gray-700">{review.pros}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-1">👎 단점</p>
                    <p className="text-sm text-gray-700">{review.cons}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                      likedReviews.includes(review.id)
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <i className={`${likedReviews.includes(review.id) ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
                    <span className="text-sm font-medium">
                      {review.likes + (likedReviews.includes(review.id) ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
