
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

interface WorkplaceManageDetailProps {
  workplaceId: string;
}

export default function WorkplaceManageDetail({ workplaceId }: { workplaceId: string }) {
  // State variables
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [employeeFilter, setEmployeeFilter] = useState<'active' | 'pending'>('active');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [employeeToApprove, setEmployeeToApprove] = useState<Employee | null>(null);
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
      time: '2024.12.16 15:30',
      shift: '매니저',
      content:
        '오늘 새로운 메뉴 교육 자료가 도착했습니다. 직원들에게 안내해주시고, 레시피 숙지 후 고객 응대 시작해주세요.',
      type: 'info',
      isManager: true
    },
    {
      id: 2,
      author: '김바리스타',
      time: '2024.12.16 13:50',
      shift: '14:00-20:00',
      content:
        '오늘 에스프레소 머신 청소 완료했습니다. 원두 재고 부족하니 다음 근무자분이 확인해주세요.',
      type: 'info',
      isManager: false
    },
    {
      id: 3,
      author: '김사장',
      time: '2024.12.16 12:00',
      shift: '매니저',
      content:
        '점심시간 이후 본사 점검이 있을 예정입니다. 매장 정리정돈과 위생 관리에 특히 신경 써주세요.',
      type: 'warning',
      isManager: true
    },
    {
      id: 4,
      author: '박알바',
      time: '2024.12.16 12:30',
      shift: '09:00-13:00',
      content:
        '점심시간 전에 테이블 5번 손님이 아이스 아메리카노 엎지셨어요. 청소는 완료했지만 바닥이 조금 미끄러울 수 있으니 주의해주세요.',
      type: 'warning',
      isManager: false
    },
    {
      id: 5,
      author: '김사장',
      time: '2024.12.16 09:00',
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
  const [scheduleGenerationStep, setScheduleGenerationStep] = useState<'select' | 'generate' | 'review'>('select');

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

  // Original component code integration
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: '김민수',
      position: '매니저',
      phone: '010-1234-5678',
      email: 'minsu@example.com',
      joinDate: '2024-01-15',
      workDays: 45,
      status: 'active',
      hourlyWage: 15000,
      weeklyHours: 40,
      overtimeHours: 8,
      nightShiftHours: 12,
      holidayHours: 4,
      avatar:
        'https://readdy.ai/api/search-image?query=professional%20korean%20male%20manager%20in%20casual%20business%20attire%20smiling%20confidently%20in%20modern%20office%20setting%20with%20clean%20background&width=100&height=100&seq=emp1&orientation=squarish',
      lastCheckIn: '09:00',
      lastCheckOut: '18:00',
      isWorking: true,
      totalHours: 180,
      monthlyHours: 160
    },
    {
      id: 2,
      name: '이지은',
      position: '직원',
      phone: '010-2345-6789',
      email: 'jieun@example.com',
      joinDate: '2024-02-01',
      workDays: 38,
      status: 'active',
      hourlyWage: 12000,
      weeklyHours: 35,
      overtimeHours: 5,
      nightShiftHours: 8,
      holidayHours: 2,
      avatar:
        'https://readdy.ai/api/search-image?query=friendly%20korean%20female%20employee%20in%20casual%20work%20uniform%20smiling%20warmly%20in%20bright%20workplace%20environment%20with%20simple%20background&width=100&height=100&seq=emp2&orientation=squarish',
      lastCheckIn: '14:00',
      lastCheckOut: '-',
      isWorking: true,
      totalHours: 140,
      monthlyHours: 120
    },
    {
      id: 3,
      name: '박준호',
      position: '직원',
      phone: '010-3456-7890',
      email: 'junho@example.com',
      joinDate: '2024-02-15',
      workDays: 32,
      status: 'active',
      hourlyWage: 11000,
      weeklyHours: 30,
      overtimeHours: 3,
      nightShiftHours: 6,
      holidayHours: 0,
      avatar:
        'https://readdy.ai/api/search-image?query=young%20korean%20male%20part-time%20worker%20in%20casual%20uniform%20with%20friendly%20expression%20in%20modern%20workplace%20setting%20with%20clean%20background&width=100&height=100&seq=emp3&orientation=squarish',
      lastCheckIn: '10:00',
      lastCheckOut: '17:00',
      isWorking: false,
      totalHours: 96,
      monthlyHours: 80
    },
    {
      id: 4,
      name: '최서연',
      position: '아르바이트',
      phone: '010-4567-8901',
      email: 'seoyeon@example.com',
      joinDate: '2024-03-01',
      workDays: 25,
      status: 'active',
      hourlyWage: 9620,
      weeklyHours: 20,
      overtimeHours: 0,
      nightShiftHours: 4,
      holidayHours: 0,
      avatar:
        'https://readdy.ai/api/search-image?query=cheerful%20korean%20female%20student%20part-timer%20in%20casual%20work%20attire%20with%20bright%20smile%20in%20clean%20modern%20workplace%20background&width=100&height=100&seq=emp4&orientation=squarish',
      lastCheckIn: '16:00',
      lastCheckOut: '-',
      isWorking: true,
      totalHours: 50,
      monthlyHours: 40
    },
    { id: 5, name: '정우진', position: '직원', phone: '010-5678-9012', email: 'woojin@example.com', appliedDate: '2024-03-10', workDays: 0, status: 'pending' },
    { id: 6, name: '강민지', position: '아르바이트', phone: '010-6789-0123', email: 'minji@example.com', appliedDate: '2024-03-15', workDays: 0, status: 'pending' },
    { id: 7, name: '윤태희', position: '직원', phone: '010-7890-1234', email: 'taehee@example.com', appliedDate: '2024-03-18', workDays: 0, status: 'pending' }
  ]);

  // Mock data - 실제로는 API에서 가져올 데이터
  const workplace = {
    id: workplaceId,
    name: workplaceId === '1' ? '스타벅스 강남점' : '맥도날드 홍대점',
    type: workplaceId === '1' ? '카페' : '패스트푸드',
    address: workplaceId === '1' ? '서울시 강남구 테헤란로 123' : '서울시 마포구 홍익로 456',
    phone: workplaceId === '1' ? '02-1234-5678' : '02-9876-5432',
    manager: '김사장',
    openTime: '06:00',
    closeTime: '22:00',
    status: 'active'
  };

  // 출퇴근 기록 Mock 데이터
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

    setEmployees(prevEmployees =>
      prevEmployees.map(emp => {
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

  // 스케줄 생성 함수들
  const generateMonthlySchedule = () => {
    const year = scheduleSelectedYear;
    const month = scheduleSelectedMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const schedule: any = {};

    const pendingRequests = scheduleRequests.filter(req => req.status === 'pending');

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      schedule[dateStr] = {
        date: dateStr,
        dayOfWeek: dayOfWeek,
        shifts: []
      };

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        schedule[dateStr].shifts = [
          { time: '09:00-15:00', employee: null, type: 'morning' },
          { time: '15:00-21:00', employee: null, type: 'afternoon' }
        ];
      } else {
        schedule[dateStr].shifts = [
          { time: '09:00-15:00', employee: null, type: 'morning' },
          { time: '15:00-21:00', employee: null, type: 'afternoon' },
          { time: '21:00-24:00', employee: null, type: 'night' }
        ];
      }
    }

    pendingRequests.forEach(request => {
      const employee = activeEmployees.find(emp => emp.id === request.employeeId);
      if (!employee || !request.requestedDates) return;

      request.requestedDates.forEach(dateStr => {
        if (schedule[dateStr]) {
          const preferredTimes = request.preferredTimes || [];

          preferredTimes.forEach(timeSlot => {
            let targetShift = null;

            if (timeSlot.includes('오전') || timeSlot.includes('09:00')) {
              targetShift = schedule[dateStr].shifts.find((s: any) => s.type === 'morning' && !s.employee);
            } else if (timeSlot.includes('오후') || timeSlot.includes('15:00')) {
              targetShift = schedule[dateStr].shifts.find((s: any) => s.type === 'afternoon' && !s.employee);
            } else if (timeSlot.includes('저녁') || timeSlot.includes('야간')) {
              targetShift = schedule[dateStr].shifts.find((s: any) => s.type === 'night' && !s.employee);
            }

            if (targetShift) {
              targetShift.employee = {
                id: employee.id,
                name: employee.name,
                position: employee.position
              };
            }
          });
        }
      });
    });

    Object.keys(schedule).forEach(dateStr => {
      schedule[dateStr].shifts.forEach((shift: any) => {
        if (!shift.employee) {
          const availableEmployee = activeEmployees.find(emp => {
            const alreadyScheduled = schedule[dateStr].shifts.some((s: any) =>
              s.employee && s.employee.id === emp.id
            );
            return !alreadyScheduled;
          });

          if (availableEmployee) {
            shift.employee = {
              id: availableEmployee.id,
              name: availableEmployee.name,
              position: availableEmployee.position
            };
          }
        }
      });
    });

    setGeneratedSchedule(schedule);
    setScheduleGenerationStep('review');
  };

  const confirmSchedule = () => {
    console.log('스케줄 확정:', generatedSchedule);
    alert('스케줄이 성공적으로 생성되었습니다! 🎉');
    setShowScheduleGeneratorModal(false);
    setScheduleGenerationStep('select');
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

  const pendingEmployees = employees.filter(emp => emp.status === 'pending');
  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const displayedEmployees = employeeFilter === 'pending' ? pendingEmployees : activeEmployees;

  // 직원 승인/거절 로직
  const handleApproveEmployee = (employee: Employee) => {
    setEmployeeToApprove(employee);
    setApprovalData({
      hourlyWage: '10000',
      position: employee.position,
      department: '홀 서빙'
    });
    setShowApprovalModal(true);
  };

  const handleRejectEmployee = (employeeId: number) => {
    console.log('직원 거절:', employeeId);
  };

  const handleApprovalDataChange = (field: string, value: string) => {
    setApprovalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const confirmApproval = () => {
    if (employeeToApprove) {
      console.log('직원 승인:', {
        employee: employeeToApprove,
        approvalData
      });
      alert(`${employeeToApprove.name}님이 승인되었습니다! 🎉`);
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
                <h1 className="text-2xl font-bold text-gray-800">{workplace.name}</h1>
                <p className="text-gray-600">매장 관리</p>
              </div>
            </div>
            <span
              className={`text-sm px-4 py-2 rounded-full font-medium text-white ${getStatusColor(
                workplace.status
              )}`}
            >
              {getStatusText(workplace.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
            <div className="text-3xl font-bold mb-2 text-blue-500">{activeEmployees.length}</div>
            <div className="text-gray-600">👥 활성 직원</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
            <div className="text-3xl font-bold mb-2 text-green-500">{activeEmployees.filter(e => e.isWorking).length}</div>
            <div className="text-gray-600">🟢 현재 근무중</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100">
            <div className="text-3xl font-bold mb-2 text-orange-500">{scheduleRequests.filter(r => r.status === 'pending').length}</div>
            <div className="text-gray-600">⏳ 대기 요청</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'employees' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
              }`}
            >
              직원 관리
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'attendance' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
              }`}
            >
              출퇴근 관리
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'payroll' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
              }`}
            >
              급여 계산
            </button>
            <button
              onClick={() => setActiveTab('schedule-calendar')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'schedule-calendar' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
              }`}
            >
              스케줄 관리
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'schedule' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
              }`}
            >
              스케줄 요청
            </button>
            <button
              onClick={() => setActiveTab('handover')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'handover' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
              }`}
            >
              인수인계
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* 직원 관리 탭 */}
          {activeTab === 'employees' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">직원 목록</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEmployeeFilter('active')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      employeeFilter === 'active' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    활동 중 ({activeEmployees.length})
                  </button>
                  <button
                    onClick={() => setEmployeeFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      employeeFilter === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    승인 대기 ({pendingEmployees.length})
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {displayedEmployees.map(employee => (
                  <div key={employee.id} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-xl text-teal-600"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{employee.name}</h3>
                            <span className="text-sm text-gray-500">{employee.position}</span>
                            {employee.status === 'pending' && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                                승인 대기
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <i className="ri-phone-line"></i>
                              {employee.phone}
                            </span>
                            {employee.status === 'active' ? (
                              <>
                                <span className="flex items-center gap-1">
                                  <i className="ri-calendar-line"></i>
                                  입사일: {employee.joinDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <i className="ri-time-line"></i>
                                  근무일: {employee.workDays}일
                                </span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1">
                                <i className="ri-calendar-line"></i>
                                신청일: {employee.appliedDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {employee.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveEmployee(employee)}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleRejectEmployee(employee.id)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                            >
                              거절
                            </button>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {displayedEmployees.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-line text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-5">
                    {employeeFilter === 'pending' ? '승인 대기 중인 직원이 없습니다' : '등록된 직원이 없습니다'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 출퇴근 관리 탭 */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">출퇴근 관리</h2>

              <div className="space-y-6">
                {activeEmployees.map(employee => (
                  <div key={employee.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-12 h-12 rounded-full object-cover object-top"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{employee.name}</h3>
                          <p className="text-gray-600 text-sm">{employee.position}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">출근시간</p>
                          <p className="font-medium text-green-600">{employee.lastCheckIn || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">퇴근시간</p>
                          <p className="font-medium text-red-600">{employee.lastCheckOut || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">상태</p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              employee.isWorking ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
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
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">연도:</label>
                      <select
                        value={selectedYear}
                        onChange={e => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                      >
                        <option value={2024}>2024년</option>
                        <option value={2023}>2023년</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">월:</label>
                      <select
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(parseInt(e.target.value))}
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
                    <div className="text-2xl font-bold text-blue-500 mb-2">₩{activeEmployees.reduce((sum, emp) => sum + calculateTotalPay(emp), 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">💰 총 급여</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
                    <div className="text-2xl font-bold text-green-500 mb-2">{activeEmployees.reduce((sum, emp) => sum + (emp.weeklyHours || 0), 0)}시간</div>
                    <div className="text-sm text-gray-600">⏰ 총 근무시간</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 text-center border border-orange-100">
                    <div className="text-2xl font-bold text-orange-500 mb-2">{activeEmployees.reduce((sum, emp) => sum + (emp.overtimeHours || 0), 0)}시간</div>
                    <div className="text-sm text-gray-600">🕐 연장근무</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100">
                    <div className="text-2xl font-bold text-purple-500 mb-2">₩{activeEmployees.reduce((sum, emp) => {
                      const deductions = calculateDeductions(calculateTotalPay(emp));
                      return sum + deductions.total;
                    }, 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">📋 총 공제액</div>
                  </div>
                </div>
              </div>

              {/* 직원별 급여 목록 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">직원별 급여 내역</h3>

                <div className="space-y-4">
                  {activeEmployees.map(employee => {
                    const totalPay = calculateTotalPay(employee);
                    const deductions = calculateDeductions(totalPay);
                    const netPay = totalPay - deductions.total;

                    return (
                      <div key={employee.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <i className="ri-user-line text-purple-500 text-xl"></i>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">{employee.name}</h4>
                              <p className="text-gray-600 text-sm">{employee.position} • 시급 ₩{employee.hourlyWage?.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">총 근무시간</p>
                              <p className="font-bold text-blue-600">{employee.weeklyHours}시간</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">총 급여</p>
                              <p className="font-bold text-green-600">₩{totalPay.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">공제액</p>
                              <p className="font-bold text-red-600">₩{deductions.total.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">실수령액</p>
                              <p className="font-bold text-purple-600 text-lg">₩{netPay.toLocaleString()}</p>
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

              {/* 급여 계산 가이드 */}
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
                      <div key={day} className={`p-4 text-center font-medium border-r border-gray-200 last:border-r-0 ${
                        index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
                      }`}>
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
                      
                      const calendarDays = [];
                      
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
                          isCurrentMonth: true 
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
                        
                        // 해당 날짜의 스케줄 데이터 (실제로는 API에서 가져올 데이터)
                        const daySchedule = (() => {
                          const dayOfWeek = date.getDay();
                          if (!isCurrentMonth) return [];
                          
                          // 샘플 스케줄 데이터
                          const sampleSchedules = [
                            { time: '09:00-15:00', employee: '김민수', position: '매니저', type: 'morning' },
                            { time: '15:00-21:00', employee: '이지은', position: '직원', type: 'afternoon' },
                            { time: '21:00-24:00', employee: '박준호', position: '직원', type: 'night' }
                          ];
                          
                          // 주말에는 야간 근무 제외
                          if (dayOfWeek === 0 || dayOfWeek === 6) {
                            return sampleSchedules.slice(0, 2);
                          }
                          
                          return sampleSchedules;
                        })();

                        return (
                          <div 
                            key={index} 
                            className={`border-r border-b border-gray-200 last:border-r-0 p-2 min-h-[120px] ${
                              isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                            } ${isToday ? 'bg-blue-50' : ''}`}
                          >
                            <div className={`font-medium mb-2 ${
                              isToday ? 'text-blue-600' : 
                              isCurrentMonth ? 
                                index % 7 === 0 ? 'text-red-500' : 
                                index % 7 === 6 ? 'text-blue-500' : 'text-gray-800'
                              : 'text-gray-400'
                            }`}>
                              {date.getDate()}
                            </div>
                            
                            {isCurrentMonth && (
                              <div className="space-y-1">
                                {daySchedule.map((shift, shiftIndex) => (
                                  <div 
                                    key={shiftIndex} 
                                    className={`text-xs rounded p-1 border ${
                                      shift.type === 'morning' ? 'bg-green-100 text-green-700 border-green-200' :
                                      shift.type === 'afternoon' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                      'bg-purple-100 text-purple-700 border-purple-200'
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
                  <div className="text-2xl font-bold text-green-500 mb-2">{activeEmployees.length * 20}</div>
                  <div className="text-gray-600">📅 이번달 총 시프트</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
                  <div className="text-2xl font-bold text-blue-500 mb-2">{activeEmployees.length * 160}</div>
                  <div className="text-gray-600">⏰ 총 근무시간</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100">
                  <div className="text-2xl font-bold text-orange-500 mb-2">3</div>
                  <div className="text-gray-600">👥 배정 대기</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100">
                  <div className="text-2xl font-bold text-purple-500 mb-2">95%</div>
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
                    // 해당 직원의 월간 스케줄 통계 (샘플 데이터)
                    const monthlySchedule = {
                      totalShifts: Math.floor(Math.random() * 10) + 15,
                      morningShifts: Math.floor(Math.random() * 8) + 5,
                      afternoonShifts: Math.floor(Math.random() * 8) + 5,
                      nightShifts: Math.floor(Math.random() * 5) + 2,
                      totalHours: Math.floor(Math.random() * 50) + 120
                    };

                    return (
                      <div key={employee.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={employee.avatar}
                              alt={employee.name}
                              className="w-12 h-12 rounded-full object-cover object-top"
                            />
                            <div>
                              <h4 className="font-bold text-gray-800">{employee.name}</h4>
                              <p className="text-gray-600 text-sm">{employee.position}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">총 시프트</p>
                              <p className="font-bold text-purple-600">{monthlySchedule.totalShifts}회</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">오전</p>
                              <p className="font-bold text-green-600">{monthlySchedule.morningShifts}회</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">오후</p>
                              <p className="font-bold text-blue-600">{monthlySchedule.afternoonShifts}회</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">야간</p>
                              <p className="font-bold text-purple-600">{monthlySchedule.nightShifts}회</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">총 시간</p>
                              <p className="font-bold text-gray-800">{monthlySchedule.totalHours}h</p>
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
                    <p className="text-sm text-gray-600">직원들의 근무시간을 균등하게 배분하여 공정성을 유지하세요</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-time-line text-blue-500 mr-2"></i>
                      <span className="font-medium text-gray-800">피크타임 관리</span>
                    </div>
                    <p className="text-sm text-gray-600">바쁜 시간대에는 경험 많은 직원을 배치하세요</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-user-heart-line text-purple-500 mr-2"></i>
                      <span className="font-medium text-gray-800">선호도 반영</span>
                    </div>
                    <p className="text-sm text-gray-600">직원들의 시간대 선호도를 고려하여 만족도를 높이세요</p>
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
                    <div key={request.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="ri-calendar-line text-blue-500 text-xl"></i>
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-bold text-gray-800">{request.employeeName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRequestTypeColor(request.requestType)}`}>
                                {getRequestTypeText(request.requestType)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-1">
                              요청 날짜: {request.requestedDates?.length}일 
                              ({request.requestedDates?.slice(0, 2).map(date => new Date(date).getDate()).join(', ')}일 
                              {request.requestedDates && request.requestedDates.length > 2 ? ` 외 ${request.requestedDates.length - 2}일` : ''})
                            </p>
                            <p className="text-gray-500 text-sm">{request.reason}</p>
                            {request.message && (
                              <p className="text-blue-600 text-sm mt-1">💬 {request.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-400">{request.requestDate}</span>
                          {request.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleScheduleAction(request.id, 'approve')}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleScheduleAction(request.id, 'reject')}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors whitespace-nowrap"
                              >
                                거절
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
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
                    <p className="text-sm text-gray-600">직원들의 근무시간을 균등하게 배분하여 공정성을 유지하세요</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-time-line text-blue-500 mr-2"></i>
                      <span className="font-medium text-gray-800">피크타임 관리</span>
                    </div>
                    <p className="text-sm text-gray-600">바쁜 시간대에는 경험 많은 직원을 배치하세요</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-user-heart-line text-purple-500 mr-2"></i>
                      <span className="font-medium text-gray-800">선호도 반영</span>
                    </div>
                    <p className="text-sm text-gray-600">직원들의 시간대 선호도를 고려하여 만족도를 높이세요</p>
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
                      <div key={note.id} className={`rounded-2xl p-6 border ${getHandoverTypeColor(note.type)}`}>
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <i className={`${getHandoverTypeIcon(note.type)} text-xl`}></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-gray-800">{note.author}</span>
                                  {note.isManager && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                                      매니저
                                    </span>
                                  )}
                                </div>
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
                  매니저 공지사항 작성 가이드
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-information-line text-blue-500 mr-2"></i>
                      <span className="font-medium text-gray-800">업무 안내</span>
                    </div>
                    <p className="text-sm text-gray-600">새로운 메뉴, 정책 변경, 교육 내용 등</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-alert-line text-orange-500 mr-2"></i>
                      <span className="font-medium text-gray-800">중요 공지</span>
                    </div>
                    <p className="text-sm text-gray-600">점검 일정, 안전 수칙, 긴급 사항 등</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <i className="ri-task-line text-green-500 mr-2"></i>
                      <span className="font-medium text-gray-800">업무 지시</span>
                    </div>
                    <p className="text-sm text-gray-600">특별 업무, 목표 달성, 개선 사항 등</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
              <h4 className="font-bold text-lg text-gray-800">{attendanceEmployee.name}</h4>
              <p className="text-gray-600">{attendanceEmployee.position}</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">
                  {attendanceAction === 'checkin' ? '출근 시간' : '퇴근 시간'}
                </p>
                <p className="text-lg font-bold text-blue-600" suppressHydrationWarning={true}>
                  {isClient ? new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }) : '09:00'}
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
                <div key={record.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">날짜</p>
                        <p className="font-medium text-gray-800">{record.date}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">출근</p>
                        <p className="font-medium text-green-600">{record.checkIn}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">퇴근</p>
                        <p className="font-medium text-red-600">{record.checkOut}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">근무시간</p>
                        <p className="font-medium text-blue-600">{record.workHours}시간</p>
                      </div>
                      {record.overtime > 0 && (
                        <div className="text-center">
                          <p className="text-sm text-gray-500">연장근무</p>
                          <p className="font-medium text-orange-600">{record.overtime}시간</p>
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceStatusColor(record.status)}`}>
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
                    <p className="font-medium">₩{showPayrollDetail.hourlyWage?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">기간</p>
                    <p className="font-medium">{monthNames[selectedMonth]} {selectedYear}</p>
                  </div>
                </div>
              </div>

              {/* 근무 시간 */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">근무 시간</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">정규 근무</p>
                    <p className="font-medium">{Math.min(showPayrollDetail.weeklyHours || 0, 40)}시간</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연장 근무</p>
                    <p className="font-medium">{showPayrollDetail.overtimeHours || 0}시간</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">야간 근무</p>
                    <p className="font-medium">{showPayrollDetail.nightShiftHours || 0}시간</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">휴일 근무</p>
                    <p className="font-medium">{showPayrollDetail.holidayHours || 0}시간</p>
                  </div>
                </div>
              </div>

              {/* 급여 계산 */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">급여 계산</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">기본급</span>
                    <span className="font-medium">₩{calculateBasePay(showPayrollDetail).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연장수당 (150%)</span>
                    <span className="font-medium">₩{calculateOvertimePay(showPayrollDetail).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">야간수당 (50%)</span>
                    <span className="font-medium">₩{calculateNightShiftPay(showPayrollDetail).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">휴일수당 (150%)</span>
                    <span className="font-medium">₩{calculateHolidayPay(showPayrollDetail).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-800">총 급여</span>
                    <span className="font-bold text-green-600">₩{calculateTotalPay(showPayrollDetail).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 공제 내역 */}
              <div className="bg-red-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">공제 내역</h4>
                <div className="space-y-3">
                  {(() => {
                    const deductions = calculateDeductions(calculateTotalPay(showPayrollDetail));
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">국민연금 (4.5%)</span>
                          <span className="font-medium">₩{deductions.nationalPension.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">건강보험 (3.35%)</span>
                          <span className="font-medium">₩{deductions.healthInsurance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">고용보험 (0.8%)</span>
                          <span className="font-medium">₩{deductions.employmentInsurance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">소득세 (3.3%)</span>
                          <span className="font-medium">₩{deductions.incomeTax.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-bold text-gray-800">총 공제액</span>
                          <span className="font-bold text-red-600">₩{deductions.total.toLocaleString()}</span>
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
                    ₩{(calculateTotalPay(showPayrollDetail) - calculateDeductions(calculateTotalPay(showPayrollDetail)).total).toLocaleString()}
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
                  <h4 className="font-bold text-gray-800 mb-4">생성할 스케줄 선택</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">연도:</label>
                      <select
                        value={scheduleSelectedYear}
                        onChange={e => setScheduleSelectedYear(parseInt(e.target.value))}
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
                        onChange={e => setScheduleSelectedMonth(parseInt(e.target.value))}
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
                  <h4 className="font-bold text-gray-800 mb-4">대기 중인 스케줄 요청</h4>
                  <div className="space-y-3">
                    {scheduleRequests.filter(req => req.status === 'pending').map(request => (
                      <div key={request.id} className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-800">{request.employeeName}</span>
                            <span className="ml-2 text-sm text-gray-500">
                              {getRequestTypeText(request.requestType)} • {request.requestedDates?.length}일
                            </span>
                          </div>
                          <span className="text-xs text-green-600">자동 반영 예정</span>
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
                    {scheduleSelectedYear}년 {monthNames[scheduleSelectedMonth]} 스케줄 미리보기
                  </h4>
                  <p className="text-gray-600">생성된 스케줄을 확인하고 수정하세요.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-7 bg-gray-50">
                    {dayNames.map(day => (
                      <div key={day} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {Object.keys(generatedSchedule).slice(0, 14).map(dateStr => {
                      const schedule = generatedSchedule[dateStr];
                      const date = new Date(dateStr);
                      return (
                        <div key={dateStr} className="border-r border-b border-gray-200 last:border-r-0 p-2 min-h-[120px]">
                          <div className="font-medium mb-2">{date.getDate()}</div>
                          <div className="space-y-1">
                            {schedule.shifts.map((shift: any, index: number) => (
                              <div key={index} className="text-xs bg-blue-100 rounded p-1">
                                <div className="font-medium text-blue-800">{shift.time}</div>
                                <div className="text-blue-600">
                                  {shift.employee ? shift.employee.name : '미배정'}
                                </div>
                              </div>
                            ))}
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
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">직원 승인</h3>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-teal-500 text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg text-gray-800">{employeeToApprove.name}</h4>
              <p className="text-gray-600">{employeeToApprove.position}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시급 설정</label>
                <input
                  type="number"
                  value={approvalData.hourlyWage}
                  onChange={e => handleApprovalDataChange('hourlyWage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="시급을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직책</label>
                <select
                  value={approvalData.position}
                  onChange={e => handleApprovalDataChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
                >
                  {positionOptions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부서</label>
                <select
                  value={approvalData.department}
                  onChange={e => handleApprovalDataChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-8"
                >
                  {departmentOptions.map(department => (
                    <option key={department} value={department}>{department}</option>
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
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">직원 삭제</h3>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-red-500 text-2xl"></i>
              </div>
              <p className="text-gray-600">
                <span className="font-bold">{employeeToDelete.name}</span>님을 정말 삭제하시겠습니까?
              </p>
              <p className="text-sm text-red-500 mt-2">이 작업은 되돌릴 수 없습니다.</p>
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
