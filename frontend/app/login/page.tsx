import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">로그인 유형 선택</h1>
          <p className="text-gray-600 text-sm">어떤 방식으로 로그인할지 선택해주세요</p>
        </div>

        {/* 로그인 유형 선택 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
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
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  사장님
                </span>
              </Link>
              <Link
                href="/login/employee"
                className="flex flex-col items-center p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                  <i className="ri-user-line text-green-600 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                  알바생
                </span>
              </Link>
            </div>
          </div>

          {/* 홈으로 / 회원가입 정도만 추가로 둘 수도 있음 */}
          <div className="mt-4 flex justify-between text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
              홈으로
            </Link>
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
