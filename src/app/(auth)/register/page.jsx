'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 密码强度检查
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthText = ['', '弱', '中等', '较强', '强', '非常强'];
    return { score, text: strengthText[score] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 表单验证
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('请填写所有必填字段');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('密码长度至少为8位');
      setIsLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError('请设置更强的密码');
      setIsLoading(false);
      return;
    }

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: 这里添加实际的注册逻辑
      router.push('/login');
    } catch (err) {
      setError('注册失败，请稍后重试');
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
              创建账号
            </span>
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            请填写以下信息完成注册
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
              <Label htmlFor="name" className="text-sm font-medium">姓名</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-hover:text-blue-600" />
                <Input
                  id="name"
                  type="text"
                  placeholder="请输入姓名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
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
                  className="pl-10 transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">密码</Label>
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 4 ? 'bg-green-500' :
                          passwordStrength.score >= 3 ? 'bg-blue-500' :
                          passwordStrength.score >= 2 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{passwordStrength.text}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      {formData.password.length >= 8 ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <Info className="h-3 w-3 text-gray-400" />
                      )}
                      至少8个字符
                    </div>
                    <div className="flex items-center gap-1">
                      {/[A-Z]/.test(formData.password) ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <Info className="h-3 w-3 text-gray-400" />
                      )}
                      包含大写字母
                    </div>
                    <div className="flex items-center gap-1">
                      {/[0-9]/.test(formData.password) ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <Info className="h-3 w-3 text-gray-400" />
                      )}
                      包含数字
                    </div>
                    <div className="flex items-center gap-1">
                      {/[^A-Za-z0-9]/.test(formData.password) ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <Info className="h-3 w-3 text-gray-400" />
                      )}
                      包含特殊字符
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">确认密码</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-hover:text-blue-600" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`pl-10 transition-all border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }`}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500 hover:text-blue-600 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500 hover:text-blue-600 transition-colors" />
                  )}
                </Button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  两次输入的密码不一致
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  注册中...
                </div>
              ) : '注册'}
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
            已有账号？
            <Button
              variant="link"
              className="px-1 text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => router.push('/login')}
            >
              返回登录
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 