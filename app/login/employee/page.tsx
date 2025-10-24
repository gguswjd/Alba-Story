import EmployeeLoginForm from './EmployeeLoginForm';
import SocialLogin from '../SocialLogin';
import Link from 'next/link';

export default function EmployeeLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with X button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors cursor-pointer font-medium"
            >
              홈으로
            </Link>
            <Link 
              href="/signup/employee" 
              className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors cursor-pointer font-medium"
            >
              알바생 회원가입
            </Link>
          </div>
          <Link 
            href="/login"
            className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-user-line text-green-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">알바생 로그인</h1>
            <p className="text-gray-600">근무 관리 계정으로 로그인하세요</p>
          </div>

          {/* Social Login */}
          <SocialLogin />
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">또는</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Employee Login Form */}
          <EmployeeLoginForm />

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <Link 
              href="/forgot-password" 
              className="block text-green-600 hover:text-green-700 hover:underline cursor-pointer text-sm"
            >
              비밀번호를 잊으셨나요?
            </Link>
            <div className="text-sm text-gray-500">
              아직 계정이 없으신가요? 
              <Link href="/signup/employee" className="text-green-600 hover:underline cursor-pointer ml-1">
                알바생 회원가입
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            로그인하시면 <Link href="/terms" className="text-green-600 hover:underline cursor-pointer">이용약관</Link> 및 <Link href="/privacy" className="text-green-600 hover:underline cursor-pointer">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}