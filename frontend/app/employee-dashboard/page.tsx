'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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

type Notification = {
  id: number;
  type: 'schedule' | 'payment' | 'notice';
  message: string;
  workplace: string;
  time: string;
};

type WorkplaceStatus = 'active' | 'inactive' | 'pending';

type WorkplaceForCard = {
  id: number;
  name: string;
  role: string;
  status: WorkplaceStatus;
  nextShift: string;
  manager: string;
  rating: number;
  image: string;
};

type MySchedule = {
  id: number;
  workplaceId: number;
  startTime: string;
  endTime: string;
  role?: string;
};

// ===== 공통: 토큰 조회 =====
const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  );
};

// ===== 날짜/시간 유틸 =====
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatTimeHHMM = (dateStr: string) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const getScheduleStatusLabel = (startStr: string, endStr: string) => {
  const now = new Date();
  const start = new Date(startStr);
  const end = new Date(endStr);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '예정';
  }

  if (now < start) return '예정';
  if (now >= start && now <= end) return '진행중';
  return '종료';
};

const formatRelativeDateLabel = (dateStr: string) => {
  const target = new Date(dateStr);
  const now = new Date();

  if (Number.isNaN(target.getTime())) return '';

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const targetDay = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const diffMs = targetDay.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '내일';
  if (diffDays === -1) return '어제';

  return target.toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });
};

