"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function DepartmentHierarchy({ departments }) {
  // 构建部门层级结构
  const buildHierarchy = (departments) => {
    const deptMap = {};
    const roots = [];

    // 创建部门映射
    departments.forEach((dept) => {
      deptMap[dept.id] = { ...dept, children: [] };
    });

    // 构建层级关系
    departments.forEach((dept) => {
      if (dept.parentId && deptMap[dept.parentId]) {
        deptMap[dept.parentId].children.push(deptMap[dept.id]);
      } else {
        roots.push(deptMap[dept.id]);
      }
    });

    return roots;
  };

  const hierarchyData = buildHierarchy(departments);

  // 管理展开/收起状态
  const [expandedNodes, setExpandedNodes] = useState(() => {
    // 默认展开所有顶级部门
    const initialExpanded = new Set();
    hierarchyData.forEach((dept) => {
      if (dept.children && dept.children.length > 0) {
        initialExpanded.add(dept.id);
      }
    });
    return initialExpanded;
  });

  const toggleExpanded = (deptId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };

  // 全部展开/收起功能
  const expandAll = () => {
    const allNodes = new Set();
    const collectAllNodes = (depts) => {
      depts.forEach((dept) => {
        if (dept.children && dept.children.length > 0) {
          allNodes.add(dept.id);
          collectAllNodes(dept.children);
        }
      });
    };
    collectAllNodes(hierarchyData);
    setExpandedNodes(allNodes);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const hasAnyExpanded = expandedNodes.size > 0;

  const DepartmentNode = ({ department, level = 0 }) => {
    const hasChildren = department.children && department.children.length > 0;
    const isExpanded = expandedNodes.has(department.id);

    return (
      <div className="space-y-2">
        <div
          className={`hover:bg-muted/50 flex items-center space-x-2 rounded-lg border p-2 transition-colors ${
            level === 0 ? "bg-primary/5 border-primary/20" : "bg-background"
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          {/* 展开/收起按钮 */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-muted h-5 w-5 p-0"
              onClick={() => toggleExpanded(department.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}

          {/* 如果没有子部门，添加占位空间 */}
          {!hasChildren && <div className="w-5" />}

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-medium">{department.name}</h4>
          </div>
        </div>

        {/* 可折叠的子部门 */}
        {hasChildren && isExpanded && (
          <div className="space-y-1 transition-all duration-200 ease-in-out">
            {department.children.map((child) => (
              <DepartmentNode
                key={child.id}
                department={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>组织架构</span>
            </CardTitle>
            <CardDescription>展示部门层级关系和管理结构</CardDescription>
          </div>
          {/* 展开/收起控制按钮 */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={hasAnyExpanded ? collapseAll : expandAll}
              className="text-xs"
            >
              {hasAnyExpanded ? (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" />
                  全部收起
                </>
              ) : (
                <>
                  <ChevronRight className="mr-1 h-3 w-3" />
                  全部展开
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {hierarchyData.length > 0 ? (
            hierarchyData.map((rootDept) => (
              <DepartmentNode key={rootDept.id} department={rootDept} />
            ))
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <Building2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>暂无部门数据</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
