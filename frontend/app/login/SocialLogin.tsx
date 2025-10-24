
'use client';

export default function SocialLogin() {
  const handleSocialLogin = (provider: string) => {
    // 실제 소셜 로그인 로직 구현 필요
    console.log(`${provider} 로그인 시도`);
  };

  const socialProviders = [
    {
      name: 'google',
      label: 'Google로 로그인',
      icon: 'ri-google-fill',
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      hoverBg: 'hover:bg-gray-50'
    },
    {
      name: 'kakao',
      label: '카카오로 로그인',
      icon: 'ri-kakao-talk-fill',
      bgColor: 'bg-yellow-400',
      textColor: 'text-black',
      borderColor: 'border-yellow-400',
      hoverBg: 'hover:bg-yellow-500'
    },
    {
      name: 'naver',
      label: '네이버로 로그인',
      icon: 'ri-naver-line',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-500',
      hoverBg: 'hover:bg-green-600'
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-gray-600 font-medium mb-4">
        소셜 계정으로 간편 로그인
      </p>
      
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          onClick={() => handleSocialLogin(provider.name)}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl border transition-all font-medium whitespace-nowrap cursor-pointer ${provider.bgColor} ${provider.textColor} ${provider.borderColor} ${provider.hoverBg}`}
        >
          <i className={`${provider.icon} text-lg`}></i>
          <span>{provider.label}</span>
        </button>
      ))}
    </div>
  );
}