export default function EmployeeDashboard() {
  const router = useRouter();

  // ===== 상태 선언 =====
  const [activeTab, setActiveTab] =
    useState<'dashboard' | 'workplaces' | 'community' | 'tools'>('dashboard');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [workplaces, setWorkplaces] = useState<WorkplaceForCard[]>([]);
  const [loadingWorkplaces, setLoadingWorkplaces] = useState(true);

  const [mySchedules, setMySchedules] = useState<MySchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  // ===== 내 정보 조회 =====
  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setLoadingMe(false);
      router.replace('/login');
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/user/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (res.status === 401 || res.status === 403) {
          console.warn('[EmployeeDashboard] /api/user/me 인증 실패', res.status);
          setMe(null);
          router.replace('/login');
          return;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            '[EmployeeDashboard] /api/user/me 실패',
            res.status,
            errorText,
          );
          setMe(null);
          return;
        }

        const text = await res.text();
        if (!text) {
          console.error('[EmployeeDashboard] /api/user/me 응답이 비어있음');
          setMe(null);
          return;
        }

        const data: MeResponse = JSON.parse(text);
        setMe(data);
      } catch (err) {
        console.error('[EmployeeDashboard] /api/user/me 에러', err);
        setMe(null);
        router.replace('/login');
      } finally {
        setLoadingMe(false);
      }
    })();
  }, [router]);

  // ===== 내 근무지 조회 (직원용) =====
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoadingWorkplaces(false);
      return;
    }

    const loadWorkplaces = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/workplace/employee/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.warn('근무지 조회 실패 상태코드:', res.status, text);
          setWorkplaces([]);
          return;
        }

        const raw: any[] = await res.json();
        console.log('[EmployeeDashboard] /api/workplace/employee/my raw:', raw);

        const approvedWorkplaces: WorkplaceForCard[] = raw.map((w) => ({
          id: Number(w.workplaceId),
          name: String(w.workName ?? '이름 없음'),
          role: '직무 미지정',
          status: 'active',
          nextShift: '',
          manager: String(w.user?.name ?? '관리자 미지정'),
          rating: 0,
          image: '/placeholder.png',
        }));

        setWorkplaces(approvedWorkplaces);
      } catch (e) {
        console.error('근무지 조회 실패:', e);
        setWorkplaces([]);
      } finally {
        setLoadingWorkplaces(false);
      }
    };

    loadWorkplaces();
  }, []);

  // ===== 내 스케줄 조회 =====
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoadingSchedules(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/schedule/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn('스케줄 조회 실패 상태코드:', res.status);
          return;
        }
        const data: MySchedule[] = await res.json();
        setMySchedules(data);
      } catch (e) {
        console.error('스케줄 조회 실패:', e);
      } finally {
        setLoadingSchedules(false);
      }
    })();
  }, []);

  // ===== 파생 데이터: 통계, 오늘 스케줄, 알림 =====
  const now = new Date();

  // 이번 달 스케줄 수
  const thisMonthScheduleCount = useMemo(() => {
    if (!mySchedules.length) return 0;
    const year = now.getFullYear();
    const month = now.getMonth();
    return mySchedules.filter((s) => {
      const start = new Date(s.startTime);
      return (
        start.getFullYear() === year &&
        start.getMonth() === month
      );
    }).length;
  }, [mySchedules, now]);

  // 커뮤니티 활동 수 (아직 DB 연동 전이라 0으로 표기)
  const communityActivityCount = 0;

  // 오늘 스케줄 목록
  const todaySchedules = useMemo(() => {
    return mySchedules.filter((s) => {
      const start = new Date(s.startTime);
      return isSameDay(start, now);
    });
  }, [mySchedules, now]);

  const getWorkplaceNameById = (id: number) =>
    workplaces.find((w) => w.id === id)?.name ?? '알 수 없는 근무지';

  // 스케줄 기반 알림 (DB 파생)
  const recentNotifications: Notification[] = useMemo(() => {
    if (!mySchedules.length) return [];

    const sorted = [...mySchedules].sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

    return sorted.slice(0, 5).map((s) => {
      const workplaceName = getWorkplaceNameById(s.workplaceId);
      const dateLabel = formatRelativeDateLabel(s.startTime);
      const timeLabel = formatTimeHHMM(s.startTime);

      return {
        id: s.id,
        type: 'schedule',
        message: `${workplaceName} ${dateLabel} ${timeLabel} 근무가 등록되었어요`,
        workplace: workplaceName,
        time: dateLabel,
      };
    });
  }, [mySchedules, workplaces]);

  // ===== 조기 렌더링 가드 =====
  if (loadingMe) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로딩 중...
      </div>
    );
  }

  if (!me) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로그인 정보가 유효하지 않습니다.
      </div>
    );
  }

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
                  안녕하세요, {me.name ?? '알바생'}님!
                </h1>
                <p className="text-xl text-gray-600">오늘도 화이팅하세요!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats (DB 기반) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
            <div className="text-3xl font-bold mb-2 text-blue-500">
              {loadingWorkplaces ? '...' : workplaces.length}
            </div>
            <div className="text-gray-600">참여 근무지</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
            <div className="text-3xl font-bold mb-2 text-green-500">
              {loadingSchedules ? '...' : thisMonthScheduleCount}
            </div>
            <div className="text-gray-600">이번달 근무</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100">
            <div className="text-3xl font-bold mb-2 text-purple-500">
              {communityActivityCount}
            </div>
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
              대시보드
            </button>
            <button
              onClick={() => setActiveTab('workplaces')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'workplaces'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              내 근무지
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'community'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              커뮤니티
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              유용한 도구
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
                  오늘의 스케줄
                </h2>

                {loadingSchedules ? (
                  <div className="text-sm text-gray-500">
                    스케줄 정보를 불러오는 중입니다…
                  </div>
                ) : todaySchedules.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="text-center text-gray-500">
                      <p>오늘은 근무 일정이 없어요!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todaySchedules.map((s) => {
                      const workplaceName = getWorkplaceNameById(s.workplaceId);
                      const statusLabel = getScheduleStatusLabel(
                        s.startTime,
                        s.endTime,
                      );
                      const start = formatTimeHHMM(s.startTime);
                      const end = formatTimeHHMM(s.endTime);

                      return (
                        <div
                          key={s.id}
                          className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-800">
                              {workplaceName}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                statusLabel === '진행중'
                                  ? 'bg-blue-500 text-white'
                                  : statusLabel === '예정'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-400 text-white'
                              }`}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          <div className="flex items-center flex-wrap gap-4 text-gray-600">
                            <span className="flex items-center">
                              <i className="ri-time-line mr-2"></i>
                              {start && end ? `${start} - ${end}` : '시간 정보 없음'}
                            </span>
                            <span className="flex items-center">
                              <i className="ri-user-line mr-2"></i>
                              {s.role ?? '직무 미지정'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <QuickActions />
            </div>

            {/* Notifications (스케줄 기반) */}
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">🔔</span>
                  최근 알림
                </h2>

                {loadingSchedules ? (
                  <div className="text-sm text-gray-500">
                    알림 정보를 불러오는 중입니다…
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    최근 알림이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="ri-calendar-line text-blue-500 text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 mb-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                {notification.workplace}
                              </p>
                              <p className="text-xs text-gray-400">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workplaces' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                내 근무지 관리
              </h2>
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
                  <div key={workplace.id} className="space-y-2">
                    <WorkplaceCard workplace={workplace} />
                    {workplace.status === 'pending' && (
                      <p className="text-sm font-semibold text-yellow-600">
                        승인 대기중
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                알바생 커뮤니티
              </h2>
            </div>

            {/* Community Categories (UI 구조만, 데이터 X) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link
                href="/employee-dashboard/reviews"
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">알바 후기</h3>
                <p className="text-gray-600 text-sm">실제 근무 경험 공유</p>
              </Link>
              <Link
                href="/employee-dashboard/tips"
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-yellow-100 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">알바 꿀팁</h3>
                <p className="text-gray-600 text-sm">유용한 노하우 공유</p>
              </Link>
              <Link
                href="/employee-dashboard/education"
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">권리 교육</h3>
                <p className="text-gray-600 text-sm">알바생 권리 정보</p>
              </Link>
            </div>

            {/* Recent Posts (더미 제거, 아직 연동 전) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                최근 게시글
              </h3>
              <div className="text-sm text-gray-500">
                아직 게시글이 없습니다. 커뮤니티 기능 연동 후 여기에 글이 표시됩니다.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              유용한 도구들
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Salary Calculator */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-calculator-line text-green-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    급여 계산기
                  </h3>
                  <p className="text-gray-600 mb-6">
                    시급과 근무시간으로 급여를 계산해보세요
                  </p>
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
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    권리 가이드
                  </h3>
                  <p className="text-gray-600 mb-6">
                    알바생이 알아야 할 권리와 법적 정보
                  </p>
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
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    스케줄 관리
                  </h3>
                  <p className="text-gray-600 mb-6">
                    내 근무 일정을 한눈에 확인하세요
                  </p>
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
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    근무지 평가
                  </h3>
                  <p className="text-gray-600 mb-6">
                    근무지에 대한 솔직한 평가를 남겨보세요
                  </p>
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
