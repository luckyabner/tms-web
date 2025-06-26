'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Phone, Lock, AlertCircle, UserCircle2, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
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
    setError('');
    setIsLoading(true);
    
    // 简单的表单验证
    if (!formData.phone || !formData.password) {
      setError('请填写所有必填字段');
      setIsLoading(false);
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError('请输入有效的手机号码');
      setIsLoading(false);
      return;
    }
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: 这里添加实际的登录逻辑
      router.push('/hr/dashboard');
    } catch (err) {
      setError('登录失败，请检查您的手机号和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`transition-all duration-700 ease-out ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-8 flex flex-col items-center justify-center space-y-4 mt-4">
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-70 blur-sm animate-pulse"></div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl">
            <UserCircle2 className="h-10 w-10 text-white drop-shadow-md" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">人才管理系统</h1>
        <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mt-1"></div>
      </div>
      
      <Card className="w-full max-w-[380px] border-none shadow-2xl backdrop-blur-[12px] bg-white/95 dark:bg-gray-900/80 relative overflow-hidden rounded-xl py-6">
        {/* 装饰元素 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-600/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

        <CardHeader className="space-y-3 pb-4 pt-2">
          <div className="space-y-3 text-center">
            <CardTitle className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                欢迎回来
              </span>
            </CardTitle>
            <CardDescription className="text-gray-500 max-w-xs mx-auto text-sm">
              请登录您的账号以继续使用系统，享受高效的人才管理体验
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-100 shadow-sm animate-pulse">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-xs font-medium flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-gray-500" />
                手机号码
              </Label>
              <div className="relative group">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号码"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-4 h-12 rounded-lg text-sm transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:bg-gray-800/50 dark:border-gray-700 dark:focus:border-blue-500"
                  required
                  disabled={isLoading}
                  pattern="^1[3-9]\d{9}$"
                />
                {formData.phone && isValidPhone(formData.phone) && (
                  <CheckCircle2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-green-500 transition-opacity" />
                )}
              </div>
              {formData.phone && !isValidPhone(formData.phone) && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1 pl-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  请输入有效的11位手机号码
                </p>
              )}
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-gray-500" />
                  密码
                </Label>
                <Button
                  variant="link"
                  className="px-0 text-xs text-blue-600 hover:text-blue-700 transition-colors h-auto py-0"
                  onClick={() => router.push('/forgot-password')}
                >
                  忘记密码？
                </Button>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-4 h-12 rounded-lg text-sm transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:bg-gray-800/50 dark:border-gray-700 dark:focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5 text-gray-500 hover:text-blue-600 transition-colors" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-gray-500 hover:text-blue-600 transition-colors" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className={`w-full h-12 mt-4 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg text-sm font-medium ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>登录中...</span>
                </div>
              ) : '登录系统'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pb-4 pt-2">
          <div className="text-xs text-center text-gray-500 mt-2">
            登录即表示您同意我们的
            <Button
              variant="link"
              className="px-1 text-xs text-blue-600 hover:text-blue-700 h-auto py-0"
              onClick={() => {}}
            >
              服务条款
            </Button>
            和
            <Button
              variant="link"
              className="px-1 text-xs text-blue-600 hover:text-blue-700 h-auto py-0"
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