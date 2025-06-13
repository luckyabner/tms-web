'use client';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* 简化背景装饰 */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.05)_25%,transparent_25%,transparent_50%,rgba(59,130,246,0.05)_50%,rgba(59,130,246,0.05)_75%,transparent_75%,transparent)] bg-[length:64px_64px] opacity-50"></div>

      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700">
            {/* 简化左侧装饰图案 */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:128px_128px] opacity-20"></div>
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
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
          <div className="relative z-20 mt-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                优化人才管理 · 提升组织效能
              </h2>
              <p className="text-lg text-white/90">
                科学的人才评估体系，高效的绩效管理流程，助力企业实现可持续发展。
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10">
                  <span className="text-3xl font-bold text-white">500+</span>
                  <span className="text-sm text-white/70">企业用户</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10">
                  <span className="text-3xl font-bold text-white">98%</span>
                  <span className="text-sm text-white/70">客户满意度</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10">
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
          </div>
        </div>
      </div>
    </div>
  );
} 