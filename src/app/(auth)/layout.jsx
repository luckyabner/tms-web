'use client';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.05)_25%,transparent_25%,transparent_50%,rgba(59,130,246,0.05)_50%,rgba(59,130,246,0.05)_75%,transparent_75%,transparent)] bg-[length:64px_64px] opacity-50 animate-[pulse_8s_ease-in-out_infinite]"></div>
      
      {/* 装饰圆形 */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute top-3/4 left-1/2 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl animate-[pulse_7s_ease-in-out_infinite]"></div>

      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
            {/* 左侧装饰图案 */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:128px_128px] opacity-20"></div>
            
            {/* 光效装饰 */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium pt-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-white font-semibold">
              人才管理系统
            </span>
          </div>
          <div className="relative z-20 mt-24">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                优化人才管理 · 提升组织效能
              </h2>
              <p className="text-lg text-white/90">
                科学的人才评估体系，高效的绩效管理流程，助力企业实现可持续发展。
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105">
                  <span className="text-3xl font-bold text-white">500+</span>
                  <span className="text-sm text-white/70">企业用户</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105">
                  <span className="text-3xl font-bold text-white">98%</span>
                  <span className="text-sm text-white/70">客户满意度</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105">
                  <span className="text-3xl font-bold text-white">50%</span>
                  <span className="text-sm text-white/70">效率提升</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} 人才管理系统 - 版权所有
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 