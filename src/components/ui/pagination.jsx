import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import React from 'react';

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ""
}) {
  // 如果总页数小于等于1，不显示分页
  if (totalPages <= 1) return null;

  // 生成页码数组
  const generatePagination = () => {
    // 如果总页数小于等于5，显示所有页码
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 如果当前页在前3页
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // 如果当前页在后3页
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // 当前页在中间
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = generatePagination();

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">上一页</span>
      </Button>
      
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-default"
              disabled
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">更多页</span>
            </Button>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page)}
          >
            {page}
            <span className="sr-only">第{page}页</span>
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">下一页</span>
      </Button>
    </div>
  );
}

export function PaginationInfo({ 
  currentPage, 
  pageSize, 
  totalItems, 
  className = "" 
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      显示 {startItem} - {endItem} 条，共 {totalItems} 条
    </div>
  );
} 