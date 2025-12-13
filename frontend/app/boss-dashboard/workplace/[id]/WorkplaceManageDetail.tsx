'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Interfaces
interface Employee {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalHours?: number;
  monthlyHours?: number;
  avatar?: string;
  lastCheckIn?: string;
  lastCheckOut?: string;
  isWorking?: boolean;
  workDays?: number;
  appliedDate?: string;
  hourlyWage?: number;
  weeklyHours?: number;
  overtimeHours?: number;
  nightShiftHours?: number;
  holidayHours?: number;
}

interface ScheduleRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  requestType: 'vacation' | 'shift_change' | 'overtime';
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  requestedDates?: string[];
  preferredTimes?: string[];
  message?: string;
}

interface AttendanceRecord {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  overtime: number;
  status: 'normal' | 'late' | 'early' | 'absent';
}

// 근무지 가입 요청(WorkJoinRequestResponse)용 타입
interface JoinRequest {
  requestId: number;
  userId: number;
  userName: string;
  workplaceId: number;
  workplaceName: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  respondedAt?: string | null;
}

// 백엔드에서 받아온 근무지 정보를 화면용으로 정리한 타입
interface WorkplaceDetail {
  id: number | string;
  name: string;
  type: string;
  address: string;
  phone: string;
  manager: string;
  openTime: string;
  closeTime: string;
  status: 'active' | 'inactive' | 'pending';
}

interface WorkplaceManageDetailProps {
  workplaceId: string;
}

