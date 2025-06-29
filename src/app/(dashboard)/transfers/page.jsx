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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  approveTransfer,
  getAllTransfers,
} from "@/lib/services/employeeService";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Loader2,
  Search,
  User,
  UserCog,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [processingAction, setProcessingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedTransfers, setPaginatedTransfers] = useState([]);

  useEffect(() => {
    fetchTransfers();
  }, []);

  useEffect(() => {
    filterTransfers();
  }, [transfers, searchTerm, statusFilter]);

  useEffect(() => {
    // 当过滤后的数据或分页参数变化时，更新分页数据
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedTransfers(filteredTransfers.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredTransfers.length / itemsPerPage));
  }, [filteredTransfers, currentPage, itemsPerPage]);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const data = await getAllTransfers();
      setTransfers(data);
      setFilteredTransfers(data);
    } catch (error) {
      console.error("获取人事调动申请失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransfers = () => {
    if (!transfers || !transfers.length) {
      setFilteredTransfers([]);
      return;
    }

    let filtered = [...transfers];

    // 应用搜索过滤
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (transfer) =>
          transfer.employeeName?.toLowerCase().includes(lowerSearchTerm) ||
          transfer.departmentName?.toLowerCase().includes(lowerSearchTerm) ||
          transfer.currentDepartment?.toLowerCase().includes(lowerSearchTerm) ||
          transfer.position?.toLowerCase().includes(lowerSearchTerm) ||
          transfer.description?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 应用状态过滤
    if (statusFilter !== "all") {
      filtered = filtered.filter((transfer) => transfer.state === statusFilter);
    }

    setFilteredTransfers(filtered);
    // 重置为第一页
    setCurrentPage(1);
  };

  const handleApprove = async () => {
    if (!selectedTransfer) return;

    setProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      // 构建审批数据
      const approvalData = {
        state: "已通过",
        approverId: 2, // 假设当前登录的人事专员ID为2
        description: approvalReason || selectedTransfer.description,
        isCurrent: 1, // 设置为当前部门
        position: selectedTransfer.position, // 确保包含职位信息
        depId: selectedTransfer.depId, // 确保包含部门ID
        superiorId: selectedTransfer.superiorId, // 确保包含上级ID
      };

      console.log("发送审批通过数据:", approvalData);

      // 发送审批请求
      await approveTransfer(selectedTransfer.id, approvalData);

      // 更新本地数据
      const updatedTransfers = transfers.map((transfer) =>
        transfer.id === selectedTransfer.id
          ? { ...transfer, state: "已通过", approverId: 2 }
          : transfer
      );

      setTransfers(updatedTransfers);
      setActionSuccess("人事调动申请已成功审批通过！");

      // 关闭对话框
      setTimeout(() => {
        setIsApprovalDialogOpen(false);
        setSelectedTransfer(null);
        setApprovalReason("");
      }, 1500);
    } catch (error) {
      console.error("审批失败:", error);
      setActionError("审批失败，请稍后重试");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTransfer) return;

    setProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      // 构建拒绝数据
      const rejectData = {
        state: "未通过",
        approverId: 2, // 假设当前登录的人事专员ID为2
        description: rejectReason || "申请未通过审批",
      };

      // 发送拒绝请求
      await approveTransfer(selectedTransfer.id, rejectData);

      // 更新本地数据
      const updatedTransfers = transfers.map((transfer) =>
        transfer.id === selectedTransfer.id
          ? { ...transfer, state: "未通过", approverId: 2 }
          : transfer
      );

      setTransfers(updatedTransfers);
      setActionSuccess("已拒绝该人事调动申请");

      // 关闭对话框
      setTimeout(() => {
        setIsRejectDialogOpen(false);
        setSelectedTransfer(null);
        setRejectReason("");
      }, 1500);
    } catch (error) {
      console.error("拒绝失败:", error);
      setActionError("操作失败，请稍后重试");
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "待审批":
        return (
          <Badge
            variant="secondary"
            className="border-amber-200 bg-amber-50 text-amber-700"
          >
            <Clock className="mr-1 h-3 w-3" /> 待审批
          </Badge>
        );
      case "已通过":
        return (
          <Badge
            variant="secondary"
            className="border-green-200 bg-green-50 text-green-700"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> 已通过
          </Badge>
        );
      case "未通过":
        return (
          <Badge
            variant="secondary"
            className="border-red-200 bg-red-50 text-red-700"
          >
            <XCircle className="mr-1 h-3 w-3" /> 未通过
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "未知日期";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // 重置为第一页
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">人事调动审批</h1>
        <p className="text-muted-foreground">审批员工部门或职位变动申请</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                人事调动申请列表
              </CardTitle>
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="搜索员工、部门或描述..."
                    className="pl-9 md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="md:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="筛选状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="待审批">待审批</SelectItem>
                    <SelectItem value="已通过">已通过</SelectItem>
                    <SelectItem value="未通过">未通过</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground text-sm">
                    加载人事调动申请中...
                  </p>
                </div>
              </div>
            ) : filteredTransfers.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <UserCog className="text-muted-foreground/50 mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-medium">暂无人事调动申请</h3>
                <p className="text-muted-foreground max-w-md text-sm">
                  {searchTerm || statusFilter !== "all"
                    ? "没有找到符合条件的人事调动申请，请尝试调整搜索条件"
                    : "目前没有人事调动申请记录"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">员工</TableHead>
                      <TableHead>原部门</TableHead>
                      <TableHead>原职位</TableHead>
                      <TableHead>新部门</TableHead>
                      <TableHead>新职位</TableHead>
                      <TableHead>申请说明</TableHead>
                      <TableHead>申请日期</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransfers.map((transfer) => (
                      <TableRow key={transfer.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            {transfer.employeeName}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {transfer.oldDepartmentName}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {transfer.oldPosition}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {transfer.departmentName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {transfer.position}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          {transfer.description ? (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                {transfer.description}
                              </span>
                            </div>
                          ) : (
                            "无"
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(transfer.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(transfer.state)}</TableCell>
                        <TableCell className="text-right">
                          {transfer.state === "待审批" ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setActionSuccess(null);
                                  setActionError(null);
                                  setIsApprovalDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                通过
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setActionSuccess(null);
                                  setActionError(null);
                                  setIsRejectDialogOpen(true);
                                }}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                拒绝
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTransfer(transfer);
                                setActionSuccess(null);
                                setActionError(null);
                                setIsApprovalDialogOpen(true);
                              }}
                            >
                              查看详情
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>每页显示:</span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5条</SelectItem>
                  <SelectItem value="10">10条</SelectItem>
                  <SelectItem value="20">20条</SelectItem>
                  <SelectItem value="50">50条</SelectItem>
                </SelectContent>
              </Select>
              <span>共 {filteredTransfers.length} 条记录</span>
            </div>

            {filteredTransfers.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="border-amber-200 bg-amber-50 text-amber-700"
              >
                待审批: {transfers.filter((t) => t.state === "待审批").length}
              </Badge>
              <Badge
                variant="secondary"
                className="border-green-200 bg-green-50 text-green-700"
              >
                已通过: {transfers.filter((t) => t.state === "已通过").length}
              </Badge>
              <Badge
                variant="secondary"
                className="border-red-200 bg-red-50 text-red-700"
              >
                未通过: {transfers.filter((t) => t.state === "未通过").length}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* 审批对话框 */}
      <Dialog
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              人事调动申请详情
            </DialogTitle>
            <DialogDescription>
              {selectedTransfer?.state === "待审批"
                ? "请审核以下人事调动申请并做出决定"
                : "查看人事调动申请详情"}
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    员工姓名
                  </Label>
                  <div className="bg-muted/50 flex items-center gap-2 rounded-md p-3">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">
                      {selectedTransfer.employeeName}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    申请日期
                  </Label>
                  <div className="bg-muted/50 flex items-center gap-2 rounded-md p-3">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span>{formatDate(selectedTransfer.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    原部门
                  </Label>
                  <div className="bg-muted/50 flex items-center gap-2 rounded-md p-3">
                    <Building className="text-muted-foreground h-4 w-4" />
                    <span>{selectedTransfer.oldDepartmentName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    原职位
                  </Label>
                  <div className="bg-muted/50 flex items-center gap-2 rounded-md p-3">
                    <Briefcase className="text-muted-foreground h-4 w-4" />
                    <span>{selectedTransfer.oldPosition}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    新部门
                  </Label>
                  <div className="bg-muted/50 flex items-center gap-2 rounded-md p-3">
                    <Building className="text-primary h-4 w-4" />
                    <span className="font-medium">
                      {selectedTransfer.departmentName}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    新职位
                  </Label>
                  <div className="bg-muted/50 flex items-center gap-2 rounded-md p-3">
                    <Briefcase className="text-primary h-4 w-4" />
                    <span className="font-medium">
                      {selectedTransfer.position}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    申请状态
                  </Label>
                  <div className="p-3">
                    {getStatusBadge(selectedTransfer.state)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  申请说明
                </Label>
                <div className="bg-muted/50 max-h-32 overflow-y-auto rounded-md border p-3 text-sm">
                  <FileText className="text-muted-foreground mr-2 inline h-4 w-4" />
                  <span>{selectedTransfer.description || "无申请说明"}</span>
                </div>
              </div>

              {selectedTransfer.state === "待审批" && (
                <div className="space-y-2">
                  <Label htmlFor="approvalReason">审批意见</Label>
                  <Input
                    id="approvalReason"
                    placeholder="请输入审批意见（可选）"
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                  />
                </div>
              )}

              {actionSuccess && (
                <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {actionSuccess}
                </div>
              )}

              {actionError && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  {actionError}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedTransfer?.state === "待审批" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsApprovalDialogOpen(false)}
                  disabled={processingAction}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsApprovalDialogOpen(false);
                    setIsRejectDialogOpen(true);
                  }}
                  disabled={processingAction}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  拒绝申请
                </Button>
                <Button onClick={handleApprove} disabled={processingAction}>
                  {processingAction ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      通过申请
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsApprovalDialogOpen(false)}>
                关闭
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 拒绝对话框 */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="text-destructive h-5 w-5" />
              拒绝人事调动申请
            </DialogTitle>
            <DialogDescription>
              请提供拒绝该申请的原因，该信息将反馈给申请人
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-md border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">
                      {selectedTransfer.employeeName}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="border-amber-200 bg-amber-50 text-amber-700"
                  >
                    待审批
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">原部门</p>
                    <div className="flex items-center gap-1">
                      <Building className="text-muted-foreground h-3.5 w-3.5" />
                      <span>{selectedTransfer.oldDepartmentName}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">原职位</p>
                    <div className="flex items-center gap-1">
                      <Briefcase className="text-muted-foreground h-3.5 w-3.5" />
                      <span>{selectedTransfer.oldPosition}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">新部门</p>
                    <div className="flex items-center gap-1">
                      <Building className="text-primary h-3.5 w-3.5" />
                      <span className="font-medium">
                        {selectedTransfer.departmentName}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">新职位</p>
                    <div className="flex items-center gap-1">
                      <Briefcase className="text-primary h-3.5 w-3.5" />
                      <span className="font-medium">
                        {selectedTransfer.position}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedTransfer.description && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-muted-foreground mb-1">申请说明</p>
                    <p className="text-sm">{selectedTransfer.description}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectReason" className="text-destructive">
                  拒绝原因 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rejectReason"
                  placeholder="请输入拒绝该申请的具体原因"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">
                  请提供明确的拒绝理由，以便申请人了解原因
                </p>
              </div>

              {actionSuccess && (
                <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {actionSuccess}
                </div>
              )}

              {actionError && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  {actionError}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={processingAction}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processingAction || !rejectReason.trim()}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  确认拒绝
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
