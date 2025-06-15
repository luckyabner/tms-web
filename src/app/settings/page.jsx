"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertTriangle
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 页面标题区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold mb-2">系统设置</h1>
        <p className="text-blue-100">管理您的系统偏好设置和配置</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border rounded-lg w-full justify-start p-1 h-12">
          <TabsTrigger value="general" className="flex items-center gap-2 data-[state=active]:bg-gray-100">
            <Settings className="h-4 w-4" />
            基本设置
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-gray-100">
            <Bell className="h-4 w-4" />
            通知设置
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-gray-100">
            <Shield className="h-4 w-4" />
            安全设置
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2 data-[state=active]:bg-gray-100">
            <Building className="h-4 w-4" />
            组织设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                系统基本设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">系统名称</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="请输入系统名称"
                  />
                  <p className="text-xs text-gray-500">这将显示在浏览器标签和系统界面中</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">系统语言</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh">简体中文</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">选择系统界面显示的语言</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">界面主题</label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色主题</SelectItem>
                    <SelectItem value="dark">深色主题</SelectItem>
                    <SelectItem value="system">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">选择系统的显示主题</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                通知设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">邮件通知</div>
                    <div className="text-xs text-gray-500">接收重要更新和提醒的邮件</div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">推送通知</div>
                    <div className="text-xs text-gray-500">在浏览器中接收实时通知</div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">周报告</div>
                    <div className="text-xs text-gray-500">每周接收系统使用情况报告</div>
                  </div>
                  <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium">通知优先级</label>
                <Select value={notifications} onValueChange={setNotifications}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">接收所有通知</SelectItem>
                    <SelectItem value="important">仅接收重要通知</SelectItem>
                    <SelectItem value="none">关闭所有通知</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">设置接收通知的优先级</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                安全设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">双因素认证</div>
                    <div className="text-xs text-gray-500">使用手机验证码进行双重认证</div>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">自动登出时间</label>
                  <Select value={autoLogout} onValueChange={setAutoLogout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 分钟</SelectItem>
                      <SelectItem value="30">30 分钟</SelectItem>
                      <SelectItem value="60">1 小时</SelectItem>
                      <SelectItem value="never">从不</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">设置无操作自动登出的时间</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-500" />
                组织设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">公司名称</label>
                  <Input
                    placeholder="请输入公司名称"
                    defaultValue="示例科技有限公司"
                  />
                  <p className="text-xs text-gray-500">您的公司或组织的正式名称</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">公司规模</label>
                  <Select defaultValue="100-499">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-49">1-49 人</SelectItem>
                      <SelectItem value="50-99">50-99 人</SelectItem>
                      <SelectItem value="100-499">100-499 人</SelectItem>
                      <SelectItem value="500+">500+ 人</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">选择您公司的规模范围</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">公司地址</label>
                <Input
                  placeholder="请输入公司地址"
                  defaultValue="北京市朝阳区xxx街道xxx号"
                />
                <p className="text-xs text-gray-500">公司的实际办公地址</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          保存所有设置
        </Button>
      </div>
    </div>
  );
} 