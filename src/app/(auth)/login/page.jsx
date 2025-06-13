'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 简单的表单验证
    if (!formData.email || !formData.password) {
      setError('请填写所有必填字段');
      return;
    }
    
    try {
      // TODO: 这里添加实际的登录逻辑
      // 模拟登录成功
      router.push('/dashboard');
    } catch (err) {
      setError('登录失败，请检查您的邮箱和密码');
    }
  };

  return (
    <div className="animate-fade-up">
      <Card className="w-full max-w-[400px] border-none shadow-lg backdrop-blur-[2px] bg-white/90">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            欢迎回来
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            请登录您的账号以继续
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">邮箱</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-hover:text-blue-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                <Button
                  variant="link"
                  className="px-0 text-xs text-gray-500 hover:text-blue-600"
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
                  className="pl-10 transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            >
              登录
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