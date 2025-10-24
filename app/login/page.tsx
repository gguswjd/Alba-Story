
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';
import Link from 'next/link';

export default function LoginPage() {
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
              href="/signup" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              회원가입
            </Link>
          </div>
          <Link 
            href="/"
            className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <i className="ri-close-line text-gray-600 text-lg"></i>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">로그인</h1>
            <p className="text-gray-600">계정에 로그인하세요</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">로그인 유형을 선택하세요</p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/login/boss"
                className="flex flex-col items-center p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                  <i className="ri-user-star-line text-blue-600 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">사장님</span>
              </Link>
              <Link 
                href="/login/employee"
                className="flex flex-col items-center p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                  <i className="ri-user-line text-green-600 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">알바생</span>
              </Link>
            </div>
          </div>

          {/* Social Login */}
          <SocialLogin />
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">또는</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-sm"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            로그인하시면 <Link href="/terms" className="text-blue-600 hover:underline cursor-pointer">이용약관</Link> 및 <Link href="/privacy" className="text-blue-600 hover:underline cursor-pointer">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
