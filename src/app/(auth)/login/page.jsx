'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Phone, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="animate-fade-up">
      <Card className="w-full max-w-[400px] border-none shadow-2xl backdrop-blur-[8px] bg-white/90 relative overflow-hidden">
        {/* 装饰元素 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              欢迎回来
            </span>
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            请登录您的账号以继续
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 animate-shake">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">手机号码</Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-hover:text-blue-600" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号码"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  required
                  disabled={isLoading}
                  pattern="^1[3-9]\d{9}$"
                />
              </div>
              {formData.phone && !isValidPhone(formData.phone) && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  请输入有效的手机号码
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                <Button
                  variant="link"
                  className="px-0 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  onClick={() => router.push('/forgot-password')}
                >
                  忘记密码？
                </Button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-hover:text-blue-600" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
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
                    <EyeOff className="h-4 w-4 text-gray-500 hover:text-blue-600 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500 hover:text-blue-600 transition-colors" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  登录中...
                </div>
              ) : '登录'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8 pt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">或</span>
            </div>
          </div>
          <div className="text-sm text-center text-gray-500">
            还没有账号？
            <Button
              variant="link"
              className="px-1 text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => router.push('/register')}
            >
              立即注册
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 