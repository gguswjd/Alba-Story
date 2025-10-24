
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isLoggedIn = pathname?.includes('dashboard');
  const isBossDashboard = pathname?.includes('boss-dashboard');

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/logo.png"    // public/logo.png
                  alt="Round 로고"
                  width={500}        // 필요에 맞게 조절 가능
                  height={200}
                  priority
                  className="h-auto w-[96px] md:w-[120px]"
                />
              </Link>
            </div>

            {/* Navigation Links - Hidden on mobile */}
            {!isLoggedIn && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium cursor-pointer">
                  서비스 소개
                </Link>
                <Link href="#community" className="text-gray-600 hover:text-blue-600 transition-colors font-medium cursor-pointer">
                  커뮤니티
                </Link>
                <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium cursor-pointer">
                  문의하기
                </Link>
              </nav>
            )}

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-3">
                {isLoggedIn ? (
                  <>
                    <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer whitespace-nowrap">
                      내 정보
                    </Link>
                    <button 
                      onClick={() => {
                        alert('로그아웃되었습니다.');
                        window.location.href = '/';
                      }}
                      className="bg-red-400 text-white px-6 py-2 rounded-full font-medium hover:bg-red-500 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer whitespace-nowrap">
                      로그인
                    </Link>
                    <Link href="/signup" className="bg-blue-400 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-500 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap">
                      시작하기
                    </Link>
                  </>
                )}
              </div>
              
              {/* Menu Button */}
              <button
                onClick={() => setIsSideMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSideMenuOpen(false)}
          ></div>
          
          {/* Side Menu */}
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-slide-in-right">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-blue-400 to-blue-500 p-6 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                {/* Login/Signup Buttons - Left side */}
                <div className="flex items-center space-x-2">
                  {isLoggedIn ? (
                    <>
                      <Link 
                        href="/profile" 
                        className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200 cursor-pointer whitespace-nowrap"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        내 정보
                      </Link>
                      <button 
                        onClick={() => {
                          setIsSideMenuOpen(false);
                          alert('로그아웃되었습니다.');
                          window.location.href = '/';
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-sm"
                      >
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200 cursor-pointer whitespace-nowrap"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        로그인
                      </Link>
                      <Link 
                        href="/signup" 
                        className="bg-white text-blue-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-sm"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        회원가입
                      </Link>
                    </>
                  )}
                </div>

                {/* Close Button - Right side */}
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition-all duration-200 cursor-pointer"
                >
                  <i className="ri-close-line text-white text-xl"></i>
                </button>
              </div>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-6 space-y-2">
                {isBossDashboard ? (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 px-3">매장 관리</h3>
                    <div className="space-y-1">
                      <Link 
                        href="/boss-dashboard" 
                        className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-400 transition-all duration-200">
                          <i className="ri-dashboard-line text-lg text-blue-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div>
                          <span className="font-semibold">대시보드</span>
                          <p className="text-xs text-gray-500 group-hover:text-blue-500">전체 현황 보기</p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/boss-dashboard/new-workplace" 
                        className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-400 transition-all duration-200">
                          <i className="ri-store-2-line text-lg text-green-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div>
                          <span className="font-semibold">매장 관리</span>
                          <p className="text-xs text-gray-500 group-hover:text-green-500">매장 정보 관리</p>
                        </div>
                      </Link>
                      
                      <button 
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-400 transition-all duration-200">
                          <i className="ri-team-line text-lg text-purple-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold">직원 관리</span>
                          <p className="text-xs text-gray-500 group-hover:text-purple-500">직원 현황 및 관리</p>
                        </div>
                      </button>
                      
                      <button 
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-400 transition-all duration-200">
                          <i className="ri-calendar-check-line text-lg text-orange-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold">스케줄 관리</span>
                          <p className="text-xs text-gray-500 group-hover:text-orange-500">근무 일정 관리</p>
                        </div>
                      </button>

                      <button 
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-200">
                          <i className="ri-money-dollar-circle-line text-lg text-yellow-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div className="text-left">
                          <span className="font-semibold">급여 관리</span>
                          <p className="text-xs text-gray-500 group-hover:text-yellow-500">급여 계산 및 지급</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 px-3">둘러보기</h3>
                    <div className="space-y-1">
                      <Link 
                        href="#community" 
                        className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-400 transition-all duration-200">
                          <i className="ri-community-line text-lg text-blue-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div>
                          <span className="font-semibold">커뮤니티</span>
                          <p className="text-xs text-gray-500 group-hover:text-blue-500">알바생 소통 공간</p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="#reviews" 
                        className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-400 transition-all duration-200">
                          <i className="ri-star-line text-lg text-green-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div>
                          <span className="font-semibold">알바 후기</span>
                          <p className="text-xs text-gray-500 group-hover:text-green-500">실제 근무 경험 공유</p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="#tips" 
                        className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-200">
                          <i className="ri-lightbulb-line text-lg text-yellow-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div>
                          <span className="font-semibold">꿀팁 공유</span>
                          <p className="text-xs text-gray-500 group-hover:text-yellow-500">선배들의 노하우</p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="#education" 
                        className="flex items-center space-x-4 p-4 rounded-2xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                        onClick={() => setIsSideMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-400 transition-all duration-200">
                          <i className="ri-shield-user-line text-lg text-purple-600 group-hover:text-white transition-colors"></i>
                        </div>
                        <div>
                          <span className="font-semibold">권리 교육</span>
                          <p className="text-xs text-gray-500 group-hover:text-purple-500">알바생 권리 정보</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">WorkSpace와 함께</p>
                <p className="text-xs text-gray-400">더 나은 근무 환경을 만들어보세요 ✨</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animation */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
