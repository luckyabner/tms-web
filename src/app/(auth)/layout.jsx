export default function AuthLayout({ children }) {
  return (
    <div className="bg-muted/50 dark:bg-background flex min-h-screen">
      {/* 左侧宣传栏（大屏显示） */}
      <div className="bg-primary/90 relative hidden w-1/2 flex-col justify-center items-center p-12 text-white lg:flex">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
            </div>
            <span className="ml-3 text-2xl font-bold tracking-tight">
              人才管理系统
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-center">
            优化人才管理 · 提升组织效能
          </h2>
          <p className="mb-10 max-w-md text-lg text-white/90 text-center">
            科学的人才评估体系，高效的绩效管理流程，助力企业实现可持续发展。
          </p>
          <div className="grid max-w-md grid-cols-3 gap-4">
            <div className="flex flex-col items-center rounded-lg bg-white/10 p-5">
              <span className="mb-1 text-3xl font-bold">500+</span>
              <span className="text-xs text-white/80">企业用户</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white/10 p-5">
              <span className="mb-1 text-3xl font-bold">98%</span>
              <span className="text-xs text-white/80">客户满意度</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white/10 p-5">
              <span className="mb-1 text-3xl font-bold">50%</span>
              <span className="text-xs text-white/80">效率提升</span>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm text-white/70 text-center absolute bottom-12">
          © {new Date().getFullYear()} 人才管理系统
        </div>
      </div>
      {/* 右侧登录内容 */}
      <div className="flex flex-1 items-center justify-center p-4 lg:p-0">
        <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
