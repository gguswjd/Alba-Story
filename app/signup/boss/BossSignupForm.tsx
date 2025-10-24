'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BossSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ownerName: '',
    birthDate: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const sendVerificationCode = () => {
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: '전화번호를 입력해주세요.' }));
      return;
    }
    
    setVerificationSent(true);
    setShowPhoneVerification(true);
    console.log('인증번호 발송:', formData.phone);
  };

  const verifyPhone = () => {
    if (!formData.verificationCode) {
      setErrors(prev => ({ ...prev, verificationCode: '인증번호를 입력해주세요.' }));
      return;
    }
    
    setIsPhoneVerified(true);
    setShowPhoneVerification(false);
    console.log('전화번호 인증 완료');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerName) newErrors.ownerName = '이름을 입력해주세요.';
    if (!formData.birthDate) newErrors.birthDate = '생년월일을 입력해주세요.';
    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    if (!formData.phone) newErrors.phone = '전화번호를 입력해주세요.';
    if (!isPhoneVerified) newErrors.phone = '전화번호 인증을 완료해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자리 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('사장님 회원가입 데이터:', formData);
      router.push('/boss-dashboard');
    } catch (error) {
      setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' });
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

      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          placeholder="실명을 입력해주세요"
        />
        {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
      </div>

      {/* 생년월일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          생년월일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
        />
        {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
      </div>

      {/* 이메일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          placeholder="business@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* 전화번호 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          전화번호 <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            placeholder="010-1234-5678"
            disabled={isPhoneVerified}
          />
          {!isPhoneVerified && (
            <button
              type="button"
              onClick={sendVerificationCode}
              className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              {verificationSent ? '재전송' : '인증번호'}
            </button>
          )}
          {isPhoneVerified && (
            <div className="flex items-center px-4 py-3 bg-green-50 text-green-600 rounded-xl">
              <i className="ri-check-line text-lg"></i>
            </div>
          )}
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* 전화번호 인증 */}
      {showPhoneVerification && (
        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            인증번호 <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="인증번호 6자리"
              maxLength={6}
            />
            <button
              type="button"
              onClick={verifyPhone}
              className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              인증확인
            </button>
          </div>
          {errors.verificationCode && <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>}
          <p className="text-xs text-gray-500 mt-2">
            {formData.phone}로 인증번호를 발송했습니다.
          </p>
        </div>
      )}

      {/* 비밀번호 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            placeholder="8자리 이상의 비밀번호"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호 확인 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            placeholder="비밀번호를 다시 입력해주세요"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      {/* 가입하기 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium mt-6 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>가입 중...</span>
          </div>
        ) : (
          '사장님 회원가입 완료'
        )}
      </button>
    </form>
  );
}