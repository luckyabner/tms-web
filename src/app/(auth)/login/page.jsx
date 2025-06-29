"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/services/authService";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Phone,
  UserCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // 添加动画效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 验证手机号格式
  const isValidPhone = (phone) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 简单的表单验证
    if (!formData.phone || !formData.password) {
      setError("请填写所有必填字段");
      setIsLoading(false);
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError("请输入有效的手机号码");
      setIsLoading(false);
      return;
    }

    try {
      const res = await login(formData.phone, formData.password);
      console.log("登录成功:", res);
      router.push("/");
    } catch (err) {
      setError("登录失败，请检查您的手机号和密码");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`transition-all duration-700 ease-out ${animationComplete ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="mt-4 mb-8 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute -inset-0.5 animate-pulse rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-70 blur-sm"></div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl">
            <UserCircle2 className="h-10 w-10 text-white drop-shadow-md" />
          </div>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent drop-shadow-sm">
          人才管理系统
        </h1>
        <div className="mt-1 h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
      </div>

      <Card className="relative w-full max-w-[380px] overflow-hidden rounded-xl border-none bg-white/95 py-6 shadow-2xl backdrop-blur-[12px] dark:bg-gray-900/80">
        {/* 装饰元素 */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        <div className="absolute top-0 right-0 h-40 w-40 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-gradient-to-tr from-purple-600/20 to-transparent blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-1/2 translate-y-1/2 transform rounded-full bg-gradient-to-tl from-indigo-600/20 to-transparent blur-3xl"></div>

        <CardHeader className="space-y-3 pt-2 pb-4">
          <div className="space-y-3 text-center">
            <CardTitle className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                欢迎回来
              </span>
            </CardTitle>
            <CardDescription className="mx-auto max-w-xs text-sm text-gray-500">
              请登录您的账号以继续使用系统，享受高效的人才管理体验
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex animate-pulse items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600 shadow-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2.5">
              <Label
                htmlFor="phone"
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <Phone className="h-3 w-3 text-gray-500" />
                手机号码
              </Label>
              <div className="group relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号码"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-12 rounded-lg border-gray-200 pl-4 text-sm transition-all hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-blue-500"
                  required
                  disabled={isLoading}
                  pattern="^1[3-9]\d{9}$"
                />
                {formData.phone && isValidPhone(formData.phone) && (
                  <CheckCircle2 className="absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-green-500 transition-opacity" />
                )}
              </div>
              {formData.phone && !isValidPhone(formData.phone) && (
                <p className="mt-1 flex items-center gap-1 pl-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  请输入有效的11位手机号码
                </p>
              )}
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-1.5 text-xs font-medium"
                >
                  <Lock className="h-3 w-3 text-gray-500" />
                  密码
                </Label>
                <Button
                  variant="link"
                  className="h-auto px-0 py-0 text-xs text-blue-600 transition-colors hover:text-blue-700"
                  onClick={() => router.push("/forgot-password")}
                >
                  忘记密码？
                </Button>
              </div>
              <div className="group relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-12 rounded-lg border-gray-200 pl-4 text-sm transition-all hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5 text-gray-500 transition-colors hover:text-blue-600" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-gray-500 transition-colors hover:text-blue-600" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className={`mt-4 h-12 w-full transform rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-lg active:scale-[0.98] ${isLoading ? "cursor-not-allowed opacity-90" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>登录中...</span>
                </div>
              ) : (
                "登录系统"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pt-2 pb-4">
          <div className="mt-2 text-center text-xs text-gray-500">
            登录即表示您同意我们的
            <Button
              variant="link"
              className="h-auto px-1 py-0 text-xs text-blue-600 hover:text-blue-700"
              onClick={() => {}}
            >
              服务条款
            </Button>
            和
            <Button
              variant="link"
              className="h-auto px-1 py-0 text-xs text-blue-600 hover:text-blue-700"
              onClick={() => {}}
            >
              隐私政策
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
