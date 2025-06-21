'use client';

import { useEffect, useState } from 'react';

export default function AuthLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.05)_25%,transparent_25%,transparent_50%,rgba(59,130,246,0.05)_50%,rgba(59,130,246,0.05)_75%,transparent_75%,transparent)] bg-[length:64px_64px] opacity-50 animate-[pulse_8s_ease-in-out_infinite]"></div>
      
      {/* 动态装饰圆形 */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute top-3/4 left-1/2 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl animate-[pulse_7s_ease-in-out_infinite]"></div>

      {/* 浮动粒子效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-500 rounded-full opacity-70 animate-float-slow"></div>
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-purple-500 rounded-full opacity-60 animate-float-medium"></div>
        <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-indigo-500 rounded-full opacity-70 animate-float-fast"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-500 rounded-full opacity-60 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-70 animate-float-medium"></div>
      </div>

      <div className={`container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
            {/* 左侧装饰图案 */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:128px_128px] opacity-20"></div>
            
            {/* 光效装饰 */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

            {/* 动态波浪效果 */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32">
              <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
                  fill="rgba(255,255,255,0.1)"
                />
              </svg>
              <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M0,256L48,261.3C96,267,192,277,288,277.3C384,277,480,267,576,240C672,213,768,171,864,170.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
                  fill="rgba(255,255,255,0.07)"
                />
              </svg>
            </div>
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium pt-10">
            <div className="mr-2 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">
              人才管理系统
            </span>
          </div>
          <div className="relative z-20 mt-24">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-white">
                优化人才管理 · 提升组织效能
              </h2>
              <p className="text-xl text-white/90 leading-relaxed max-w-md">
                科学的人才评估体系，高效的绩效管理流程，助力企业实现可持续发展。
              </p>
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="flex flex-col items-center p-6 rounded-xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105 hover:shadow-lg">
                  <span className="text-4xl font-bold text-white mb-2">500+</span>
                  <span className="text-sm text-white/80">企业用户</span>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105 hover:shadow-lg">
                  <span className="text-4xl font-bold text-white mb-2">98%</span>
                  <span className="text-sm text-white/80">客户满意度</span>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105 hover:shadow-lg">
                  <span className="text-4xl font-bold text-white mb-2">50%</span>
                  <span className="text-sm text-white/80">效率提升</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-20 mt-auto">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">© {new Date().getFullYear()} 人才管理系统</div>
            </div>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center min-h-screen">
          <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[300px] scale-90">
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