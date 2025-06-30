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
import { useAuth } from "@/hooks/auth";
import { useNextAuth } from "@/hooks/useNextAuth";
import { loginServer } from "@/lib/services/authService";
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
  const { login } = useNextAuth();
  const { setUserInfo } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const isValidPhone = (phone) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
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
      const res = await loginServer(formData.phone, formData.password);
      if (res.token) {
        const loginData = {
          token: res.token,
          empId: res.empId,
          name: res.name,
          phone: res.phone,
          empType: res.empType,
        };
        setUserInfo(loginData);
        await login(loginData);
        router.push("/");
      }
    } catch (err) {
      setError("登录失败，请检查您的手机号和密码");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-muted/50 flex min-h-screen items-center justify-center transition-opacity duration-700 ${animationComplete ? "opacity-100" : "opacity-0"}`}
    >
      <Card className="bg-background w-full max-w-md border shadow-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mb-2 flex justify-center">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
              <UserCircle2 className="text-primary h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
            登录账号
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            欢迎使用人才管理系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border p-2 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="flex items-center gap-1 text-xs font-medium"
              >
                <Phone className="text-muted-foreground h-3 w-3" /> 手机号码
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号码"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-11 text-sm"
                  required
                  disabled={isLoading}
                  pattern="^1[3-9]\d{9}$"
                />
                {formData.phone && isValidPhone(formData.phone) && (
                  <CheckCircle2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {formData.phone && !isValidPhone(formData.phone) && (
                <p className="text-destructive mt-1 flex items-center gap-1 pl-1 text-xs">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />{" "}
                  请输入有效的11位手机号码
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-1 text-xs font-medium"
                >
                  <Lock className="text-muted-foreground h-3 w-3" /> 密码
                </Label>
                <Button
                  variant="link"
                  className="text-primary h-auto px-0 py-0 text-xs"
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                >
                  忘记密码？
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-11 text-sm"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-2 h-11 w-full text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="border-primary/30 border-t-primary h-4 w-4 animate-spin rounded-full border-2"></div>
                  <span>登录中...</span>
                </div>
              ) : (
                "登录系统"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pt-2">
          <div className="text-muted-foreground text-center text-xs">
            登录即表示您同意我们的
            <Button
              variant="link"
              className="text-primary h-auto px-1 py-0 text-xs"
              type="button"
            >
              服务条款
            </Button>
            和
            <Button
              variant="link"
              className="text-primary h-auto px-1 py-0 text-xs"
              type="button"
            >
              隐私政策
            </Button>
          </div>
          <div className="text-muted-foreground mt-2 text-center text-xs">
            © {new Date().getFullYear()} 人才管理系统 - 版权所有
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
