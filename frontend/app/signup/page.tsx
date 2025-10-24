
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with X button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              홈으로
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              로그인
            </Link>
          </div>
          <Link 
            href="/"
            className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <i className="ri-close-line text-gray-600 text-lg"></i>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">회원가입</h1>
            <p className="text-gray-600">가입 유형을 선택해주세요</p>
          </div>

          {/* User Type Selection */}
          <div className="space-y-4">
            <Link 
              href="/signup/boss"
              className="w-full flex items-center p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <i className="ri-user-star-line text-blue-600 text-2xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">사장님 회원가입</h3>
                <p className="text-sm text-gray-600 mt-1">매장을 운영하고 직원을 관리하세요</p>
                <div className="flex items-center mt-2 text-xs text-blue-600">
                  <span>매장 등록 • 직원 관리 • 스케줄 관리</span>
                </div>
              </div>
              <i className="ri-arrow-right-line text-gray-400 group-hover:text-blue-600 text-xl transition-colors"></i>
            </Link>

            <Link 
              href="/signup/employee"
              className="w-full flex items-center p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                <i className="ri-user-line text-green-600 text-2xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">알바생 회원가입</h3>
                <p className="text-sm text-gray-600 mt-1">근무 스케줄을 확인하고 관리하세요</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <span>근무 확인 • 급여 조회 • 일정 관리</span>
                </div>
              </div>
              <i className="ri-arrow-right-line text-gray-400 group-hover:text-green-600 text-xl transition-colors"></i>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              이미 계정이 있으신가요? 
              <Link href="/login" className="text-blue-600 hover:underline cursor-pointer ml-1">
                로그인하기
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            회원가입 시 <Link href="/terms" className="text-blue-600 hover:underline cursor-pointer">이용약관</Link> 및 <Link href="/privacy" className="text-blue-600 hover:underline cursor-pointer">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
