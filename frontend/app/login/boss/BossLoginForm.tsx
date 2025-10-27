'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginResponse = {
  accessToken: string;
  user: {
    id: number;
    name?: string;
    email?: string;
    role?: string;
  };
  // 필요하면 refreshToken 등 추가
};

const setCookie = (name: string, value: string, maxAgeSec?: number) => {
  const attrs = [
    `Path=/`,
    `SameSite=Lax`,
    // 개발환경(http)에서는 Secure를 붙이지 않음
    ...(typeof window !== 'undefined' && location.protocol === 'https:' ? ['Secure'] : []),
  ];
  if (maxAgeSec) attrs.push(`Max-Age=${maxAgeSec}`);
  document.cookie = `${name}=${encodeURIComponent(value)}; ${attrs.join('; ')}`;
};

export default function BossLoginForm() {
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
      newErrors.identifier = '사업자 등록번호 또는 이메일을 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setCookie = (name: string, value: string, maxAgeSec?: number) => {
    const attrs = [
      `Path=/`,
      `SameSite=Lax`,
      // 개발환경(http)에서는 Secure를 붙이지 않음
      ...(typeof window !== 'undefined' && location.protocol === 'https:' ? ['Secure'] : []),
    ];
    if (maxAgeSec) attrs.push(`Max-Age=${maxAgeSec}`);
    document.cookie = `${name}=${encodeURIComponent(value)}; ${attrs.join('; ')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
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
      console.log('[Login] response = ', data);

      const accessToken =
        (data as any)?.accessToken ??
        (data as any)?.token ??
        (data as any)?.access_token;

      if (!accessToken) {
        setErrors({ general: '로그인은 성공했지만 accessToken이 응답에 없습니다. 서버 응답 키를 확인하세요.' });
        setIsLoading(false);
        return;
      }

      localStorage.setItem('accessToken', accessToken);

      // 2) 유저 정보도 캐싱해두면 대시보드 첫 렌더에서 깜빡임 ↓
      if (data?.user) {
        localStorage.setItem('me', JSON.stringify(data.user));
      }

      // 3) 라우팅
      router.replace('/boss-dashboard');
    } catch (error) {
      console.error(error);
      setErrors({ general: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
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
          사업자 등록번호 또는 이메일
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="ri-building-line text-gray-400"></i>
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
            placeholder="123-45-67890 또는 boss@example.com"
            autoComplete="username"
          />
        </div>
        {errors.identifier && <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>}
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
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
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
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

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
        {/* 필요 시: 비밀번호 찾기 링크 */}
        {/* <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">비밀번호 찾기</a> */}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>로그인 중...</span>
          </div>
        ) : (
          '사장님 로그인'
        )}
      </button>
    </form>
  );
}
