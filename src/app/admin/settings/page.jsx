'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Shield, 
  Bell, 
  Mail, 
  Database, 
  HardDrive, 
  Clock, 
  Globe, 
  Save,
  RefreshCw
} from 'lucide-react';

export default function AdminSettingsPage() {
  // 基本设置
  const [companyName, setCompanyName] = useState('智能人才管理系统');
  const [systemLogo, setSystemLogo] = useState('/logo.png');
  const [adminEmail, setAdminEmail] = useState('admin@company.com');
  const [language, setLanguage] = useState('zh-CN');
  const [timezone, setTimezone] = useState('Asia/Shanghai');
  
  // 安全设置
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90
  });
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  
  // 系统设置
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [logRetentionDays, setLogRetentionDays] = useState('90');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // 系统信息
  const systemInfo = {
    version: 'v1.0.0',
    lastUpdate: '2023-09-10',
    dbVersion: 'MySQL 8.0.28',
    serverOS: 'Ubuntu 22.04 LTS',
    phpVersion: 'PHP 8.1.2',
    nodeVersion: 'Node.js 16.14.0',
    uptime: '23天 5小时 17分钟'
  };
  
  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    // 在实际应用中，这里会保存设置到后端
    alert('设置已保存');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            系统设置
          </h1>
          <p className="text-muted-foreground">配置和管理系统全局设置</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Save className="h-4 w-4 mr-2" />
            保存所有设置
          </Button>
        </div>
      </div>

      {/* 设置选项卡 */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            基本设置
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            安全设置
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            通知设置
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-4 w-4 mr-2" />
            系统设置
          </TabsTrigger>
        </TabsList>

        {/* 基本设置 */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>配置系统的基本信息和显示选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">公司名称</Label>
                  <Input 
                    id="companyName" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">管理员邮箱</Label>
                  <Input 
                    id="adminEmail" 
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">系统语言</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue placeholder="选择时区" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                      <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">格林威治标准时间 (UTC+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">日本标准时间 (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systemLogo">系统Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    <img src={systemLogo} alt="Logo" className="max-w-full max-h-full" />
                  </div>
                  <Button variant="outline">上传新Logo</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>保存基本设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>配置系统的安全策略和访问控制</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">密码策略</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">最小密码长度</Label>
                    <Input 
                      id="minLength" 
                      type="number"
                      min="6"
                      max="20"
                      value={passwordPolicy.minLength}
                      onChange={(e) => setPasswordPolicy({...passwordPolicy, minLength: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDays">密码过期天数</Label>
                    <Input 
                      id="expiryDays" 
                      type="number"
                      min="0"
                      max="365"
                      value={passwordPolicy.expiryDays}
                      onChange={(e) => setPasswordPolicy({...passwordPolicy, expiryDays: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">设置为0表示密码永不过期</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="requireUppercase" 
                        checked={passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireUppercase: checked})}
                      />
                      <Label htmlFor="requireUppercase">要求大写字母</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="requireLowercase" 
                        checked={passwordPolicy.requireLowercase}
                        onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireLowercase: checked})}
                      />
                      <Label htmlFor="requireLowercase">要求小写字母</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="requireNumbers" 
                        checked={passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireNumbers: checked})}
                      />
                      <Label htmlFor="requireNumbers">要求数字</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="requireSpecialChars" 
                        checked={passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireSpecialChars: checked})}
                      />
                      <Label htmlFor="requireSpecialChars">要求特殊字符</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">登录安全</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">会话超时时间(分钟)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number"
                      min="5"
                      max="1440"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">最大登录尝试次数</Label>
                    <Input 
                      id="maxLoginAttempts" 
                      type="number"
                      min="3"
                      max="10"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    />
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
                    <p className="text-xs text-muted-foreground">要求用户使用手机验证码进行二次验证</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>保存安全设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>配置系统的通知和提醒方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">通知方式</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="emailNotifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                    <div>
                      <Label htmlFor="emailNotifications">电子邮件通知</Label>
                      <p className="text-xs text-muted-foreground">通过邮件发送重要系统通知</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="systemNotifications" 
                      checked={systemNotifications}
                      onCheckedChange={setSystemNotifications}
                    />
                    <div>
                      <Label htmlFor="systemNotifications">系统内部通知</Label>
                      <p className="text-xs text-muted-foreground">在系统界面显示通知提醒</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">通知事件</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="loginAlerts" 
                      checked={loginAlerts}
                      onCheckedChange={setLoginAlerts}
                    />
                    <div>
                      <Label htmlFor="loginAlerts">登录提醒</Label>
                      <p className="text-xs text-muted-foreground">当用户登录系统时发送通知</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="maintenanceAlerts" 
                      checked={maintenanceAlerts}
                      onCheckedChange={setMaintenanceAlerts}
                    />
                    <div>
                      <Label htmlFor="maintenanceAlerts">系统维护提醒</Label>
                      <p className="text-xs text-muted-foreground">系统维护前发送通知</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">邮件服务器设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP服务器</Label>
                    <Input id="smtpServer" defaultValue="smtp.company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP端口</Label>
                    <Input id="smtpPort" defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP用户名</Label>
                    <Input id="smtpUser" defaultValue="notifications@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP密码</Label>
                    <Input id="smtpPassword" type="password" defaultValue="********" />
                  </div>
                </div>
                <Button variant="outline">测试邮件服务器</Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>保存通知设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 系统设置 */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>系统设置</CardTitle>
              <CardDescription>配置系统的高级选项和维护功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">数据备份</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">备份频率</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择备份频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">每小时</SelectItem>
                        <SelectItem value="daily">每天</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupRetention">备份保留天数</Label>
                    <Input id="backupRetention" type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">立即备份</Button>
                  <Button variant="outline">查看备份历史</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">日志管理</h3>
                <div className="space-y-2">
                  <Label htmlFor="logRetentionDays">日志保留天数</Label>
                  <Input 
                    id="logRetentionDays" 
                    type="number"
                    min="7"
                    max="365"
                    value={logRetentionDays}
                    onChange={(e) => setLogRetentionDays(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">超过保留期限的日志将被自动清理</p>
                </div>
                <Button variant="outline">清理过期日志</Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">系统维护</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="maintenanceMode" 
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                    <div>
                      <Label htmlFor="maintenanceMode">维护模式</Label>
                      <p className="text-xs text-muted-foreground">启用后只有管理员可以访问系统</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="debugMode" 
                      checked={debugMode}
                      onCheckedChange={setDebugMode}
                    />
                    <div>
                      <Label htmlFor="debugMode">调试模式</Label>
                      <p className="text-xs text-muted-foreground">显示详细的错误信息和调试数据</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">清除缓存</Button>
                  <Button variant="outline" className="text-red-600">重置系统</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">系统信息</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">系统版本:</div>
                    <div className="text-sm font-medium">{systemInfo.version}</div>
                    
                    <div className="text-sm text-muted-foreground">最后更新:</div>
                    <div className="text-sm">{systemInfo.lastUpdate}</div>
                    
                    <div className="text-sm text-muted-foreground">数据库版本:</div>
                    <div className="text-sm">{systemInfo.dbVersion}</div>
                    
                    <div className="text-sm text-muted-foreground">服务器系统:</div>
                    <div className="text-sm">{systemInfo.serverOS}</div>
                    
                    <div className="text-sm text-muted-foreground">PHP版本:</div>
                    <div className="text-sm">{systemInfo.phpVersion}</div>
                    
                    <div className="text-sm text-muted-foreground">Node.js版本:</div>
                    <div className="text-sm">{systemInfo.nodeVersion}</div>
                    
                    <div className="text-sm text-muted-foreground">系统运行时间:</div>
                    <div className="text-sm">{systemInfo.uptime}</div>
                  </div>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新系统信息
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>保存系统设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 