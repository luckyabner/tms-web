'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { approveTransfer, getAllTransfers } from '@/lib/services/employeeService';
import { format } from 'date-fns';
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
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [approvalReason, setApprovalReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
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
      console.error('获取人事调动申请失败:', error);
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
      filtered = filtered.filter(transfer => 
        transfer.employeeName?.toLowerCase().includes(lowerSearchTerm) ||
        transfer.departmentName?.toLowerCase().includes(lowerSearchTerm) ||
        transfer.currentDepartment?.toLowerCase().includes(lowerSearchTerm) ||
        transfer.position?.toLowerCase().includes(lowerSearchTerm) ||
        transfer.description?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // 应用状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transfer => transfer.state === statusFilter);
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
        state: '已通过',
        approverId: 2, // 假设当前登录的人事专员ID为2
        description: approvalReason || selectedTransfer.description,
        isCurrent: 1 // 设置为当前部门
      };
      
      // 发送审批请求
      await approveTransfer(selectedTransfer.id, approvalData);
      
      // 更新本地数据
      const updatedTransfers = transfers.map(transfer => 
        transfer.id === selectedTransfer.id 
          ? { ...transfer, state: '已通过', approverId: 2 } 
          : transfer
      );
      
      setTransfers(updatedTransfers);
      setActionSuccess('人事调动申请已成功审批通过！');
      
      // 关闭对话框
      setTimeout(() => {
        setIsApprovalDialogOpen(false);
        setSelectedTransfer(null);
        setApprovalReason('');
      }, 1500);
    } catch (error) {
      console.error('审批失败:', error);
      setActionError('审批失败，请稍后重试');
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
        state: '未通过',
        approverId: 2, // 假设当前登录的人事专员ID为2
        description: rejectReason || '申请未通过审批'
      };
      
      // 发送拒绝请求
      await approveTransfer(selectedTransfer.id, rejectData);
      
      // 更新本地数据
      const updatedTransfers = transfers.map(transfer => 
        transfer.id === selectedTransfer.id 
          ? { ...transfer, state: '未通过', approverId: 2 } 
          : transfer
      );
      
      setTransfers(updatedTransfers);
      setActionSuccess('已拒绝该人事调动申请');
      
      // 关闭对话框
      setTimeout(() => {
        setIsRejectDialogOpen(false);
        setSelectedTransfer(null);
        setRejectReason('');
      }, 1500);
    } catch (error) {
      console.error('拒绝失败:', error);
      setActionError('操作失败，请稍后重试');
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case '待审批':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="mr-1 h-3 w-3" /> 待审批
        </Badge>;
      case '已通过':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" /> 已通过
        </Badge>;
      case '未通过':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="mr-1 h-3 w-3" /> 未通过
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '未知日期';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            人事调动审批
          </h1>
          <p className="text-gray-500">审批员工部门或职位变动申请</p>
        </div>
        <Button 
          onClick={fetchTransfers} 
          variant="outline" 
          className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200"
        >
          <Clock className="h-4 w-4" />
          刷新申请
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-blue-100 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center text-blue-800">
                <UserCog className="h-5 w-5 mr-2 text-blue-600" />
                人事调动申请列表
              </CardTitle>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索员工、部门或描述..."
                    className="pl-8 w-full md:w-[250px] border-blue-200 focus:border-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] border-blue-200">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-blue-500" />
                      <SelectValue placeholder="筛选状态" />
                    </div>
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
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-3" />
                  <p className="text-gray-500">加载人事调动申请中...</p>
                </div>
              </div>
            ) : filteredTransfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <UserCog className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">暂无人事调动申请</h3>
                <p className="text-gray-500 max-w-md">
                  {searchTerm || statusFilter !== 'all' 
                    ? '没有找到符合条件的人事调动申请，请尝试调整搜索条件' 
                    : '目前没有人事调动申请记录'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[180px]">员工</TableHead>
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
                      <TableRow key={transfer.id} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium">{transfer.employeeName}</TableCell>
                        <TableCell>{transfer.oldDepartmentName}</TableCell>
                        <TableCell>{transfer.oldPosition}</TableCell>
                        <TableCell>{transfer.departmentName}</TableCell>
                        <TableCell>{transfer.position}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{transfer.description || '无'}</TableCell>
                        <TableCell>{formatDate(transfer.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(transfer.state)}</TableCell>
                        <TableCell className="text-right">
                          {transfer.state === '待审批' ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-500 text-green-600 hover:bg-green-50"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setIsApprovalDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                通过
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-500 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
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
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedTransfer(transfer);
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
          <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>每页显示:</span>
              <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[80px] h-8 text-xs">
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
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                待审批: {transfers.filter(t => t.state === '待审批').length}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                已通过: {transfers.filter(t => t.state === '已通过').length}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                未通过: {transfers.filter(t => t.state === '未通过').length}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* 审批对话框 */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserCog className="mr-2 h-5 w-5 text-blue-600" />
              人事调动申请详情
            </DialogTitle>
            <DialogDescription>
              {selectedTransfer?.state === '待审批' 
                ? '请审核以下人事调动申请并做出决定' 
                : '查看人事调动申请详情'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransfer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-500 text-sm">员工姓名</Label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">{selectedTransfer.employeeName}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-500 text-sm">申请日期</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{formatDate(selectedTransfer.createdAt)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-500 text-sm">原部门</Label>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{selectedTransfer.oldDepartmentName}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-500 text-sm">原职位</Label>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{selectedTransfer.oldPosition}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-500 text-sm">新部门</Label>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium text-green-700">{selectedTransfer.departmentName}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-500 text-sm">新职位</Label>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium text-green-700">{selectedTransfer.position}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-500 text-sm">申请状态</Label>
                  <div>{getStatusBadge(selectedTransfer.state)}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-500 text-sm">申请说明</Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm border border-gray-200 max-h-32 overflow-y-auto">
                  <FileText className="h-4 w-4 inline mr-2 text-gray-400" />
                  <span>{selectedTransfer.description || '无申请说明'}</span>
                </div>
              </div>
              
              {selectedTransfer.state === '待审批' && (
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
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  {actionSuccess}
                </div>
              )}
              
              {actionError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  {actionError}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {selectedTransfer?.state === '待审批' ? (
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
                <Button 
                  onClick={handleApprove}
                  disabled={processingAction}
                >
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
            <DialogTitle className="flex items-center">
              <XCircle className="mr-2 h-5 w-5 text-red-500" />
              拒绝人事调动申请
            </DialogTitle>
            <DialogDescription>
              请提供拒绝该申请的原因，该信息将反馈给申请人
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{selectedTransfer.employeeName}</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    待审批
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Building className="h-3 w-3 mr-1" />
                  {selectedTransfer.oldDepartmentName}
                  <ArrowRight className="h-3 w-3 mx-1" />
                  {selectedTransfer.departmentName}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-3 w-3 mr-1" />
                  新职位: {selectedTransfer.position}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejectReason" className="text-red-600">拒绝原因 *</Label>
                <Input
                  id="rejectReason"
                  placeholder="请输入拒绝该申请的具体原因"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="border-red-200 focus:border-red-400 focus:ring-red-400"
                />
                <p className="text-xs text-gray-500">
                  请提供明确的拒绝理由，以便申请人了解原因
                </p>
              </div>
              
              {actionSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  {actionSuccess}
                </div>
              )}
              
              {actionError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
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