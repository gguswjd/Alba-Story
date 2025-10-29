'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import BossQuickActions from '@/components/BossQuickActions';
import WorkplaceManageCard from '@/components/WorkplaceManageCard';
import { useRouter } from 'next/navigation';

type MeResponse = {
  id: number;
  name?: string;
  role?: string;
}

export default function BossDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('me') : null;
    if (cached) {
      try { setMe(JSON.parse(cached)); } catch {}
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    console.log('[Dashboard] existing token = ', token);
    if (!token) {
      console.warn('[Dashboard] No token -> redirect to /login');
      // 토큰 없으면 로그인 페이지로
      router.replace('/login');
      return;
    }

    (async () => {
      const traceId = `me-${Date.now()}`;
      try {
        const res = await fetch('http://localhost:8080/api/user/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store', // 최신 프로필 보장
        });

        const text = await res.text(); // 응답 전문
        console.log(`[Dashboard][${traceId}] status=`, res.status);
        console.log(`[Dashboard][${traceId}] headers=`, Object.fromEntries(res.headers.entries()));
        console.log(`[Dashboard][${traceId}] body=`, text);

        if (res.status === 401) {
          console.warn(`[Dashboard][${traceId}] 401 → redirect to /login`);
          router.replace('/login');
          return;
        }
        if (!res.ok) {
          console.error(`[Dashboard][${traceId}] !ok:`, res.status, text);
          // 실패해도 일단 머물러서 화면에서 이유를 볼 수 있게 하려면 redirect 잠깐 주석
          // router.replace('/login');
          return;
        }

        const data: MeResponse = JSON.parse(text);
        setMe(data);
        localStorage.setItem('me', JSON.stringify(data));
      } catch (e) {
        console.error(`[Dashboard][${traceId} fetch error:]`, e);
      } finally {
        setLoadingMe(false);
      }
    })();
  }, [router]);

  const [workplaces, setWorkplaces] = useState([]);
  const [loadingWorkplaces, setLoadingWorkplaces] = useState(true);

  // 근무지 목록 조회
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    (async () => {
      try {
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

  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // 최근 활동 조회 (가입 신청 등)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    (async () => {
      try {
        // 각 근무지의 가입 신청 조회
        const activities = [];
        for (const workplace of workplaces) {
          const res = await fetch(`http://localhost:8080/api/workplace/${workplace.workplaceId}/requests`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const requests = await res.json();
            requests.forEach(req => {
              if (req.status === 'Pending') {
                activities.push({
                  id: req.requestId,
                  type: 'employee',
                  message: `${req.userName}님이 ${req.workplaceName}에 참여 신청했습니다`,
                  time: '방금 전',
                  workplace: req.workplaceName,
                  status: 'pending',
                  requestId: req.requestId
                });
              }
            });
          }
        }
        setRecentActivities(activities);
      } catch (error) {
        console.error('활동 조회 실패:', error);
      } finally {
        setLoadingActivities(false);
      }
    })();
  }, [workplaces]);

  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);

  // 승인 대기 목록 조회
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    (async () => {
      try {
        const approvals = [];
        for (const workplace of workplaces) {
          const res = await fetch(`http://localhost:8080/api/workplace/${workplace.workplaceId}/requests`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const requests = await res.json();
            requests.forEach(req => {
              if (req.status === 'Pending') {
                approvals.push({
                  id: req.requestId,
                  name: req.userName,
                  position: '신규',
                  experience: '신입',
                  rating: 0,
                  workplace: req.workplaceName,
                  appliedTime: '방금 전',
                  requestId: req.requestId,
                  userId: req.userId,
                  workplaceId: req.workplaceId
                });
              }
            });
          }
        }
        setPendingApprovals(approvals);
      } catch (error) {
        console.error('승인 대기 조회 실패:', error);
      } finally {
        setLoadingApprovals(false);
      }
    })();
  }, [workplaces]);

  const managementTools = [
    { id: 1, title: '직원 관리', description: '직원 정보 및 근무 이력 관리', icon: 'team', color: 'blue' },
    { id: 2, title: '스케줄 관리', description: '근무 일정 및 시프트 관리', icon: 'calendar', color: 'green' },
    { id: 3, title: '급여 관리', description: '급여 계산 및 지급 관리', icon: 'money', color: 'yellow' },
    { id: 5, title: '공지사항', description: '직원들에게 공지사항 발송', icon: 'notification', color: 'orange' }
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
                  {loadingMe
                    ? '안녕하세요…' 
                    : `안녕하세요, ${me?.name ?? '사장님'}님!`}
                </h1>
                <p className="text-xl text-gray-600">
                  오늘도 성공적인 매장 운영하세요!
                </p>
              </div>
              <div className="text-6xl">🏪</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
            <div className="text-3xl font-bold mb-2 text-blue-500">2</div>
            <div className="text-gray-600">운영 매장</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
            <div className="text-3xl font-bold mb-2 text-green-500">20</div>
            <div className="text-gray-600">총 직원수</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100">
            <div className="text-3xl font-bold mb-2 text-orange-500">13</div>
            <div className="text-gray-600">오늘 근무자</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100">
            <div className="text-3xl font-bold mb-2 text-purple-500">4.7</div>
            <div className="text-gray-600">평균 평점</div>
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
              🏪 매장 관리
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'employees'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              👥 직원 관리
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🛠️ 관리 도구
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Overview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">📈</span>
                  오늘의 현황
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">스타벅스 강남점</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">근무자</span>
                        <span className="font-medium">5명</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">맥도날드 홍대점</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">근무자</span>
                        <span className="font-medium">8명</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <BossQuickActions />
            </div>

            {/* Recent Activities */}
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">🔔</span>
                  최근 활동
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.status === 'pending' ? 'bg-yellow-100' :
                          activity.status === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <i className={`ri-${
                            activity.type === 'employee' ? 'user-add' :
                            activity.type === 'schedule' ? 'calendar-check' : 'star'
                          }-line text-sm ${
                            activity.status === 'pending' ? 'text-yellow-500' :
                            activity.status === 'warning' ? 'text-red-500' : 'text-blue-500'
                          }`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 mb-1">{activity.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{activity.workplace}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
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
              <h2 className="text-2xl font-bold text-gray-800">매장 관리 🏪</h2>
              <button 
              onClick={() => router.push('/boss-dashboard/new-workplace')}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm">
                <i className="ri-add-line mr-2"></i>
                새 매장 등록
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loadingWorkplaces ? (
                <div className="col-span-2 text-center py-8">로딩 중...</div>
              ) : workplaces.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  등록된 근무지가 없습니다.
                </div>
              ) : (
                workplaces.map((workplace) => (
                  <WorkplaceManageCard key={workplace.workplaceId} workplace={workplace} />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">직원 관리 👥</h2>
              <div className="flex space-x-4">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm">
                  <i className="ri-user-search-line mr-2"></i>
                  직원 검색
                </button>
                <button className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm">
                  <i className="ri-mail-send-line mr-2"></i>
                  공지 발송
                </button>
              </div>
            </div>

            {/* Current Employees */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">👥</span>
                현재 직원 현황
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="font-bold text-lg text-gray-800 mb-4">스타벅스 강남점</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">총 직원</span>
                      <span className="font-bold text-blue-600">8명</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">오늘 근무</span>
                      <span className="font-medium">5명</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">평균 평점</span>
                      <span className="font-medium">⭐ 4.8</span>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                  <h4 className="font-bold text-lg text-gray-800 mb-4">맥도날드 홍대점</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">총 직원</span>
                      <span className="font-bold text-red-600">12명</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">오늘 근무</span>
                      <span className="font-medium">8명</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">평균 평점</span>
                      <span className="font-medium">⭐ 4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">관리 도구 🛠️</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {managementTools.map((tool) => (
                <div key={tool.id} className={`bg-white rounded-3xl p-8 shadow-sm border border-${tool.color}-100 hover:shadow-lg transition-all cursor-pointer`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-${tool.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <i className={`ri-${tool.icon}-line text-${tool.color}-500 text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{tool.title}</h3>
                    <p className="text-gray-600 mb-6">{tool.description}</p>
                    <button className={`bg-${tool.color}-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-${tool.color}-600 transition-colors whitespace-nowrap`}>
                      사용하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
