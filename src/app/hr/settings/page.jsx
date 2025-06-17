"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Smartphone,
  Globe,
  Palette,
  Building,
  Users,
  AlertTriangle,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('智能人才管理系统');
  const [language, setLanguage] = useState('zh');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState('all');
  
  // 新增状态
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLogout, setAutoLogout] = useState('30');

  return (
    <div className="p-6 space-y-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* 页面标题区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-3">系统设置</h1>
        <p className="text-blue-100 text-lg">管理您的系统偏好设置和配置</p>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-white border rounded-xl w-full justify-start p-1 h-14 shadow-sm">
          <TabsTrigger value="general" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-lg h-12 px-4">
            <Settings className="h-5 w-5" />
            基本设置
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-lg h-12 px-4">
            <Bell className="h-5 w-5" />
            通知设置
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-lg h-12 px-4">
            <Shield className="h-5 w-5" />
            安全设置
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-lg h-12 px-4">
            <Building className="h-5 w-5" />
            组织设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-blue-700">
                <Globe className="h-6 w-6 text-blue-600" />
                系统基本设置
              </CardTitle>
              <CardDescription>配置系统的基本参数和显示选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">系统名称</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="请输入系统名称"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">这将显示在浏览器标签和系统界面中</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">系统语言</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh">简体中文</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">选择系统界面显示的语言</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">界面主题</label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色主题</SelectItem>
                    <SelectItem value="dark">深色主题</SelectItem>
                    <SelectItem value="system">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">选择系统的显示主题</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-orange-700">
                <Bell className="h-6 w-6 text-orange-600" />
                通知设置
              </CardTitle>
              <CardDescription>管理系统的通知方式和频率</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">邮件通知</div>
                    <div className="text-xs text-gray-500">接收重要更新和提醒的邮件</div>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">推送通知</div>
                    <div className="text-xs text-gray-500">在浏览器中接收实时通知</div>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">周报告</div>
                    <div className="text-xs text-gray-500">每周接收系统使用情况报告</div>
                  </div>
                  <Switch 
                    checked={weeklyReport} 
                    onCheckedChange={setWeeklyReport}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-gray-700">通知优先级</label>
                <Select value={notifications} onValueChange={setNotifications}>
                  <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">接收所有通知</SelectItem>
                    <SelectItem value="important">仅接收重要通知</SelectItem>
                    <SelectItem value="none">关闭所有通知</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">设置接收通知的优先级</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-green-700">
                <Shield className="h-6 w-6 text-green-600" />
                安全设置
              </CardTitle>
              <CardDescription>管理系统的安全选项和访问控制</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">双因素认证</div>
                    <div className="text-xs text-gray-500">使用手机验证码进行双重认证</div>
                  </div>
                  <Switch 
                    checked={twoFactorAuth} 
                    onCheckedChange={setTwoFactorAuth}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">自动登出时间</label>
                  <Select value={autoLogout} onValueChange={setAutoLogout}>
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 分钟</SelectItem>
                      <SelectItem value="30">30 分钟</SelectItem>
                      <SelectItem value="60">1 小时</SelectItem>
                      <SelectItem value="never">从不</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">设置无操作自动登出的时间</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-purple-700">
                <Building className="h-6 w-6 text-purple-600" />
                组织设置
              </CardTitle>
              <CardDescription>管理您的公司或组织信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">公司名称</label>
                  <Input
                    placeholder="请输入公司名称"
                    defaultValue="示例科技有限公司"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">您的公司或组织的正式名称</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">公司规模</label>
                  <Select defaultValue="100-499">
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-49">1-49 人</SelectItem>
                      <SelectItem value="50-99">50-99 人</SelectItem>
                      <SelectItem value="100-499">100-499 人</SelectItem>
                      <SelectItem value="500+">500+ 人</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">选择您公司的规模范围</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">公司地址</label>
                <Input
                  placeholder="请输入公司地址"
                  defaultValue="北京市朝阳区xxx街道xxx号"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">公司的实际办公地址</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all hover:translate-y-[-2px]">
          <Save className="h-4 w-4" />
          保存所有设置
        </Button>
      </div>
    </div>
  );
} 