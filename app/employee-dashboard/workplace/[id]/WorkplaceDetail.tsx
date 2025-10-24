
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WorkplaceDetailProps {
  workplaceId: string;
}

export default function WorkplaceDetail({ workplaceId }: WorkplaceDetailProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [newHandover, setNewHandover] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setCurrentTime(
      new Date()
        .toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/\. /g, '.')
        .replace(/\.$/, ''),
    );
  }, []);

  const workplace = {
    id: parseInt(workplaceId),
    name: workplaceId === '1' ? '스타벅스 강남점' : '맥도날드 홍대점',
    role: workplaceId === '1' ? '바리스타' : '크루',
    status: workplaceId === '1' ? 'active' : 'pending',
    nextShift: workplaceId === '1' ? '오늘 14:00 - 20:00' : '내일 09:00 - 17:00',
    manager: workplaceId === '1' ? '김사장님' : '이매니저님',
    rating: workplaceId === '1' ? 4.8 : 4.2,
    image:
      workplaceId === '1'
        ? 'https://readdy.ai/api/search-image?query=modern%20cozy%20coffee%20shop%20interior%20with%20warm%20lighting%2C%20barista%20counter%2C%20coffee%20machines%2C%20comfortable%20seating%20area%2C%20wooden%20furniture%2C%20plants%2C%20minimalist%20design%2C%20bright%20atmosphere&width=800&height=400&seq=workplace1detail&orientation=landscape'
        : 'https://readdy.ai/api/search-image?query=modern%20fast%20food%20restaurant%20interior%20with%20red%20and%20yellow%20colors%2C%20clean%20counter%20area%2C%20digital%20menu%20boards%2C%20bright%20lighting%2C%20organized%20kitchen%20space%2C%20contemporary%20design&width=800&height=400&seq=workplace2detail&orientation=landscape',
  };

  const teamMembers = [
    {
      id: 1,
      name: '김바리스타',
      phone: '010-1234-5678',
      position: '바리스타',
      joinDate: '2024.01.15',
      status: 'active',
      avatar:
        'https://readdy.ai/api/search-image?query=professional%20young%20korean%20barista%20woman%20smiling%2C%20clean%20white%20background%2C%20portrait%20style%2C%20friendly%20expression%2C%20coffee%20shop%20uniform&width=80&height=80&seq=member1&orientation=squarish',
    },
    {
      id: 2,
      name: '이매니저',
      phone: '010-2345-6789',
      position: '매니저',
      joinDate: '2023.08.20',
      status: 'inactive',
      avatar:
        'https://readdy.ai/api/search-image?query=professional%20korean%20manager%20man%20in%20coffee%20shop%20uniform%2C%20clean%20white%20background%2C%20portrait%20style%2C%20confident%20expression%2C%20leadership%20appearance&width=80&height=80&seq=member2&orientation=squarish',
    },
    {
      id: 3,
      name: '박알바',
      phone: '010-3456-7890',
      position: '바리스타',
      joinDate: '2024.03.10',
      status: 'active',
      avatar:
        'https://readdy.ai/api/search-image?query=young%20korean%20part-time%20worker%20in%20coffee%20shop%2C%20clean%20white%20background%2C%20portrait%20style%2C%20cheerful%20expression%2C%20casual%20uniform&width=80&height=80&seq=member3&orientation=squarish',
    },
    {
      id: 4,
      name: '최시니어',
      phone: '010-4567-8901',
      position: '시니어 바리스타',
      joinDate: '2023.11.05',
      status: 'inactive',
      avatar:
        'https://readdy.ai/api/search-image?query=experienced%20korean%20senior%20barista%2C%20clean%20white%20background%2C%20portrait%20style%2C%20professional%20expression%2C%20coffee%20expertise%20appearance&width=80&height=80&seq=member4&orientation=squarish',
    },
    {
      id: 5,
      name: '정신입',
      phone: '010-5678-9012',
      position: '바리스타',
      joinDate: '2024.11.01',
      status: 'inactive',
      avatar:
        'https://readdy.ai/api/search-image?query=new%20korean%20employee%20in%20coffee%20shop%2C%20clean%20white%20background%2C%20portrait%20style%2C%20eager%20expression%20%2C%20fresh%20uniform&width=80&height=80&seq=member5&orientation=squarish',
    },
  ];

  const [handoverNotes, setHandoverNotes] = useState([
    {
      id: 1,
      author: '김바리스타',
      time: '2024.12.16 13:50',
      shift: '14:00-20:00',
      content:
        '오늘 에스프레소 머신 청소 완료했습니다. 원두 재고 부족하니 다음 근무자분이 확인해주세요.',
      type: 'info',
    },
    {
      id: 2,
      author: '박알바',
      time: '2024.12.16 12:30',
      shift: '09:00-13:00',
      content:
        '점심시간 전에 테이블 5번 손님이 아이스 아메리카노 엎지셨어요. 청소는 완료했지만 바닥이 조금 미끄러울 수 있으니 주의해주세요.',
      type: 'warning',
    },
    {
      id: 3,
      author: '이매니저',
      time: '2024.12.16 08:45',
      shift: '오픈 준비',
      content:
        '새로운 시즌 메뉴 레시피가 카운터 옆에 있습니다. 손님 문의 시 참고해주세요. 디카페인 원두가 새로 들어왔어요.',
      type: 'info',
    },
    {
      id: 4,
      author: '최시니어',
      time: '2024.12.15 21:45',
      shift: '마감 정리',
      content:
        '마감 정리 완료. 내일 오픈 전에 냉장고 온도 체크 필요합니다. 우유 유통기한도 확인해주세요.',
      type: 'task',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-gray-400';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '근무중';
      case 'pending':
        return '대기중';
      case 'inactive':
        return '휴무';
      default:
        return '상태';
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const getMemberStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '근무중';
      case 'pending':
        return '승인대기';
      case 'inactive':
        return '휴무';
      default:
        return '상태';
    }
  };

  const getHandoverTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'task':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getHandoverTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'ri-information-line text-blue-500';
      case 'warning':
        return 'ri-alert-line text-orange-500';
      case 'task':
        return 'ri-task-line text-green-500';
      default:
        return 'ri-chat-3-line text-gray-500';
    }
  };

  const addHandoverNote = () => {
    if (!newHandover.trim()) return;

    const newNote = {
      id: handoverNotes.length + 1,
      author: '나',
      time: currentTime,
      shift: '현재 근무',
      content: newHandover.trim(),
      type: 'info',
    };

    setHandoverNotes([newNote, ...handoverNotes]);
    setNewHandover('');
  };

  const handleLeaveWorkplace = async () => {
    setIsLeaving(true);

    setTimeout(() => {
      alert('근무지 탈퇴가 완료되었습니다.\n그동안 수고하셨습니다! 👋');
      setIsLeaving(false);
      setShowLeaveModal(false);
      window.location.href = '/employee-dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/employee-dashboard"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{workplace.name}</h1>
                <p className="text-gray-600">{workplace.role}</p>
              </div>
            </div>
            <span
              className={`text-sm px-4 py-2 rounded-full font-medium text-white ${getStatusColor(
                workplace.status,
              )}`}
            >
              {getStatusText(workplace.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="relative mb-8">
          <img
            src={workplace.image}
            alt={workplace.name}
            className="w-full h-80 object-cover object-top rounded-3xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-3xl"></div>
          <div className="absolute bottom-6 left-6">
            <div className="bg-white bg-opacity-90 rounded-2xl p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-1">{workplace.name}</h2>
              <p className="text-gray-600">{workplace.role}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 inline-flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'info' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              📋 기본 정보
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'schedule' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              📅 스케줄
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'team' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              👥 팀원 목록
            </button>
            <button
              onClick={() => setActiveTab('handover')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'handover' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              📝 인수인계
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'contact' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              📞 연락처
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                <i className="ri-information-line mr-3 text-blue-500"></i>
                기본 정보
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">담당 매니저</span>
                  <span className="font-medium text-gray-800">{workplace.manager}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">평점</span>
                  <div className="flex items-center">
                    <i className="ri-star-fill text-yellow-400 mr-1"></i>
                    <span className="font-medium text-gray-800">{workplace.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">근무 상태</span>
                  <span className="font-medium text-gray-800">{getStatusText(workplace.status)}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">다음 근무</span>
                  <span className="font-medium text-gray-800">{workplace.nextShift}</span>
                </div>
              </div>
            </div>

            {/* Work Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                <i className="ri-briefcase-line mr-3 text-green-500"></i>
                근무 상세 정보
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="text-center bg-blue-50 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-blue-500 mb-2">₩9,620</div>
                  <div className="text-sm text-gray-600">시급</div>
                </div>
                <div className="text-center bg-green-50 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-green-500 mb-2">96</div>
                  <div className="text-sm text-gray-600">총 근무시간</div>
                </div>
                <div className="text-center bg-purple-50 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-purple-500 mb-2">12</div>
                  <div className="text-sm text-gray-600">근무일수</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Schedule */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                <i className="ri-calendar-line mr-3 text-blue-500"></i>
                이번 주 스케줄
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">월요일</span>
                    <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">오늘</span>
                  </div>
                  <p className="text-gray-600">14:00 - 20:00 (6시간)</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">수요일</span>
                    <span className="text-sm text-gray-500">예정</span>
                  </div>
                  <p className="text-gray-600">09:00 - 17:00 (8시간)</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">금요일</span>
                    <span className="text-sm text-gray-500">예정</span>
                  </div>
                  <p className="text-gray-600">14:00 - 22:00 (8시간)</p>
                </div>
              </div>
            </div>

            {/* Schedule Stats */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                <i className="ri-bar-chart-line mr-3 text-green-500"></i>
                근무 통계
              </h3>
              <div className="space-y-6">
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">22시간</div>
                    <div className="text-sm text-gray-600">이번 주 총 근무시간</div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-1">3일</div>
                    <div className="text-sm text-gray-600">이번 주 근무일수</div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500 mb-1">₩211,640</div>
                    <div className="text-sm text-gray-600">이번 주 예상 급여</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
                <div className="text-3xl font-bold mb-2 text-blue-500">{teamMembers.length}</div>
                <div className="text-gray-600">👥 총 팀원</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
                <div className="text-3xl font-bold mb-2 text-green-500">
                  {teamMembers.filter((m) => m.status === 'active').length}
                </div>
                <div className="text-gray-600">✅ 현재 근무중</div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">👥</span>
                팀원 목록
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-4 mb-4">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover object-top" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.position}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${member.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="ri-phone-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                        <span>입사: {member.joinDate}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <i className="ri-time-line mr-2 w-4 h-4 flex items-center justify-center text-gray-400"></i>
                        <span className={`${member.status === 'active' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                          {member.status === 'active' ? '근무중' : '휴무'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'handover' && (
          <div className="space-y-8">
            {/* 새 인수인계 작성 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="ri-edit-line mr-3 text-blue-500"></i>
                인수인계 작성
              </h3>
              <div className="space-y-4">
                <textarea
                  value={newHandover}
                  onChange={(e) => setNewHandover(e.target.value)}
                  placeholder="다음 근무자에게 전달할 내용을 작성해주세요..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{newHandover.length}/500자</p>
                  <button
                    onClick={addHandoverNote}
                    disabled={!newHandover.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <i className="ri-send-plane-line mr-2"></i>
                    등록하기
                  </button>
                </div>
              </div>
            </div>

            {/* 인수인계 목록 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="ri-file-list-line mr-3 text-green-500"></i>
                인수인계 내역
              </h3>

              {handoverNotes.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-file-list-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">아직 인수인계 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {handoverNotes.map((note) => (
                    <div key={note.id} className={`rounded-2xl p-6 border ${getHandoverTypeColor(note.type)}`}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <i className={`${getHandoverTypeIcon(note.type)} text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-bold text-gray-800">{note.author}</span>
                              <span className="text-sm text-gray-500">{note.shift}</span>
                            </div>
                            <span className="text-sm text-gray-500">{note.time}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{note.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 인수인계 가이드 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="ri-lightbulb-line mr-3 text-purple-500"></i>
                인수인계 작성 가이드
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-information-line text-blue-500 mr-2"></i>
                    <span className="font-medium text-gray-800">정보 공유</span>
                  </div>
                  <p className="text-sm text-gray-600">재고 상황, 기계 상태, 특이사항 등</p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-alert-line text-orange-500 mr-2"></i>
                    <span className="font-medium text-gray-800">주의사항</span>
                  </div>
                  <p className="text-sm text-gray-600">안전 관련, 고장 부분, 청소 필요 등</p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-task-line text-green-500 mr-2"></i>
                    <span className="font-medium text-gray-800">할 일</span>
                  </div>
                  <p className="text-sm text-gray-600">미완료 업무, 확인 필요 사항 등</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                <i className="ri-phone-line mr-3 text-purple-500"></i>
                연락처 정보
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">매장 전화</span>
                  <span className="font-medium text-gray-800">02-1234-5678</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">매니저 연락처</span>
                  <span className="font-medium text-gray-800">010-9876-5432</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">이메일</span>
                  <span className="font-medium text-gray-800">manager@store.com</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">주소</span>
                  <span className="font-medium text-gray-800">서울시 강남구 테헤란로 123</span>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                <i className="ri-map-pin-line mr-3 text-orange-500"></i>
                위치 정보
              </h3>
              <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4!2d127.0276!3d37.4979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDI5JzUyLjQiTiAxMjfCsDAxJzM5LjQiRQ!5e0!3m2!1sko!2skr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '1rem' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Link
                href="/employee-dashboard/schedule"
                className="bg-blue-500 text-white py-4 px-6 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
              >
                스케줄 확인
              </Link>
              <Link
                href="/employee-dashboard/schedule-request"
                className="bg-green-500 text-white py-4 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
              >
                스케줄 신청
              </Link>
              <Link
                href={`/employee-dashboard/workplace/${workplaceId}/review`}
                className="bg-purple-500 text-white py-4 px-6 rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
              >
                평가하기
              </Link>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="bg-red-500 text-white py-4 px-6 rounded-xl font-medium hover-bg-red-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탈퇴 확인 모달 */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">근무지 탈퇴</h2>
                  <p className="text-gray-600 text-sm mt-1">정말로 탈퇴하시겠습니까?</p>
                </div>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* 근무지 정보 */}
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <i className="ri-store-line text-red-500 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{workplace.name}</h3>
                    <p className="text-sm text-gray-600">{workplace.role}</p>
                  </div>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100 mb-6">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                  <i className="ri-alert-line text-yellow-500 mr-2"></i>
                  탈퇴 시 주의사항
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 탈퇴 후에는 해당 근무지 정보에 접근할 수 없습니다</li>
                  <li>• 진행 중인 스케줄이 있다면 매니저와 상의해주세요</li>
                  <li>• 탈퇴 후 재가입 시 새로운 승인이 필요합니다</li>
                </ul>
              </div>

              {/* 액션 버튼 */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  취소
                </button>
                <button
                  onClick={handleLeaveWorkplace}
                  disabled={isLeaving}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLeaving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      처리중...
                    </>
                  ) : (
                    <>
                      <i className="ri-logout-box-line mr-2"></i>
                      탈퇴하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
