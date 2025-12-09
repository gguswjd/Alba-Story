'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginResponse = {
  accessToken?: string;
  token?: string;
  access_token?: string;
  user?: {
    id: number;
    name?: string;
    email?: string;
    role?: string;
  };
  // 필요하면 refreshToken 등 추가
};

export default function EmployeeLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = '이메일을 입력해주세요.';
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
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 서버가 쿠키 기반 세션/리프레시 쿠키를 쓴다면 필요
        body: JSON.stringify({
          // 백엔드가 email/identifier 중 어떤 키를 받는지 맞춰주세요.
          email: formData.identifier.trim(),
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message =
          (err?.message && (Array.isArray(err.message) ? err.message[0] : err.message)) ||
          '로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.';
        setErrors({ general: message });
        return;
      }

      const data: LoginResponse = await res.json();
      console.log('[Employee Login] response = ', data);

      const accessToken =
        data?.accessToken ?? data?.token ?? data?.access_token;

      if (!accessToken) {
        setErrors({
          general:
            '로그인은 성공했지만 accessToken이 응답에 없습니다. 서버 응답 키를 확인하세요.',
        });
        return;
      }

      // rememberMe에 따라 저장소 분기 (Boss 코드는 localStorage 고정이었지만 여기선 개선)
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', accessToken);

      if (data?.user) {
        storage.setItem('me', JSON.stringify(data.user));
      }

      // 로그인 성공 후 라우팅
      router.replace('/employee-dashboard');
    } catch (error) {
      console.error(error);
      setErrors({
        general: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

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
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
              errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="아이디 또는 이메일을 입력하세요"
            autoComplete="username"
          />
        </div>
        {errors.identifier && (
          <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
        )}
      </div>

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
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
          >
            <i className={`${showPassword ? 'ri-eye-line' : 'ri-eye-off-line'} text-gray-400 hover:text-gray-600`}></i>
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="ml-2 text-sm text-gray-700">로그인 상태 유지</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>로그인 중...</span>
          </div>
        ) : (
          '알바생 로그인'
        )}
      </button>
    </form>
  );
}
