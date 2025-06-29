import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Cake,
  CalendarDays,
  Clock,
  GraduationCap,
  Phone,
  User,
} from "lucide-react";

export default function EmployeeDetail({ employee }) {
  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 计算年龄
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // 计算工龄
  const calculateWorkYears = (hireDate) => {
    const years = new Date().getFullYear() - new Date(hireDate).getFullYear();
    return years;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          基本信息
        </CardTitle>
        <CardDescription>员工的基础个人信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 头像占位 */}
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
            {employee.name.charAt(0)}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold">{employee.name}</h3>
          <p className="text-muted-foreground">{employee.position}</p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">性别: {employee.gender}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{employee.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Cake className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              {calculateAge(employee.birthDate)}岁
            </span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              {employee.education} · {employee.school}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              入职: {formatDate(employee.hireDate)} (
              {calculateWorkYears(employee.hireDate)}年)
            </span>
          </div>
        </div>

        {employee.description && (
          <>
            <Separator />
            <div>
              <h4 className="mb-2 text-sm font-medium">个人描述</h4>
              <p className="text-muted-foreground text-sm">
                {employee.description}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
