import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ""
}) {
  // 计算要显示的页码
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // 始终显示第一页
    pageNumbers.push(1);
    
    // 如果当前页大于3，添加省略号
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    
    // 显示当前页前后的页码
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pageNumbers[pageNumbers.length - 1] !== '...' && pageNumbers[pageNumbers.length - 1] !== i - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(i);
    }
    
    // 如果当前页小于总页数-2，添加省略号
    if (currentPage < totalPages - 2 && totalPages > 3) {
      if (pageNumbers[pageNumbers.length - 1] !== '...') {
        pageNumbers.push('...');
      }
    }
    
    // 如果总页数大于1，始终显示最后一页
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8"
        aria-label="上一页"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageNumbers.map((pageNumber, index) => (
        pageNumber === '...' ? (
          <Button
            key={`ellipsis-${index}`}
            variant="ghost"
            size="icon"
            disabled
            className="h-8 w-8 cursor-default"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(pageNumber)}
            className={`h-8 w-8 ${currentPage === pageNumber ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          >
            {pageNumber}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-8 w-8"
        aria-label="下一页"
      >
        <ChevronRight className="h-4 w-4" />
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