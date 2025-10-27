'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { FaUserTie } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa";
import Image from 'next/image';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header />
        
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-800">
                알바생들의<br />
                <span className="text-blue-500">행복한 근무</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-3xl mx-auto">
                사장님과 알바생이 함께 만드는 따뜻한 근무지 관리 플랫폼
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-blue-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap"
                >
                  지금 시작하기
                </button>
                <button className="border-2 border-blue-400 text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-400 hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                  더 알아보기
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-500">1,200+</div>
                  <div className="text-lg text-gray-600">활성 사용자</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-orange-500">150+</div>
                  <div className="text-lg text-gray-600">등록된 근무지</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                두 가지 방식으로 시작하세요
              </h2>
              <p className="text-xl text-gray-600">사장님과 알바생, 각자에게 최적화된 기능을 제공합니다</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* For Boss */}
              <div className="bg-blue-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUserTie className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">사장님용</h3>
                  <p className="text-gray-600 mb-6">매장 운영과 직원 관리를 쉽고 재미있게!</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-blue-100">
                    <span className="text-2xl">🏪</span>
                    <span className="text-gray-700 font-medium">근무지 등록 및 관리</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-blue-100">
                    <span className="text-2xl">👥</span>
                    <span className="text-gray-700 font-medium">직원 채용 및 승인</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-blue-100">
                    <span className="text-2xl">📅</span>
                    <span className="text-gray-700 font-medium">스케줄 관리</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-blue-100">
                    <span className="text-2xl">📢</span>
                    <span className="text-gray-700 font-medium">공지사항 발송</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-400 text-white py-4 px-6 rounded-full font-bold text-lg hover:bg-blue-500 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg">
                  사장님으로 시작하기
                </button>
              </div>

              {/* For Employee */}
              <div className="bg-green-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUserClock className="text-4xl text-white translate-x-[4px]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">알바생용</h3>
                  <p className="text-gray-600 mb-6">근무지 참여와 커뮤니티 활동을 즐겁게!</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-green-100">
                    <span className="text-2xl">🔗</span>
                    <span className="text-gray-700 font-medium">그룹코드로 근무지 참여</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-green-100">
                    <span className="text-2xl">⭐</span>
                    <span className="text-gray-700 font-medium">알바 후기 게시판</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-green-100">
                    <span className="text-2xl">💡</span>
                    <span className="text-gray-700 font-medium">알바 꿀팁 공유</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-green-100">
                    <span className="text-2xl">🛡️</span>
                    <span className="text-gray-700 font-medium">알바생 권리 교육</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-green-100">
                    <span className="text-2xl">💰</span>
                    <span className="text-gray-700 font-medium">급여 계산기</span>
                  </div>
                </div>
                
                <button className="w-full bg-green-400 text-white py-4 px-6 rounded-full font-bold text-lg hover:bg-green-500 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg">
                  알바생으로 시작하기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-yellow-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                활발한 알바생 커뮤니티
              </h2>
              <p className="text-xl text-gray-600">실제 경험과 유용한 정보를 나누는 따뜻한 공간</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">알바 후기</h3>
                <p className="text-3xl font-bold text-green-500 mb-2">1,248</p>
                <p className="text-gray-600 mb-4">개의 솔직한 후기</p>
                <p className="text-sm text-gray-500">실제 근무 경험을 바탕으로 한 생생한 후기들</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-yellow-100">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">알바 꿀팁</h3>
                <p className="text-3xl font-bold text-yellow-500 mb-2">892</p>
                <p className="text-gray-600 mb-4">개의 유용한 팁</p>
                <p className="text-sm text-gray-500">선배 알바생들이 알려주는 노하우와 꿀팁들</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">권리 교육</h3>
                <p className="text-3xl font-bold text-purple-500 mb-2">567</p>
                <p className="text-gray-600 mb-4">개의 교육 자료</p>
                <p className="text-sm text-gray-500">알바생이 알아야 할 권리와 법적 정보들</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                간단한 3단계로 시작하세요
              </h2>
              <p className="text-xl text-gray-600">복잡한 절차 없이 바로 이용할 수 있어요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center relative">
                <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">회원가입</h3>
                  <p className="text-gray-600">간단한 정보 입력으로 계정을 만들어보세요</p>
                </div>
                {/* Connection Line */}
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-blue-200 transform translate-x-10 rounded-full"></div>
              </div>
              
              <div className="text-center relative">
                <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg z-0">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 shadow-sm border border-green-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">역할 선택</h3>
                  <p className="text-gray-600">사장님인지 알바생인지 선택해주세요</p>
                </div>
                {/* Connection Line */}
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-green-200 transform translate-x-10 rounded-full z-0"></div>
              </div>
              
              <div className="text-center z-10">
                <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg z-10">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">바로 시작</h3>
                  <p className="text-gray-600">근무지 등록 또는 그룹 참여로 바로 이용하세요</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-blue-400">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 바로 ROUND를 시작해보세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              더 즐겁고 효율적인 근무 환경을 만들어보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg">
                문의하기
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-16 border-t border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                  <Image
                    src="/logo.png"    // public/logo.png
                    alt="Round 로고"
                    width={500}        // 필요에 맞게 조절 가능
                    height={200}
                    priority
                    className="h-auto w-[120px]"
                  />
                </div>
                <p className="text-gray-600 mb-6 text-lg">
                  사장님과 알바생이 함께 만드는<br />
                  따뜻하고 즐거운 근무지 관리 플랫폼
                </p>
                <div className="flex space-x-4">
                  <button className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <span className="text-blue-500 text-xl">💬</span>
                  </button>
                  <button className="w-12 h-12 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <span className="text-orange-500 text-xl">📷</span>
                  </button>
                  <button className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <span className="text-yellow-500 text-xl">📺</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800">사장님 서비스</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">근무지 관리</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">직원 관리</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">스케줄 관리</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">공지사항</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800">알바생 서비스</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-green-500 transition-colors">알바 후기</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-500 transition-colors">알바 꿀팁</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-500 transition-colors">권리 교육</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-500 transition-colors">급여 계산</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-blue-100 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500">© 2024 ROUND. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">이용약관</a>
                  <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">개인정보처리방침</a>
                  <a href="https://readdy.ai/?origin=logo" className="text-gray-500 hover:text-blue-500 transition-colors">Made with Readdy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return <div>Logged in content</div>;
}
