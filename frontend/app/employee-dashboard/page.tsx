'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import QuickActions from '@/components/QuickActions';
import WorkplaceCard from '@/components/WorkplaceCard';
import JoinWorkplaceModal from '@/components/JoinWorkplaceModal';

type MeResponse = {
  id: number;
  name?: string;
  email?: string;
  role?: string;
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  // ✅ 로그인 토큰 검증 및 유저 정보 불러오기
  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      console.warn('[EmployeeDashboard] 토큰 없음 → 로그인 페이지로 이동');
      router.replace('/login');
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/user/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (res.status === 401) {
          console.warn('[EmployeeDashboard] 401 → 로그인 만료');
          router.replace('/login');
          return;
        }

        const data: MeResponse = await res.json();
        console.log('[EmployeeDashboard] me =', data);
        setMe(data);
      } catch (error) {
        console.error('[EmployeeDashboard] /api/user/me 에러', error);
        router.replace('/login');
      } finally {
        setLoadingMe(false);
      }
    })();
  }, [router]);

  // ✅ 로딩 중일 때
  if (loadingMe) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로딩 중...
      </div>
    );
  }

  // ✅ 유저 정보 없음 (예: 백엔드에서 404 리턴)
  if (!me) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로그인 정보가 유효하지 않습니다.
      </div>
    );
  }

  const [workplaces, setWorkplaces] = useState([]);
  const [loadingWorkplaces, setLoadingWorkplaces] = useState(true);

  // 내 근무지 목록 조회
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    (async () => {
      try {
        // WorkInfo를 통해 내 근무지 조회
        const res = await fetch('http://localhost:8080/api/workplace/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWorkplaces(data);
        }
      } catch (error) {
        console.error('근무지 조회 실패:', error);
      } finally {
        setLoadingWorkplaces(false);
      }
    })();
  }, []);

  const [mySchedules, setMySchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  // 내 스케줄 조회
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/schedule/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMySchedules(data);
        }
      } catch (error) {
        console.error('스케줄 조회 실패:', error);
      } finally {
        setLoadingSchedules(false);
      }
    })();
  }, []);

  const communityPosts = [
    {
      id: 1,
      title: '카페 알바 꿀팁 공유해요! ☕',
      author: '바리스타짱',
      likes: 24,
      comments: 8,
      time: '3시간 전',
      category: 'tip',
    },
    {
      id: 2,
      title: '편의점 야간 근무 후기',
      author: '야근러',
      likes: 18,
      comments: 12,
      time: '5시간 전',
      category: 'review',
    },
    {
      id: 3,
      title: '최저임금 관련 질문있어요',
      author: '알바생123',
      likes: 31,
      comments: 15,
      time: '1일 전',
      category: 'question',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  안녕하세요, {me?.name ?? '알바생'}님!
                </h1>
                <p className="text-xl text-gray-600">오늘도 화이팅하세요!</p>
              </div>
              <div className="text-6xl">💼</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
            <div className="text-3xl font-bold mb-2 text-blue-500">2</div>
            <div className="text-gray-600">참여 근무지</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
            <div className="text-3xl font-bold mb-2 text-green-500">24</div>
            <div className="text-gray-600">이번달 근무</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100">
            <div className="text-3xl font-bold mb-2 text-orange-500">4.5</div>
            <div className="text-gray-600">평균 평점</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100">
            <div className="text-3xl font-bold mb-2 text-purple-500">12</div>
            <div className="text-gray-600">커뮤니티 활동</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 inline-flex">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              📊 대시보드
            </button>
            <button
              onClick={() => setActiveTab('workplaces')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'workplaces'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🏪 내 근무지
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'community'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              💬 커뮤니티
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🛠️ 유용한 도구
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">📅</span>
                  오늘의 스케줄
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-800">스타벅스 강남점</h3>
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">진행중</span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center">
                        <i className="ri-time-line mr-2"></i>
                        14:00 - 20:00
                      </span>
                      <span className="flex items-center">
                        <i className="ri-user-line mr-2"></i>
                        바리스타
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-3">😴</div>
                      <p>내일은 휴무일이에요!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <QuickActions />
            </div>

            {/* Notifications */}
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">🔔</span>
                  최근 알림
                </h2>
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div key={notification.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className={`ri-${notification.type === 'schedule' ? 'calendar' : notification.type === 'payment' ? 'money-dollar-circle' : 'notification'}-line text-blue-500 text-sm`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 mb-1">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{notification.workplace}</p>
                            <p className="text-xs text-gray-400">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workplaces' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">내 근무지 관리 🏪</h2>
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <i className="ri-add-line mr-2"></i>
                새 근무지 참여
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loadingWorkplaces ? (
                <div className="col-span-2 text-center py-8">로딩 중...</div>
              ) : workplaces.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  참여한 근무지가 없습니다.
                </div>
              ) : (
                workplaces.map((workplace) => (
                  <WorkplaceCard key={workplace.workplaceId} workplace={workplace} />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">알바생 커뮤니티 💬</h2>
              <button className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm">
                <i className="ri-edit-line mr-2"></i>
                글 작성하기
              </button>
            </div>

            {/* Community Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">알바 후기</h3>
                <p className="text-gray-600 text-sm">실제 근무 경험 공유</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-yellow-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">알바 꿀팁</h3>
                <p className="text-gray-600 text-sm">유용한 노하우 공유</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">권리 교육</h3>
                <p className="text-gray-600 text-sm">알바생 권리 정보</p>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">최근 게시글</h3>
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-800 flex-1">{post.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.category === 'tip' ? 'bg-yellow-100 text-yellow-600' :
                        post.category === 'review' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {post.category === 'tip' ? '꿀팁' : post.category === 'review' ? '후기' : '질문'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <i className="ri-heart-line mr-1"></i>
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-chat-3-line mr-1"></i>
                          {post.comments}
                        </span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">유용한 도구들 🛠️</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Salary Calculator */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-calculator-line text-green-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">급여 계산기</h3>
                  <p className="text-gray-600 mb-6">시급과 근무시간으로 급여를 계산해보세요</p>
                  <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors whitespace-nowrap">
                    계산하기
                  </button>
                </div>
              </div>

              {/* Labor Rights Guide */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-shield-check-line text-purple-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">권리 가이드</h3>
                  <p className="text-gray-600 mb-6">알바생이 알아야 할 권리와 법적 정보</p>
                  <button className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors whitespace-nowrap">
                    보러가기
                  </button>
                </div>
              </div>

              {/* Schedule Manager */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-calendar-check-line text-blue-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">스케줄 관리</h3>
                  <p className="text-gray-600 mb-6">내 근무 일정을 한눈에 확인하세요</p>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors whitespace-nowrap">
                    확인하기
                  </button>
                </div>
              </div>

              {/* Review System */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-star-line text-orange-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">근무지 평가</h3>
                  <p className="text-gray-600 mb-6">근무지에 대한 솔직한 평가를 남겨보세요</p>
                  <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors whitespace-nowrap">
                    평가하기
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Join Workplace Modal */}
      <JoinWorkplaceModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