export default function WorkplaceManageDetail({ workplaceId }: WorkplaceManageDetailProps) {
  // ✅ props로 받은 id가 제대로 오는지 확인
  console.log('✅ WorkplaceManageDetail props.workplaceId:', workplaceId);

  // State variables
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [employeeFilter, setEmployeeFilter] = useState<'active' | 'pending'>('active');

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  // 🔁 여기서 Employee → JoinRequest 로 변경
  const [employeeToApprove, setEmployeeToApprove] = useState<JoinRequest | null>(null);
  const [approvalData, setApprovalData] = useState({
    hourlyWage: '',
    position: '',
    department: ''
  });

  // 클라이언트 렌더링 상태 관리
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 근무지 / 직원 DB 데이터
  const [workplace, setWorkplace] = useState<WorkplaceDetail | null>(null);
  const [isLoadingWorkplace, setIsLoadingWorkplace] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // 근무지 가입(WorkJoinRequest) 대기 요청 리스트
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [isLoadingJoinRequests, setIsLoadingJoinRequests] = useState(false);

  // original state variables used by existing modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // 급여 계산 관련 상태
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [showPayrollDetail, setShowPayrollDetail] = useState<Employee | null>(null);

  // 인수인계 관련 상태 추가
  const [newHandover, setNewHandover] = useState('');
  const [handoverNotes, setHandoverNotes] = useState([
    {
      id: 1,
      author: '김사장',
      time: '2025.10.30 15:30',
      shift: '매니저',
      content:
        '오늘 새로운 메뉴 교육 자료가 도착했습니다. 직원들에게 안내해주시고, 레시피 숙지 후 고객 응대 시작해주세요.',
      type: 'info',
      isManager: true
    },
    {
      id: 2,
      author: '김바리스타',
      time: '2025.10.30 13:50',
      shift: '14:00-20:00',
      content:
        '오늘 에스프레소 머신 청소 완료했습니다. 원두 재고 부족하니 다음 근무자분이 확인해주세요.',
      type: 'info',
      isManager: false
    },
    {
      id: 3,
      author: '김사장',
      time: '2025.10.30 13:00',
      shift: '매니저',
      content:
        '점심시간 이후 본사 점검이 있을 예정입니다. 매장 정리정돈과 위생 관리에 특히 신경 써주세요.',
      type: 'warning',
      isManager: true
    },
    {
      id: 4,
      author: '박알바',
      time: '2025.10.30 12:30',
      shift: '09:00-13:00',
      content:
        '점심시간 전에 테이블 5번 손님이 아이스 아메리카노 엎지셨어요. 청소는 완료했지만 바닥이 조금 미끄러울 수 있으니 주의해주세요.',
      type: 'warning',
      isManager: false
    },
    {
      id: 5,
      author: '김사장',
      time: '2025.10.30 09:00',
      shift: '매니저',
      content:
        '이번 주 매출 목표 달성을 위해 추천 메뉴 적극 안내 부탁드립니다. 고객 만족도 향상에도 신경 써 주세요.',
      type: 'task',
      isManager: true
    }
  ]);

  // 출퇴근 관리 관련 상태 추가
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceEmployee, setAttendanceEmployee] = useState<Employee | null>(null);
  const [attendanceAction, setAttendanceAction] = useState<'checkin' | 'checkout'>('checkin');

  // 출퇴근 기록 모달 관련 상태 추가
  const [showAttendanceRecordModal, setShowAttendanceRecordModal] = useState(false);
  const [attendanceRecordEmployee, setAttendanceRecordEmployee] = useState<Employee | null>(null);

  // 스케줄 생성 관련 상태 추가
  const [showScheduleGeneratorModal, setShowScheduleGeneratorModal] = useState(false);
  const [scheduleSelectedMonth, setScheduleSelectedMonth] = useState(11);
  const [scheduleSelectedYear, setScheduleSelectedYear] = useState(2024);
  const [generatedSchedule, setGeneratedSchedule] = useState<any>({});
  const [scheduleGenerationStep, setScheduleGenerationStep] =
    useState<'select' | 'generate' | 'review'>('select');
  
  // 스케줄 데이터 상태
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  // 클라이언트에서만 현재 날짜 설정
  useEffect(() => {
    if (isClient) {
      const now = new Date();
      setSelectedMonth(now.getMonth());
      setSelectedYear(now.getFullYear());
      setScheduleSelectedMonth(now.getMonth());
      setScheduleSelectedYear(now.getFullYear());
    }
  }, [isClient]);

  /* =========================
   *   DB 호출해서 데이터 가져오기
   * ========================= */

  // 근무지 상세 조회
  const fetchWorkplace = async () => {
    if (!workplaceId) {
      console.error('⚠️ fetchWorkplace: workplaceId 없음, 호출 중단');
      return;
    }

    console.log('fetchWorkplace workplaceId:', workplaceId);
    console.log('fetchWorkplace URL:', `/workplaces/${workplaceId}`);

    try {
      setIsLoadingWorkplace(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const res = await fetch(
        `http://localhost:8080/api/workplace/${encodeURIComponent(workplaceId)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!res.ok) {
        let body: any = null;
        try {
          body = await res.json();
        } catch (_) {}

        console.error('workplace 조회 실패 status:', res.status, body);
        setWorkplace(null);
        return;
      }

      const data = await res.json();
      // 백엔드 WorkplaceResponse -> 화면용으로 정규화
      const normalized: WorkplaceDetail = {
        id: data.workplaceId ?? data.id ?? workplaceId,
        name: data.workName ?? data.name ?? '이름 없는 매장',
        type: data.type ?? '매장',
        address: data.address ?? '',
        phone: data.phone ?? '',
        manager: data.ownerName ?? '사장님',
        openTime: data.openTime ?? '09:00',
        closeTime: data.closeTime ?? '18:00',
        status:
          data.status === 'inactive' || data.status === '휴업'
            ? 'inactive'
            : data.status === 'pending'
            ? 'pending'
            : 'active'
      };

      setWorkplace(normalized);
    } catch (e) {
      console.error('workplace 조회 중 오류:', e);
      setWorkplace(null);
    } finally {
      setIsLoadingWorkplace(false);
    }
  };

  // 직원 목록 조회
  const fetchEmployees = async () => {
    if (!workplaceId) {
      console.error('⚠️ fetchEmployees: workplaceId 없음, 호출 중단');
      return;
    }

    console.log('fetchEmployees workplaceId:', workplaceId);
    console.log('fetchEmployees URL:', `/workplaces/${workplaceId}/employees`);

    try {
      setIsLoadingEmployees(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const res = await fetch(
        `http://localhost:8080/api/workplace/${encodeURIComponent(
          workplaceId
        )}/employees`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!res.ok) {
        console.error('직원 목록 조회 실패 status:', res.status);
        setEmployees([]);
        return;
      }

      const raw = await res.json();
      const list: any[] = Array.isArray(raw) ? raw : raw.content ?? raw.data ?? [];

      const mapped: Employee[] = list.map((emp) => ({
        id: emp.id ?? emp.employeeId,
        name: emp.user?.name ?? '이름 없음', 
        position: emp.position ?? '직원',
        phone: emp.phone ?? '',
        email: emp.email ?? '',
        joinDate: emp.joinDate ?? emp.createdAt ?? '',
        status:
          emp.status === 'PENDING' || emp.status === 'pending'
            ? 'pending'
            : emp.status === 'INACTIVE' || emp.status === 'inactive'
            ? 'inactive'
            : 'active',
        workDays: emp.workDays ?? 0,
        appliedDate: emp.appliedDate ?? '',
        hourlyWage: emp.hourlyWage,
        weeklyHours: emp.weeklyHours ?? 0,
        overtimeHours: emp.overtimeHours ?? 0,
        nightShiftHours: emp.nightShiftHours ?? 0,
        holidayHours: emp.holidayHours ?? 0,
        avatar: emp.avatar,
        lastCheckIn: emp.lastCheckIn,
        lastCheckOut: emp.lastCheckOut,
        isWorking: emp.isWorking ?? false,
        totalHours: emp.totalHours,
        monthlyHours: emp.monthlyHours
      }));

      setEmployees(mapped);
    } catch (e) {
      console.error('직원 목록 조회 중 오류:', e);
      setEmployees([]);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // 근무지 가입 요청(WorkJoinRequest) 목록 조회
  const fetchJoinRequests = async () => {
    if (!workplaceId) {
      console.error('⚠️ fetchJoinRequests: workplaceId 없음, 호출 중단');
      return;
    }

    console.log('fetchJoinRequests workplaceId:', workplaceId);
    console.log('fetchJoinRequests URL:', `/workplaces/${workplaceId}/requests`);

    try {
      setIsLoadingJoinRequests(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const res = await fetch(
        `http://localhost:8080/api/workplace/${encodeURIComponent(
          workplaceId
        )}/requests`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!res.ok) {
        console.error('가입 요청 조회 실패 status:', res.status);
        setJoinRequests([]);
        return;
      }

      const raw = await res.json();
      const list: any[] = Array.isArray(raw) ? raw : raw.content ?? raw.data ?? [];

      const mapped: JoinRequest[] = list.map((req) => ({
        requestId: req.requestId ?? req.id,
        userId: req.userId,
        userName: req.userName,
        workplaceId: req.workplaceId,
        workplaceName: req.workplaceName,
        status: (req.status?.toLowerCase() ?? 'pending') as JoinRequest['status'],
        appliedAt: req.appliedAt,
        respondedAt: req.respondedAt
      }));

      setJoinRequests(mapped);
    } catch (e) {
      console.error('가입 요청 조회 중 오류:', e);
      setJoinRequests([]);
    } finally {
      setIsLoadingJoinRequests(false);
    }
  };

  // 스케줄 데이터 조회
  const fetchSchedules = async () => {
    if (!workplaceId) {
      console.error('⚠️ fetchSchedules: workplaceId 없음, 호출 중단');
      return;
    }

    try {
      setIsLoadingSchedules(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const res = await fetch(
        `http://localhost:8080/api/schedule/workplace/${encodeURIComponent(workplaceId)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!res.ok) {
        console.error('스케줄 조회 실패 status:', res.status);
        setSchedules([]);
        return;
      }

      const raw = await res.json();
      const list: any[] = Array.isArray(raw) ? raw : raw.content ?? raw.data ?? [];

      setSchedules(list);
    } catch (e) {
      console.error('스케줄 조회 중 오류:', e);
      setSchedules([]);
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  // 모달이 떠 있는 동안 / 또는 진입 시 DB에서 데이터 로드
  useEffect(() => {
    if (!isClient) return;
    if (!workplaceId) {
      console.error('⚠️ useEffect: workplaceId 없음, fetch 호출 안 함');
      return;
    }

    fetchWorkplace();
    fetchEmployees();
    fetchJoinRequests(); // 🔥 가입요청도 함께 로드
    fetchSchedules(); // 🔥 스케줄 데이터도 함께 로드
  }, [isClient, workplaceId]);

  // 출퇴근 기록 Mock 데이터 (이 부분은 아직 더미 유지)
  const getAttendanceRecords = (employeeId: number): AttendanceRecord[] => {
    return [
      {
        id: 1,
        date: '2024-12-16',
        checkIn: '09:00',
        checkOut: '18:00',
        workHours: 8,
        overtime: 0,
        status: 'normal'
      },
      {
        id: 2,
        date: '2024-12-15',
        checkIn: '09:15',
        checkOut: '18:30',
        workHours: 8.25,
        overtime: 0.25,
        status: 'late'
      },
      {
        id: 3,
        date: '2024-12-14',
        checkIn: '09:00',
        checkOut: '17:30',
        workHours: 7.5,
        overtime: 0,
        status: 'early'
      },
      {
        id: 4,
        date: '2024-12-13',
        checkIn: '09:00',
        checkOut: '19:00',
        workHours: 9,
        overtime: 1,
        status: 'normal'
      },
      {
        id: 5,
        date: '2024-12-12',
        checkIn: '-',
        checkOut: '-',
        workHours: 0,
        overtime: 0,
        status: 'absent'
      },
      {
        id: 6,
        date: '2024-12-11',
        checkIn: '08:45',
        checkOut: '18:00',
        workHours: 8.25,
        overtime: 0,
        status: 'normal'
      },
      {
        id: 7,
        date: '2024-12-10',
        checkIn: '09:00',
        checkOut: '20:00',
        workHours: 10,
        overtime: 2,
        status: 'normal'
      }
    ];
  };

  // 일정/요청은 아직 더미 (스케줄 생성용)
  const scheduleRequests: ScheduleRequest[] = [
    {
      id: 1,
      employeeId: 1,
      employeeName: '김민수',
      requestType: 'vacation',
      date: '2024-03-25',
      reason: '개인 사정으로 인한 휴가 신청',
      status: 'pending',
      requestDate: '2024-03-20',
      requestedDates: ['2024-12-20', '2024-12-21', '2024-12-22', '2024-12-23', '2024-12-24'],
      preferredTimes: ['09:00 - 12:00 (오전)', '15:00 - 18:00 (오후)'],
      message: '매니저 업무 가능하며, 바쁜 시간대 우선 배치 부탁드립니다.'
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: '이지은',
      requestType: 'shift_change',
      date: '2024-03-22',
      reason: '시험 일정으로 인한 시간 변경 요청',
      status: 'pending',
      requestDate: '2024-03-19',
      requestedDates: ['2024-12-16', '2024-12-17', '2024-12-18', '2024-12-19'],
      preferredTimes: ['12:00 - 15:00 (점심)', '15:00 - 18:00 (오후)'],
      message: '오전 시간은 수업이 있어서 어려워요.'
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: '박준호',
      requestType: 'overtime',
      date: '2024-03-21',
      reason: '매장 정리 및 재고 관리',
      status: 'approved',
      requestDate: '2024-03-18',
      requestedDates: ['2024-12-25', '2024-12-26', '2024-12-27', '2024-12-28'],
      preferredTimes: ['18:00 - 21:00 (저녁)', '21:00 - 24:00 (야간)'],
      message: '야간 근무 가능합니다.'
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: '최서연',
      requestType: 'shift_change',
      date: '2024-03-23',
      reason: '학교 일정으로 인한 스케줄 조정',
      status: 'pending',
      requestDate: '2024-03-21',
      requestedDates: ['2024-12-29', '2024-12-30', '2024-12-31'],
      preferredTimes: ['15:00 - 18:00 (오후)', '18:00 - 21:00 (저녁)'],
      message: '주말 근무 선호합니다.'
    }
  ];

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '운영중';
      case 'inactive':
        return '휴업';
      case 'pending':
        return '승인대기';
      default:
        return '알 수 없음';
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-600';
      case 'late':
        return 'bg-orange-100 text-orange-600';
      case 'early':
        return 'bg-blue-100 text-blue-600';
      case 'absent':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getAttendanceStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '정상';
      case 'late':
        return '지각';
      case 'early':
        return '조퇴';
      case 'absent':
        return '결근';
      default:
        return '알 수 없음';
    }
  };

  const positionOptions = [
    '매니저',
    '팀장',
    '주임',
    '사원',
    '아르바이트',
    '인턴',
    '계약직',
    '정규직'
  ];

  const departmentOptions = [
    '홀 서빙',
    '주방',
    '카운터',
    '청소',
    '재고관리',
    '매니지먼트',
    '마케팅',
    '기타'
  ];

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      console.log(`직원 ${employeeToDelete.name} 삭제됨`);
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const handleScheduleAction = (requestId: number, action: 'approve' | 'reject') => {
    console.log(`스케줄 요청 ${requestId} ${action === 'approve' ? '승인' : '거절'}됨`);
  };

  const getRequestTypeText = (type: string) => {
    switch (type) {
      case 'vacation':
        return '휴가';
      case 'shift_change':
        return '시간변경';
      case 'overtime':
        return '연장근무';
      default:
        return type;
    }
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-100 text-blue-600';
      case 'shift_change':
        return 'bg-orange-100 text-orange-600';
      case 'overtime':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
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

    const currentTime = isClient
      ? new Date()
          .toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
          .replace(/\. /g, '.')
          .replace(/\.$/, '')
      : '2024.12.16 15:30';

    const newNote = {
      id: handoverNotes.length + 1,
      author: '김사장',
      time: currentTime,
      shift: '매니저',
      content: newHandover.trim(),
      type: 'info',
      isManager: true
    };

    setHandoverNotes([newNote, ...handoverNotes]);
    setNewHandover('');
  };

  // 급여 계산 함수들
  const calculateBasePay = (employee: Employee) => {
    const regularHours = Math.min(employee.weeklyHours || 0, 40);
    return regularHours * (employee.hourlyWage || 0);
  };

  const calculateOvertimePay = (employee: Employee) => {
    const overtimeRate = (employee.hourlyWage || 0) * 1.5;
    return (employee.overtimeHours || 0) * overtimeRate;
  };

  const calculateNightShiftPay = (employee: Employee) => {
    const nightRate = (employee.hourlyWage || 0) * 0.5;
    return (employee.nightShiftHours || 0) * nightRate;
  };

  const calculateHolidayPay = (employee: Employee) => {
    const holidayRate = (employee.hourlyWage || 0) * 1.5;
    return (employee.holidayHours || 0) * holidayRate;
  };

  const calculateTotalPay = (employee: Employee) => {
    return (
      calculateBasePay(employee) +
      calculateOvertimePay(employee) +
      calculateNightShiftPay(employee) +
      calculateHolidayPay(employee)
    );
  };

  const calculateDeductions = (totalPay: number) => {
    const nationalPension = Math.floor(totalPay * 0.045);
    const healthInsurance = Math.floor(totalPay * 0.0335);
    const employmentInsurance = Math.floor(totalPay * 0.008);
    const incomeTax = totalPay > 1000000 ? Math.floor(totalPay * 0.033) : 0;

    return {
      nationalPension,
      healthInsurance,
      employmentInsurance,
      incomeTax,
      total: nationalPension + healthInsurance + employmentInsurance + incomeTax
    };
  };

  // 출퇴근 처리 함수들 추가
  const handleAttendanceClick = (employee: Employee, action: 'checkin' | 'checkout') => {
    setAttendanceEmployee(employee);
    setAttendanceAction(action);
    setShowAttendanceModal(true);
  };

  // 출퇴근 기록 보기 함수 추가
  const handleAttendanceRecordClick = (employee: Employee) => {
    setAttendanceRecordEmployee(employee);
    setShowAttendanceRecordModal(true);
  };

  const confirmAttendance = () => {
    if (!attendanceEmployee) return;

    const currentTime = isClient
      ? new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      : '09:00';

    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        if (emp.id === attendanceEmployee.id) {
          if (attendanceAction === 'checkin') {
            return {
              ...emp,
              isWorking: true,
              lastCheckIn: currentTime,
              lastCheckOut: '-'
            };
          } else {
            return {
              ...emp,
              isWorking: false,
              lastCheckOut: currentTime
            };
          }
        }
        return emp;
      })
    );

    setShowAttendanceModal(false);
    setAttendanceEmployee(null);
  };

  // 스케줄 생성 함수들 (API 호출)
  const generateMonthlySchedule = async () => {
    if (!workplaceId) {
      alert('근무지 정보가 없습니다.');
      return;
    }

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const year = scheduleSelectedYear;
      const month = scheduleSelectedMonth;
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

      const requestBody = {
        workplaceId: parseInt(workplaceId),
        startDate: startDate,
        endDate: endDate,
        openTime: '09:00',
        closeTime: '22:00',
        slotHours: 4,
        minStaffPerSlot: 1,
        maxStaffPerSlot: 3,
        overwriteExisting: true,
      };

      const res = await fetch('http://localhost:8080/api/schedule/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('스케줄 생성 실패:', error);
        alert('스케줄 생성에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
        return;
      }

      const result = await res.json();
      const generatedSchedules = result.schedules || [];

      // 생성된 스케줄을 날짜별로 그룹화
      const scheduleByDate: any = {};
      generatedSchedules.forEach((schedule: any) => {
        if (!schedule.startTime) return;
        const scheduleDate = new Date(schedule.startTime);
        const dateStr = scheduleDate.toISOString().split('T')[0];

        if (!scheduleByDate[dateStr]) {
          scheduleByDate[dateStr] = {
            date: dateStr,
            dayOfWeek: scheduleDate.getDay(),
            shifts: [],
          };
        }

        const startTime = new Date(schedule.startTime).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const endTime = new Date(schedule.endTime).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        const hour = new Date(schedule.startTime).getHours();
        let type = 'afternoon';
        if (hour < 12) type = 'morning';
        else if (hour >= 21) type = 'night';

        scheduleByDate[dateStr].shifts.push({
          time: `${startTime}-${endTime}`,
          employee: {
            id: schedule.user?.userId,
            name: schedule.user?.name || '알 수 없음',
            position: '직원',
          },
          type: type,
          scheduleId: schedule.scheduleId,
        });
      });

      setGeneratedSchedule(scheduleByDate);
      setScheduleGenerationStep('review');
      
      // 스케줄 생성 후 목록 새로고침
      await fetchSchedules();
    } catch (e) {
      console.error('스케줄 생성 중 오류:', e);
      alert('스케줄 생성 중 오류가 발생했습니다.');
    }
  };

  const confirmSchedule = async () => {
    try {
      // 스케줄이 이미 생성되어 DB에 저장되었으므로, 목록만 새로고침
      await fetchSchedules();
      alert('스케줄이 성공적으로 생성되었습니다! 🎉');
      setShowScheduleGeneratorModal(false);
      setScheduleGenerationStep('select');
    } catch (e) {
      console.error('스케줄 확정 중 오류:', e);
      alert('스케줄 확정 중 오류가 발생했습니다.');
    }
  };

  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const pendingEmployees = employees.filter((emp) => emp.status === 'pending');
  const activeEmployees = employees.filter((emp) => emp.status === 'active');
  // const displayedEmployees = employeeFilter === 'pending' ? pendingEmployees : activeEmployees;
  // 🔼 이제 displayedEmployees 대신 employeeFilter에 따라 employees vs joinRequests를 분리 렌더링할 것
  const pendingJoinRequests = joinRequests.filter((r) => r.status === 'pending');

  // 직원 승인/거절 로직 (근무지 가입 요청 기준)
  const handleApproveJoinRequest = (request: JoinRequest) => {
    setEmployeeToApprove(request);
    setApprovalData({
      hourlyWage: '10000',
      position: '아르바이트',
      department: '홀 서빙'
    });
    setShowApprovalModal(true);
  };

  const handleRejectJoinRequest = async (requestId: number) => {
    if (!workplaceId) return;

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const params = new URLSearchParams({
        approved: 'false',
      });

      const res = await fetch(
        `http://localhost:8080/api/workplace/requests/${requestId}/respond?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
        }
      );

      if (!res.ok) {
        console.error('직원 거절 실패 status:', res.status);
        const msg = await res.text();
        console.error(msg);
        alert('가입 요청 거절에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      setJoinRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      alert('가입 요청이 거절되었습니다.');
    } catch (e) {
      console.error('직원 거절 중 오류:', e);
      alert('가입 요청 거절 중 오류가 발생했습니다.');
    }
  };

  const handleApprovalDataChange = (field: string, value: string) => {
    setApprovalData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // 가입 승인
  const confirmApproval = async () => {
    if (!employeeToApprove) return;

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      // 쿼리스트링 구성
      const params = new URLSearchParams({
        approved: 'true',
        position: approvalData.position,
        hourlyWage: approvalData.hourlyWage, // 컨트롤러에서 Integer로 자동 변환됨
      });

      const res = await fetch(
        `http://localhost:8080/api/workplace/requests/${employeeToApprove.requestId}/respond?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
            // Content-Type 안 줘도 됨 (body 없으니까)
          },
        }
      );

      if (!res.ok) {
        console.error('직원 승인 실패 status:', res.status);
        const msg = await res.text();
        console.error(msg);
        alert('직원 승인에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      await fetchEmployees();
      await fetchJoinRequests();

      alert(`${employeeToApprove.userName}님이 승인되었습니다! 🎉`);
    } catch (e) {
      console.error('직원 승인 중 오류:', e);
      alert('직원 승인 중 오류가 발생했습니다.');
    } finally {
      setShowApprovalModal(false);
      setEmployeeToApprove(null);
      setApprovalData({
        hourlyWage: '',
        position: '',
        department: ''
      });
    }
  };


  // 클라이언트에서만 렌더링되도록 확인
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-arrow-left-line text-gray-600"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">로딩 중...</h1>
                  <p className="text-gray-600">매장 관리</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-loader-4-line text-2xl text-gray-400 animate-spin"></i>
            </div>
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const workplaceName =
    workplace?.name ?? (isLoadingWorkplace ? '매장 정보 불러오는 중...' : '매장 정보 없음');
  const workplaceStatus = workplace?.status ?? 'pending';

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/boss-dashboard"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{workplaceName}</h1>
                <p className="text-gray-600">매장 관리</p>
              </div>
            </div>
            <span
              className={`text-sm px-4 py-2 rounded-full font-medium text-white ${getStatusColor(
                workplaceStatus
              )}`}
            >
              {getStatusText(workplaceStatus)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('employees')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'employees' 
                ? 'text-teal-600 border-b-2 border-teal-600' 
                : 'text-gray-500'
            }`}
          >
            직원 관리
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'attendance'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500'
            }`}
          >
            출퇴근 관리
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'payroll'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500'
            }`}
          >
            급여 계산
          </button>
          <button
            onClick={() => setActiveTab('schedule-calendar')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'schedule-calendar'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500'
            }`}
          >
            스케줄 관리
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500'
            }`}
          >
            스케줄 요청
          </button>
          <button
            onClick={() => setActiveTab('handover')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'handover'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500'
            }`}
          >
            인수인계
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* 직원 관리 탭 */}
          {activeTab === 'employees' && (
            <div>

              {/* 상단 필터 버튼 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">직원 목록</h2>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEmployeeFilter('active')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      employeeFilter === 'active'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    활동 중 ({activeEmployees.length})
                  </button>

                  <button
                    onClick={() => setEmployeeFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      employeeFilter === 'pending'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    승인 대기 ({pendingJoinRequests.length})
                  </button>
                </div>
              </div>

              {/* 직원 리스트 / 가입 요청 리스트 */}
              <div className="space-y-4">
                {/* ✅ 활동 중 직원 목록 */}
                {employeeFilter === 'active' &&
                  activeEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">

                        {/* 좌측 직원 정보 */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-xl text-teal-600"></i>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{employee.name}</h3>
                              <span className="text-sm text-gray-500">{employee.position}</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <i className="ri-phone-line"></i>
                                {employee.phone}
                              </span>

                              <span className="flex items-center gap-1">
                                <i className="ri-calendar-line"></i>
                                입사일: {employee.joinDate}
                              </span>

                              <span className="flex items-center gap-1">
                                <i className="ri-time-line"></i>
                                근무일: {employee.workDays}일
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 우측 버튼들 */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedEmployee(employee)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <i className="ri-eye-line text-lg text-gray-600"></i>
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(employee)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <i className="ri-delete-bin-line text-lg text-red-600"></i>
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}

                {/* ✅ 승인 대기: 근무지 가입 요청 목록 */}
                {employeeFilter === 'pending' &&
                  pendingJoinRequests.map((request) => (
                    <div
                      key={request.requestId}
                      className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">

                        {/* 좌측 신청자 정보 */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-add-line text-xl text-orange-600"></i>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{request.userName}</h3>
                              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                                가입 요청
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <i className="ri-store-2-line"></i>
                                {request.workplaceName}
                              </span>

                              <span className="flex items-center gap-1">
                                <i className="ri-calendar-line"></i>
                                신청일: {request.appliedAt}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 우측 승인/거절 버튼 */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveJoinRequest(request)}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                          >
                            승인
                          </button>

                          <button
                            onClick={() => handleRejectJoinRequest(request.requestId)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                          >
                            거절
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}

                {/* 직원 / 요청이 없을 때 안내 */}
                {employeeFilter === 'active' && activeEmployees.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-user-line text-2xl text-gray-400"></i>
                    </div>

                    <p className="text-gray-500">등록된 직원이 없습니다</p>
                  </div>
                )}

                {employeeFilter === 'pending' && joinRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-user-add-line text-2xl text-gray-400"></i>
                    </div>

                    <p className="text-gray-500">승인 대기 중인 가입 요청이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 출퇴근 관리 탭 */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">출퇴근 관리</h2>

            <div className="space-y-6">
              {activeEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    {/* 직원 기본 정보 */}
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-bold text-gray-800">{employee.name}</h3>
                        <p className="text-gray-600 text-sm">{employee.position}</p>
                      </div>
                    </div>

                    {/* 출퇴근 정보 및 버튼 */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">출근시간</p>
                        <p className="font-medium text-green-600">
                          {employee.lastCheckIn || '-'}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">퇴근시간</p>
                        <p className="font-medium text-red-600">
                          {employee.lastCheckOut || '-'}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">상태</p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            employee.isWorking
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {employee.isWorking ? '근무중' : '퇴근'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        {employee.isWorking ? (
                          <button
                            onClick={() => handleAttendanceClick(employee, 'checkout')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            퇴근 처리
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAttendanceClick(employee, 'checkin')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            출근 처리
                          </button>
                        )}

                        <button
                          onClick={() => handleAttendanceRecordClick(employee)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          기록 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 급여 계산 탭 */}
        {activeTab === 'payroll' && (
          <div className="space-y-8">

            {/* 급여 계산 헤더 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <i className="ri-money-dollar-circle-line mr-3 text-purple-500"></i>
                  급여 계산
                </h2>

                <div className="flex items-center space-x-4">

                  {/* 연도 선택 */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">연도:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                    >
                      <option value={2024}>2024년</option>
                      <option value={2023}>2023년</option>
                    </select>
                  </div>

                  {/* 월 선택 */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">월:</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                    >
                      {monthNames.map((month, index) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              {/* 급여 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
                  <div className="text-2xl font-bold text-blue-500 mb-2">
                    ₩{activeEmployees
                      .reduce((sum, emp) => sum + calculateTotalPay(emp), 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">💰 총 급여</div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
                  <div className="text-2xl font-bold text-green-500 mb-2">
                    {activeEmployees.reduce(
                      (sum, emp) => sum + (emp.weeklyHours || 0),
                      0
                    )}
                    시간
                  </div>
                  <div className="text-sm text-gray-600">⏰ 총 근무시간</div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6 text-center border border-orange-100">
                  <div className="text-2xl font-bold text-orange-500 mb-2">
                    {activeEmployees.reduce(
                      (sum, emp) => sum + (emp.overtimeHours || 0),
                      0
                    )}
                    시간
                  </div>
                  <div className="text-sm text-gray-600">🕐 연장근무</div>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100">
                  <div className="text-2xl font-bold text-purple-500 mb-2">
                    ₩
                    {activeEmployees
                      .reduce((sum, emp) => {
                        const deductions = calculateDeductions(calculateTotalPay(emp));
                        return sum + deductions.total;
                      }, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">📋 총 공제액</div>
                </div>

              </div>
            </div>

            {/* 직원별 급여 목록 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">직원별 급여 내역</h3>

              <div className="space-y-4">
                {activeEmployees.map((employee) => {
                  const totalPay = calculateTotalPay(employee);
                  const deductions = calculateDeductions(totalPay);
                  const netPay = totalPay - deductions.total;

                  return (
                    <div
                      key={employee.id}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">

                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-purple-500 text-xl"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{employee.name}</h4>
                            <p className="text-gray-600 text-sm">
                              {employee.position} • 시급 ₩
                              {employee.hourlyWage?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">총 근무시간</p>
                            <p className="font-bold text-blue-600">
                              {employee.weeklyHours}시간
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">총 급여</p>
                            <p className="font-bold text-green-600">
                              ₩{totalPay.toLocaleString()}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">공제액</p>
                            <p className="font-bold text-red-600">
                              ₩{deductions.total.toLocaleString()}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">실수령액</p>
                            <p className="font-bold text-purple-600 text-lg">
                              ₩{netPay.toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={() => setShowPayrollDetail(employee)}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            상세보기
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 급여 계산 기준 가이드 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="ri-information-line mr-3 text-purple-500"></i>
                급여 계산 기준
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-time-line text-blue-500 mr-2"></i>
                    <span className="font-medium text-gray-800">기본급</span>
                  </div>
                  <p className="text-sm text-gray-600">주 40시간 이하 정규 근무시간</p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-add-circle-line text-green-500 mr-2"></i>
                    <span className="font-medium text-gray-800">연장수당</span>
                  </div>
                  <p className="text-sm text-gray-600">시급의 150% (40시간 초과)</p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-moon-line text-purple-500 mr-2"></i>
                    <span className="font-medium text-gray-800">야간수당</span>
                  </div>
                  <p className="text-sm text-gray-600">시급의 50% (22시~06시)</p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-calendar-event-line text-red-500 mr-2"></i>
                    <span className="font-medium text-gray-800">휴일수당</span>
                  </div>
                  <p className="text-sm text-gray-600">시급의 150% (법정공휴일)</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 스케줄 관리 캘린더 탭 */}
        {activeTab === 'schedule-calendar' && (
          <div className="space-y-8">
            {/* 스케줄 관리 헤더 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <i className="ri-calendar-schedule-line mr-3 text-purple-500"></i>
                  스케줄 관리 캘린더
                </h2>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">연도:</label>
                    <select
                      value={scheduleSelectedYear}
                      onChange={e => setScheduleSelectedYear(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                    >
                      <option value={2024}>2024년</option>
                      <option value={2025}>2025년</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">월:</label>
                    <select
                      value={scheduleSelectedMonth}
                      onChange={e => setScheduleSelectedMonth(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                    >
                      {monthNames.map((month, index) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setShowScheduleGeneratorModal(true)}
                    className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap flex items-center"
                  >
                    <i className="ri-add-line mr-2"></i>
                    스케줄 생성
                  </button>
                </div>
              </div>

              {/* 월간 스케줄 캘린더 */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 bg-purple-50">
                  {dayNames.map((day, index) => (
                    <div
                      key={day}
                      className={`p-4 text-center font-medium border-r border-gray-200 last:border-r-0 ${
                        index === 0
                          ? 'text-red-500'
                          : index === 6
                          ? 'text-blue-500'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 캘린더 그리드 */}
                <div className="grid grid-cols-7">
                  {(() => {
                    const year = scheduleSelectedYear;
                    const month = scheduleSelectedMonth;
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    const firstDayOfWeek = firstDay.getDay();
                    const daysInMonth = lastDay.getDate();
                    const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];

                    // 이전 달의 마지막 날들
                    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                      const date = new Date(firstDay);
                      date.setDate(date.getDate() - i - 1);
                      calendarDays.push({ date, isCurrentMonth: false });
                    }

                    // 현재 달의 날들
                    for (let day = 1; day <= daysInMonth; day++) {
                      calendarDays.push({
                        date: new Date(year, month, day),
                        isCurrentMonth: true,
                      });
                    }

                    // 다음 달의 첫 번째 날들 (42개까지 채우기)
                    const remainingDays = 42 - calendarDays.length;
                    for (let day = 1; day <= remainingDays; day++) {
                      const date = new Date(year, month + 1, day);
                      calendarDays.push({ date, isCurrentMonth: false });
                    }

                    return calendarDays.map((dayInfo, index) => {
                      const { date, isCurrentMonth } = dayInfo;
                      const dateStr = date.toISOString().split('T')[0];
                      const isToday = date.toDateString() === new Date().toDateString();

                      // 해당 날짜의 스케줄 데이터 (API에서 가져온 실제 데이터)
                      const daySchedule = (() => {
                        if (!isCurrentMonth) return [];

                        // 해당 날짜의 스케줄 필터링
                        const daySchedules = schedules.filter((schedule) => {
                          if (!schedule.startTime) return false;
                          const scheduleDate = new Date(schedule.startTime);
                          return (
                            scheduleDate.getFullYear() === date.getFullYear() &&
                            scheduleDate.getMonth() === date.getMonth() &&
                            scheduleDate.getDate() === date.getDate()
                          );
                        });

                        // 스케줄을 시간대별로 그룹화
                        return daySchedules.map((schedule) => {
                          const startTime = schedule.startTime
                            ? new Date(schedule.startTime).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })
                            : '09:00';
                          const endTime = schedule.endTime
                            ? new Date(schedule.endTime).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })
                            : '18:00';

                          // 시간대 타입 판단
                          let type = 'afternoon';
                          const hour = new Date(schedule.startTime).getHours();
                          if (hour < 12) type = 'morning';
                          else if (hour >= 21) type = 'night';

                          return {
                            time: `${startTime}-${endTime}`,
                            employee: schedule.user?.name ?? '알 수 없음',
                            position: schedule.user?.position ?? '직원',
                            type: type,
                            scheduleId: schedule.scheduleId,
                          };
                        });
                      })();

                      return (
                        <div
                          key={index}
                          className={`border-r border-b border-gray-200 p-2 min-h-[120px] ${
                            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                          } ${isToday ? 'bg-blue-50' : ''}`}
                        >
                          <div
                            className={`font-medium mb-2 ${
                              isToday
                                ? 'text-blue-600'
                                : isCurrentMonth
                                ? index % 7 === 0
                                  ? 'text-red-500'
                                  : index % 7 === 6
                                  ? 'text-blue-500'
                                  : 'text-gray-800'
                                : 'text-gray-400'
                            }`}
                          >
                            {date.getDate()}
                          </div>

                          {isCurrentMonth && (
                            <div className="space-y-1">
                              {daySchedule.map((shift, shiftIndex) => (
                                <div
                                  key={shiftIndex}
                                  className={`text-xs rounded p-1 border ${
                                    shift.type === 'morning'
                                      ? 'bg-green-100 text-green-700 border-green-200'
                                      : shift.type === 'afternoon'
                                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                                      : 'bg-purple-100 text-purple-700 border-purple-200'
                                  }`}
                                >
                                  <div className="font-medium">{shift.time}</div>
                                  <div className="truncate">{shift.employee}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* 범례 */}
              <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">오전 (09:00-15:00)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">오후 (15:00-21:00)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">야간 (21:00-24:00)</span>
                </div>
              </div>
            </div>

            {/* 스케줄 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {(() => {
                    const monthSchedules = schedules.filter((s) => {
                      if (!s.startTime) return false;
                      const scheduleDate = new Date(s.startTime);
                      return (
                        scheduleDate.getFullYear() === scheduleSelectedYear &&
                        scheduleDate.getMonth() === scheduleSelectedMonth
                      );
                    });
                    return monthSchedules.length;
                  })()}
                </div>
                <div className="text-gray-600">📅 이번달 총 시프트</div>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
                <div className="text-2xl font-bold text-blue-500 mb-2">
                  {(() => {
                    const monthSchedules = schedules.filter((s) => {
                      if (!s.startTime) return false;
                      const scheduleDate = new Date(s.startTime);
                      return (
                        scheduleDate.getFullYear() === scheduleSelectedYear &&
                        scheduleDate.getMonth() === scheduleSelectedMonth
                      );
                    });
                    const totalHours = monthSchedules.reduce((total, s) => {
                      if (s.startTime && s.endTime) {
                        const start = new Date(s.startTime);
                        const end = new Date(s.endTime);
                        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        return total + hours;
                      }
                      return total;
                    }, 0);
                    return Math.round(totalHours);
                  })()}
                </div>
                <div className="text-gray-600">⏰ 총 근무시간</div>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {scheduleRequests.filter((req) => req.status === 'pending').length}
                </div>
                <div className="text-gray-600">👥 배정 대기</div>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100">
                <div className="text-2xl font-bold text-purple-500 mb-2">
                  {(() => {
                    const monthSchedules = schedules.filter((s) => {
                      if (!s.startTime) return false;
                      const scheduleDate = new Date(s.startTime);
                      return (
                        scheduleDate.getFullYear() === scheduleSelectedYear &&
                        scheduleDate.getMonth() === scheduleSelectedMonth
                      );
                    });
                    const totalPossible = activeEmployees.length * 20; // 예상 가능한 시프트 수
                    return totalPossible > 0
                      ? Math.round((monthSchedules.length / totalPossible) * 100)
                      : 0;
                  })()}
                  %
                </div>
                <div className="text-gray-600">📊 배정 완료율</div>
              </div>
            </div>

            {/* 직원별 스케줄 요약 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="ri-team-line mr-3 text-blue-500"></i>
                직원별 스케줄 요약
              </h3>

              <div className="space-y-4">
                {activeEmployees.map(employee => {
                  // 해당 직원의 월간 스케줄 통계 (실제 API 데이터 기반)
                  const employeeSchedules = schedules.filter((schedule) => {
                    if (!schedule.user?.userId) return false;
                    const scheduleDate = schedule.startTime ? new Date(schedule.startTime) : null;
                    return (
                      schedule.user.userId === employee.id &&
                      scheduleDate &&
                      scheduleDate.getFullYear() === scheduleSelectedYear &&
                      scheduleDate.getMonth() === scheduleSelectedMonth
                    );
                  });

                  const monthlySchedule = {
                    totalShifts: employeeSchedules.length,
                    morningShifts: employeeSchedules.filter((s) => {
                      const hour = s.startTime ? new Date(s.startTime).getHours() : 12;
                      return hour < 12;
                    }).length,
                    afternoonShifts: employeeSchedules.filter((s) => {
                      const hour = s.startTime ? new Date(s.startTime).getHours() : 12;
                      return hour >= 12 && hour < 21;
                    }).length,
                    nightShifts: employeeSchedules.filter((s) => {
                      const hour = s.startTime ? new Date(s.startTime).getHours() : 12;
                      return hour >= 21;
                    }).length,
                    totalHours: employeeSchedules.reduce((total, s) => {
                      if (s.startTime && s.endTime) {
                        const start = new Date(s.startTime);
                        const end = new Date(s.endTime);
                        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        return total + hours;
                      }
                      return total;
                    }, 0),
                  };

                  return (
                    <div
                      key={employee.id}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full object-cover object-top"
                          />
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {employee.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {employee.position}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">총 시프트</p>
                            <p className="font-bold text-purple-600">
                              {monthlySchedule.totalShifts}회
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">오전</p>
                            <p className="font-bold text-green-600">
                              {monthlySchedule.morningShifts}회
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">오후</p>
                            <p className="font-bold text-blue-600">
                              {monthlySchedule.afternoonShifts}회
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">야간</p>
                            <p className="font-bold text-purple-600">
                              {monthlySchedule.nightShifts}회
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500">총 시간</p>
                            <p className="font-bold text-gray-800">
                              {monthlySchedule.totalHours}h
                            </p>
                          </div>

                          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap">
                            수정
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 스케줄 관리 가이드 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="ri-lightbulb-line mr-3 text-purple-500"></i>
                스케줄 관리 팁
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-calendar-check-line text-green-500 mr-2"></i>
                    <span className="font-medium text-gray-800">균등 배분</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    직원들의 근무시간을 균등하게 배분하여 공정성을 유지하세요
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-time-line text-blue-500 mr-2"></i>
                    <span className="font-medium text-gray-800">피크타임 관리</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    바쁜 시간대에는 경험 많은 직원을 배치하세요
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-user-heart-line text-purple-500 mr-2"></i>
                    <span className="font-medium text-gray-800">선호도 반영</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    직원들의 시간대 선호도를 고려하여 만족도를 높이세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* 스케줄 요청 탭 */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            {/* 스케줄 생성 헤더 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">스케줄 요청 관리</h2>
                <button
                  onClick={() => setShowScheduleGeneratorModal(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap flex items-center"
                >
                  <i className="ri-calendar-schedule-line mr-2"></i>
                  월간 스케줄 생성
                </button>
              </div>

              <div className="space-y-4">
                {scheduleRequests.map(request => (
                  <div
                    key={request.id}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="ri-calendar-line text-blue-500 text-xl"></i>
                        </div>

                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-gray-800">
                              {request.employeeName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRequestTypeColor(
                                request.requestType,
              )}`}
                            >
                              {getRequestTypeText(request.requestType)}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-1">
                            요청 날짜: {request.requestedDates?.length}일 (
                            {request.requestedDates
                              ?.slice(0, 2)
                              .map(date => new Date(date).getDate())
                              .join(', ')}
                            일
                            {request.requestedDates &&
                            request.requestedDates.length > 2
                              ? ` 외 ${request.requestedDates.length - 2}일`
                              : ''}
                            )
                          </p>

                          <p className="text-gray-500 text-sm">{request.reason}</p>

                          {request.message && (
                            <p className="text-blue-600 text-sm mt-1">
                              💬 {request.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400">
                          {request.requestDate}
                        </span>

                        {request.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleScheduleAction(request.id, 'approve')
                              }
                              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap"
                            >
                              승인
                            </button>

                            <button
                              onClick={() =>
                                handleScheduleAction(request.id, 'reject')
                              }
                              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors whitespace-nowrap"
                            >
                              거절
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {request.status === 'approved' ? '승인됨' : '거절됨'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 스케줄 생성 가이드 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="ri-lightbulb-line mr-3 text-blue-500"></i>
                스케줄 생성 가이드
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-calendar-check-line text-green-500 mr-2"></i>
                    <span className="font-medium text-gray-800">균등 배분</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    직원들의 근무시간을 균등하게 배분하여 공정성을 유지하세요
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-time-line text-blue-500 mr-2"></i>
                    <span className="font-medium text-gray-800">피크타임 관리</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    바쁜 시간대에는 경험 많은 직원을 배치하세요
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-user-heart-line text-purple-500 mr-2"></i>
                    <span className="font-medium text-gray-800">선호도 반영</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    직원들의 시간대 선호도를 고려하여 만족도를 높이세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 인수인계 탭 */}
        {activeTab === 'handover' && (
          <div className="space-y-8">

            {/* 새 인수인계 작성 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="ri-edit-line mr-3 text-blue-500"></i>
                매니저 공지사항 작성
              </h3>

              <div className="space-y-4">
                <textarea
                  value={newHandover}
                  onChange={e => setNewHandover(e.target.value)}
                  placeholder="직원들에게 전달할 공지사항이나 업무 지시사항을 작성해주세요..."
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
                인수인계 및 공지사항
              </h3>

              {handoverNotes.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-file-list-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">아직 인수인계 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {handoverNotes.map(note => (
                    <div
                      key={note.id}
                      className={`rounded-2xl p-6 border ${getHandoverTypeColor(
                        note.type,
                      )}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <i
                            className={`${getHandoverTypeIcon(
                              note.type,
                            )} text-xl`}
                          ></i>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">

                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-800">
                                  {note.author}
                                </span>
                                {note.isManager && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                                    매니저
                                  </span>
                                )}
                              </div>

                              <span className="text-sm text-gray-500">
                                {note.shift}
                              </span>
                            </div>

                            <span className="text-sm text-gray-500">{note.time}</span>
                          </div>

                          <p className="text-gray-700 leading-relaxed">
                            {note.content}
                          </p>
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
                매니저 공지사항 작성 가이드
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-information-line text-blue-500 mr-2"></i>
                    <span className="font-medium text-gray-800">업무 안내</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    새로운 메뉴, 정책 변경, 교육 내용 등
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-alert-line text-orange-500 mr-2"></i>
                    <span className="font-medium text-gray-800">중요 공지</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    점검 일정, 안전 수칙, 긴급 사항 등
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <i className="ri-task-line text-green-500 mr-2"></i>
                    <span className="font-medium text-gray-800">업무 지시</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    특별 업무, 목표 달성, 개선 사항 등
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      
      </div>

      {/* 출퇴근 처리 모달 */}
      {showAttendanceModal && attendanceEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {attendanceAction === 'checkin' ? '출근 처리' : '퇴근 처리'}
            </h3>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-blue-500 text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg text-gray-800">
                {attendanceEmployee.name}
              </h4>
              <p className="text-gray-600">{attendanceEmployee.position}</p>

              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">
                  {attendanceAction === 'checkin' ? '출근 시간' : '퇴근 시간'}
                </p>
                <p
                  className="text-lg font-bold text-blue-600"
                  suppressHydrationWarning={true}
                >
                  {isClient
                    ? new Date().toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : '09:00'}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmAttendance}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 출퇴근 기록 모달 */}
      {showAttendanceRecordModal && attendanceRecordEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {attendanceRecordEmployee.name}님의 출퇴근 기록
              </h3>
              <button
                onClick={() => setShowAttendanceRecordModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-4">
              {getAttendanceRecords(attendanceRecordEmployee.id).map(record => (
                <div
                  key={record.id}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">날짜</p>
                        <p className="font-medium text-gray-800">{record.date}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">출근</p>
                        <p className="font-medium text-green-600">
                          {record.checkIn}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">퇴근</p>
                        <p className="font-medium text-red-600">
                          {record.checkOut}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">근무시간</p>
                        <p className="font-medium text-blue-600">
                          {record.workHours}시간
                        </p>
                      </div>

                      {record.overtime > 0 && (
                        <div className="text-center">
                          <p className="text-sm text-gray-500">연장근무</p>
                          <p className="font-medium text-orange-600">
                            {record.overtime}시간
                          </p>
                        </div>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceStatusColor(
                        record.status,
                      )}`}
                    >
                      {getAttendanceStatusText(record.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 급여 상세 모달 */}
      {showPayrollDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {showPayrollDetail.name}님 급여 명세서
              </h3>
              <button
                onClick={() => setShowPayrollDetail(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">기본 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">직책</p>
                    <p className="font-medium">{showPayrollDetail.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">시급</p>
                    <p className="font-medium">
                      ₩{showPayrollDetail.hourlyWage?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">기간</p>
                    <p className="font-medium">
                      {monthNames[selectedMonth]} {selectedYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* 근무 시간 */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">근무 시간</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">정규 근무</p>
                    <p className="font-medium">
                      {Math.min(showPayrollDetail.weeklyHours || 0, 40)}시간
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연장 근무</p>
                    <p className="font-medium">
                      {showPayrollDetail.overtimeHours || 0}시간
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">야간 근무</p>
                    <p className="font-medium">
                      {showPayrollDetail.nightShiftHours || 0}시간
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">휴일 근무</p>
                    <p className="font-medium">
                      {showPayrollDetail.holidayHours || 0}시간
                    </p>
                  </div>
                </div>
              </div>

              {/* 급여 계산 */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">급여 계산</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">기본급</span>
                    <span className="font-medium">
                      ₩{calculateBasePay(showPayrollDetail).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">연장수당 (150%)</span>
                    <span className="font-medium">
                      ₩{calculateOvertimePay(showPayrollDetail).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">야간수당 (50%)</span>
                    <span className="font-medium">
                      ₩{calculateNightShiftPay(showPayrollDetail).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">휴일수당 (150%)</span>
                    <span className="font-medium">
                      ₩{calculateHolidayPay(showPayrollDetail).toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-800">총 급여</span>
                    <span className="font-bold text-green-600">
                      ₩{calculateTotalPay(showPayrollDetail).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 공제 내역 */}
              <div className="bg-red-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">공제 내역</h4>
                <div className="space-y-3">
                  {(() => {
                    const deductions = calculateDeductions(
                      calculateTotalPay(showPayrollDetail),
                    );
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">국민연금 (4.5%)</span>
                          <span className="font-medium">
                            ₩{deductions.nationalPension.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">건강보험 (3.35%)</span>
                          <span className="font-medium">
                            ₩{deductions.healthInsurance.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">고용보험 (0.8%)</span>
                          <span className="font-medium">
                            ₩{deductions.employmentInsurance.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">소득세 (3.3%)</span>
                          <span className="font-medium">
                            ₩{deductions.incomeTax.toLocaleString()}
                          </span>
                        </div>

                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-bold text-gray-800">총 공제액</span>
                          <span className="font-bold text-red-600">
                            ₩{deductions.total.toLocaleString()}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 실수령액 */}
              <div className="bg-purple-50 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">실수령액</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ₩
                    {(
                      calculateTotalPay(showPayrollDetail) -
                      calculateDeductions(
                        calculateTotalPay(showPayrollDetail),
                      ).total
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 스케줄 생성 모달 */}
      {showScheduleGeneratorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">월간 스케줄 생성</h3>
              <button
                onClick={() => {
                  setShowScheduleGeneratorModal(false);
                  setScheduleGenerationStep('select');
                }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            {scheduleGenerationStep === 'select' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    생성할 스케줄 선택
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">연도:</label>
                      <select
                        value={scheduleSelectedYear}
                        onChange={e =>
                          setScheduleSelectedYear(parseInt(e.target.value))
                        }
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        <option value={2024}>2024년</option>
                        <option value={2025}>2025년</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">월:</label>
                      <select
                        value={scheduleSelectedMonth}
                        onChange={e =>
                          setScheduleSelectedMonth(parseInt(e.target.value))
                        }
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        {monthNames.map((month, index) => (
                          <option key={index} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    대기 중인 스케줄 요청
                  </h4>
                  <div className="space-y-3">
                    {scheduleRequests
                      .filter(req => req.status === 'pending')
                      .map(request => (
                        <div
                          key={request.id}
                          className="bg-white rounded-xl p-4 border border-green-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-800">
                                {request.employeeName}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {getRequestTypeText(request.requestType)} •{' '}
                                {request.requestedDates?.length}일
                              </span>
                            </div>
                            <span className="text-xs text-green-600">
                              자동 반영 예정
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={generateMonthlySchedule}
                    className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    스케줄 생성하기
                  </button>
                </div>
              </div>
            )}

            {scheduleGenerationStep === 'review' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {scheduleSelectedYear}년 {monthNames[scheduleSelectedMonth]} 스케줄
                    미리보기
                  </h4>
                  <p className="text-gray-600">
                    생성된 스케줄을 확인하고 수정하세요.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-7 bg-gray-50">
                    {dayNames.map(day => (
                      <div
                        key={day}
                        className="p-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {Object.keys(generatedSchedule)
                      .slice(0, 14)
                      .map(dateStr => {
                        const schedule = generatedSchedule[dateStr];
                        const date = new Date(dateStr);

                        return (
                          <div
                            key={dateStr}
                            className="border-r border-b border-gray-200 last:border-r-0 p-2 min-h-[120px]"
                          >
                            <div className="font-medium mb-2">
                              {date.getDate()}
                            </div>

                            <div className="space-y-1">
                              {schedule.shifts.map(
                                (shift: any, index: number) => (
                                  <div
                                    key={index}
                                    className="text-xs bg-blue-100 rounded p-1"
                                  >
                                    <div className="font-medium text-blue-800">
                                      {shift.time}
                                    </div>
                                    <div className="text-blue-600">
                                      {shift.employee
                                        ? shift.employee.name
                                        : '미배정'}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setScheduleGenerationStep('select')}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    다시 생성
                  </button>
                  <button
                    onClick={confirmSchedule}
                    className="bg-green-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    스케줄 확정
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 직원 승인 모달 */}
      {showApprovalModal && employeeToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              직원 승인
            </h3>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-teal-500 text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg text-gray-800">
                {employeeToApprove.userName}
              </h4>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시급 설정
                </label>
                <input
                  type="number"
                  value={approvalData.hourlyWage}
                  onChange={e =>
                    handleApprovalDataChange('hourlyWage', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="시급을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직책
                </label>
                <select
                  value={approvalData.position}
                  onChange={e =>
                    handleApprovalDataChange('position', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
                >
                  {positionOptions.map(position => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부서
                </label>
                <select
                  value={approvalData.department}
                  onChange={e =>
                    handleApprovalDataChange('department', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
                >
                  {departmentOptions.map(department => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmApproval}
                className="flex-1 px-6 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors"
              >
                승인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직원 삭제 확인 모달 */}
      {showDeleteModal && employeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              직원 삭제
            </h3>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-red-500 text-2xl"></i>
              </div>

              <p className="text-gray-600">
                <span className="font-bold">{employeeToDelete.name}</span>님을 정말
                삭제하시겠습니까?
              </p>
              <p className="text-sm text-red-500 mt-2">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDeleteEmployee}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
}
