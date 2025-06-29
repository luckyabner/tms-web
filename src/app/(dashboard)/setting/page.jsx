"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle2,
  Clock,
  Database,
  Globe,
  Palette,
  RefreshCw,
  Save,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  // 基本设置
  const [companyName, setCompanyName] = useState("智能人才管理系统");
  const [systemLogo, setSystemLogo] = useState("/logo.png");
  const [adminEmail, setAdminEmail] = useState("admin@company.com");
  const [language, setLanguage] = useState("zh-CN");
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [theme, setTheme] = useState("light");

  // 安全设置
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);

  // 系统设置
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [logRetentionDays, setLogRetentionDays] = useState("90");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // 系统信息
  const systemInfo = {
    version: "v1.0.0",
    lastUpdate: "2023-09-10",
    dbVersion: "MySQL 8.0.28",
    nodeVersion: "Node.js 16.14.0",
    uptime: "23天 5小时 17分钟",
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    // 在实际应用中，这里会保存设置到后端
    alert("设置已保存");
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 页面标题 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
            系统设置
          </h1>
          <p className="text-muted-foreground mt-1">配置和管理系统全局设置</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md hover:from-purple-700 hover:to-indigo-700">
          <Save className="mr-2 h-4 w-4" />
          保存所有设置
        </Button>
      </div>

      {/* 设置选项卡 */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="mb-4 grid grid-cols-4 bg-gray-100/80 md:w-[500px]">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Settings className="mr-2 h-4 w-4" />
            基本设置
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Shield className="mr-2 h-4 w-4" />
            安全设置
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Bell className="mr-2 h-4 w-4" />
            通知设置
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Database className="mr-2 h-4 w-4" />
            系统信息
          </TabsTrigger>
        </TabsList>

        {/* 基本设置 */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Globe className="mr-2 h-5 w-5 text-purple-500" />
                  系统基本信息
                </CardTitle>
                <CardDescription>配置系统的基本信息和显示选项</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">公司名称</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">管理员邮箱</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemLogo">系统Logo</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={systemLogo}
                        alt="Logo"
                        className="max-h-full max-w-full"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200"
                    >
                      上传新Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Palette className="mr-2 h-5 w-5 text-purple-500" />
                  界面设置
                </CardTitle>
                <CardDescription>配置系统的界面和显示选项</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="language">系统语言</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="选择语言" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">中文 (简体)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="ja-JP">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">时区设置</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="选择时区" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">
                        中国标准时间 (UTC+8)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        美国东部时间 (UTC-5)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        格林威治标准时间 (UTC+0)
                      </SelectItem>
                      <SelectItem value="Asia/Tokyo">
                        日本标准时间 (UTC+9)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">界面主题</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="选择主题" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">浅色主题</SelectItem>
                      <SelectItem value="dark">深色主题</SelectItem>
                      <SelectItem value="system">跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Shield className="mr-2 h-5 w-5 text-purple-500" />
                安全设置
              </CardTitle>
              <CardDescription>配置系统的安全策略和访问控制</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="flex items-center text-base font-medium">
                    <User className="mr-2 h-4 w-4 text-purple-500" />
                    密码策略
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">最小密码长度</Label>
                      <div className="flex items-center">
                        <Input
                          id="passwordMinLength"
                          type="number"
                          min="6"
                          max="20"
                          value={passwordMinLength}
                          onChange={(e) => setPasswordMinLength(e.target.value)}
                          className="w-24 border-gray-200"
                        />
                        <span className="text-muted-foreground ml-2 text-sm">
                          字符
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="requireComplexPassword" checked={true} />
                      <div>
                        <Label htmlFor="requireComplexPassword">
                          要求密码复杂度
                        </Label>
                        <p className="text-muted-foreground text-xs">
                          包含大小写字母、数字和特殊字符
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center text-base font-medium">
                    <Clock className="mr-2 h-4 w-4 text-purple-500" />
                    登录安全
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">会话超时时间</Label>
                      <div className="flex items-center">
                        <Input
                          id="sessionTimeout"
                          type="number"
                          min="5"
                          max="1440"
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(e.target.value)}
                          className="w-24 border-gray-200"
                        />
                        <span className="text-muted-foreground ml-2 text-sm">
                          分钟
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="twoFactorAuth"
                        checked={twoFactorAuth}
                        onCheckedChange={setTwoFactorAuth}
                      />
                      <div>
                        <Label htmlFor="twoFactorAuth">启用双因素认证</Label>
                        <p className="text-muted-foreground text-xs">
                          要求用户使用手机验证码进行二次验证
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                保存安全设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Bell className="mr-2 h-5 w-5 text-purple-500" />
                通知设置
              </CardTitle>
              <CardDescription>配置系统的通知和提醒方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">通知方式</h3>
                  <div className="space-y-4 rounded-md bg-gray-50 p-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emailNotifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                      <div>
                        <Label htmlFor="emailNotifications">电子邮件通知</Label>
                        <p className="text-muted-foreground text-xs">
                          通过邮件发送重要系统通知
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="systemNotifications"
                        checked={systemNotifications}
                        onCheckedChange={setSystemNotifications}
                      />
                      <div>
                        <Label htmlFor="systemNotifications">
                          系统内部通知
                        </Label>
                        <p className="text-muted-foreground text-xs">
                          在系统界面显示通知提醒
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium">通知事件</h3>
                  <div className="space-y-4 rounded-md bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loginNotify">登录提醒</Label>
                      <Switch id="loginNotify" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordChangeNotify">密码变更提醒</Label>
                      <Switch id="passwordChangeNotify" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemUpdateNotify">系统更新提醒</Label>
                      <Switch id="systemUpdateNotify" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                保存通知设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 系统信息 */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Database className="mr-2 h-5 w-5 text-purple-500" />
                  系统信息
                </CardTitle>
                <CardDescription>查看系统运行状态和版本信息</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 rounded-md bg-gray-50 p-4">
                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <span className="text-muted-foreground text-sm">
                      系统版本
                    </span>
                    <Badge
                      variant="outline"
                      className="border-purple-200 bg-purple-50 text-purple-700"
                    >
                      {systemInfo.version}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <span className="text-muted-foreground text-sm">
                      最后更新
                    </span>
                    <span className="text-sm font-medium">
                      {systemInfo.lastUpdate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <span className="text-muted-foreground text-sm">
                      数据库版本
                    </span>
                    <span className="text-sm font-medium">
                      {systemInfo.dbVersion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <span className="text-muted-foreground text-sm">
                      Node.js版本
                    </span>
                    <span className="text-sm font-medium">
                      {systemInfo.nodeVersion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground text-sm">
                      系统运行时间
                    </span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {systemInfo.uptime}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Button variant="outline" size="sm" className="border-gray-200">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  刷新系统信息
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Settings className="mr-2 h-5 w-5 text-purple-500" />
                  系统维护
                </CardTitle>
                <CardDescription>系统维护和备份设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">备份频率</Label>
                  <Select
                    value={backupFrequency}
                    onValueChange={setBackupFrequency}
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="选择备份频率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                      <SelectItem value="manual">手动备份</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logRetentionDays">日志保留天数</Label>
                  <div className="flex items-center">
                    <Input
                      id="logRetentionDays"
                      type="number"
                      min="7"
                      max="365"
                      value={logRetentionDays}
                      onChange={(e) => setLogRetentionDays(e.target.value)}
                      className="w-24 border-gray-200"
                    />
                    <span className="text-muted-foreground ml-2 text-sm">
                      天
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                  <div>
                    <Label htmlFor="maintenanceMode">维护模式</Label>
                    <p className="text-muted-foreground text-xs">
                      启用后只有管理员可以访问系统
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200"
                  >
                    立即备份
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200"
                  >
                    清除缓存
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
