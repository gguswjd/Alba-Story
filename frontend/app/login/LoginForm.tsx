
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    identifier: '', // 아이디 또는 이메일
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = '아이디 또는 이메일을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // 실제 로그인 로직 구현 필요
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 로그인 성공 시 메인 페이지로 이동
      router.push('/');
    } catch (error) {
      setErrors({ general: '로그인에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      {/* 아이디/이메일 */}
      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
          아이디 또는 이메일
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="ri-user-line text-gray-400"></i>
          </div>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
              errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="아이디 또는 이메일을 입력하세요"
          />
        </div>
        {errors.identifier && (
          <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
        )}
      </div>

      {/* 비밀번호 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="ri-lock-line text-gray-400"></i>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="비밀번호를 입력하세요"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          >
            <i className={`${showPassword ? 'ri-eye-line' : 'ri-eye-off-line'} text-gray-400 hover:text-gray-600`}></i>
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* 로그인 상태 유지 */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">로그인 상태 유지</span>
        </label>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>로그인 중...</span>
          </div>
        ) : (
          '로그인'
        )}
      </button>
    </form>
  );
}
