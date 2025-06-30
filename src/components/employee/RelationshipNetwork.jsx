"use client";

import { Button } from "@/components/ui/button";
import { getMockNetworkData } from '@/lib/services/relationService';
import { BriefcaseBusiness, Loader2, Network, RefreshCw, Users } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

// 节点类型 - 极简版本
const nodeTypes = {
  employee: ({ data }) => (
    <div 
      className="px-1 py-1 shadow-md rounded border-2"
      style={{ 
        width: '90px', 
        height: '50px', 
        fontSize: '10px', 
        textAlign: 'center',
        borderColor: getNodeBorderColor(data.role),
        backgroundColor: getNodeBgColor(data.role)
      }}
    >
      <div className="font-bold text-xs truncate">{data.label}</div>
      <div className="text-[8px] truncate">{data.position}</div>
      {data.project && (
        <div className="mt-1 text-[8px] text-emerald-600 truncate flex items-center justify-center">
          <BriefcaseBusiness className="inline-block h-2 w-2 mr-0.5" />
          <span className="truncate">{data.project}</span>
        </div>
      )}
    </div>
  )
};

// 获取节点边框颜色
function getNodeBorderColor(role) {
  switch (role) {
    case 'current': return '#ef4444';
    case 'leader': return '#3b82f6'; 
    case 'colleague': return '#8b5cf6';
    case 'collaborator': return '#f59e0b';
    default: return '#64748b';
  }
}

// 获取节点背景颜色
function getNodeBgColor(role) {
  switch (role) {
    case 'current': return '#fee2e2';
    case 'leader': return '#dbeafe';
    case 'colleague': return '#f3e8ff';
    case 'collaborator': return '#fef3c7';
    default: return '#f8fafc';
  }
}

// 获取边样式
function getEdgeStyle(type) {
  switch (type) {
    case 'management':
      return {
        stroke: '#3b82f6',
        strokeWidth: 1.5
      };
    case 'colleague':
      return {
        stroke: '#8b5cf6',
        strokeWidth: 1.5
      };
    case 'collaboration':
      return {
        stroke: '#f59e0b',
        strokeWidth: 1.5
      };
    default:
      return {
        stroke: '#94a3b8',
        strokeWidth: 1
      };
  }
}

export default function RelationshipNetwork({ employeeId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // 加载和处理关系数据
  useEffect(() => {
    const fetchRelationData = async () => {
      setLoading(true);
      try {
        const data = getMockNetworkData(employeeId);
        buildNetworkGraph(data);
      } catch (err) {
        console.error("加载关系网络失败:", err);
        setError("加载关系网络数据失败，请稍后再试");
      } finally {
        setLoading(false);
      }
    };

    fetchRelationData();
  }, [employeeId]);

  // 构建网络图
  const buildNetworkGraph = (data) => {
    const newNodes = [];
    const newEdges = [];
    
    // 1. 添加中心节点（当前员工）
    if (data.employee) {
      newNodes.push({
        id: data.employee.id.toString(),
        type: 'employee',
        position: { x: 250, y: 250 },
        data: {
          label: data.employee.name,
          position: '当前员工',
          role: 'current'
        }
      });
    }
    
    // 2. 添加管理链节点和边
    if (data.management && data.management.length > 1) {
      // 跳过第一个（当前员工）
      for (let i = 1; i < data.management.length; i++) {
        const level = data.management[i];
        
        if (Array.isArray(level)) {
          const levelWidth = level.length * 120;
          const startX = 250 - (levelWidth / 2) + 60;
          
          level.forEach((manager, idx) => {
            if (manager && manager.id && manager.name) {
              // 添加管理者节点
              newNodes.push({
                id: manager.id.toString(),
                type: 'employee',
                position: { x: startX + (idx * 120), y: 100 - (i * 70) },
                data: {
                  label: manager.name,
                  position: i === 1 ? '直接上级' : `上级 L${i}`,
                  role: 'leader'
                }
              });
              
              // 添加管理边
              const targetId = i === 1 
                ? data.employee.id.toString() 
                : data.management[i-1][0].id.toString();
              
              newEdges.push({
                id: `e-manage-${manager.id}-${targetId}`,
                source: manager.id.toString(),
                target: targetId,
                type: 'straight',
                animated: true,
                style: getEdgeStyle('management'),
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#3b82f6'
                }
              });
            }
          });
        }
      }
    }
    
    // 3. 添加同事节点和边
    if (data.colleagues && data.colleagues.length > 0) {
      data.colleagues.forEach((colleague, index) => {
        if (colleague && colleague.id && colleague.name) {
          // 计算位置 - 右侧半圆
          const angle = -Math.PI / 4 + (index / Math.max(1, data.colleagues.length - 1)) * (Math.PI / 2);
          const radius = 150;
          const x = 250 + radius * Math.cos(angle);
          const y = 250 + radius * Math.sin(angle);
          
          // 添加同事节点
          newNodes.push({
            id: colleague.id.toString(),
            type: 'employee',
            position: { x, y },
            data: {
              label: colleague.name,
              position: '同事',
              role: 'colleague'
            }
          });
          
          // 添加同事边
          newEdges.push({
            id: `e-colleague-${colleague.id}`,
            source: data.employee.id.toString(),
            target: colleague.id.toString(),
            type: 'straight',
            style: getEdgeStyle('colleague'),
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#8b5cf6'
            }
          });
        }
      });
      
      // 添加同事之间的连接
      for (let i = 0; i < data.colleagues.length; i++) {
        for (let j = i + 1; j < data.colleagues.length; j++) {
          if (data.colleagues[i] && data.colleagues[j]) {
            newEdges.push({
              id: `e-colleague-net-${data.colleagues[i].id}-${data.colleagues[j].id}`,
              source: data.colleagues[i].id.toString(),
              target: data.colleagues[j].id.toString(),
              type: 'straight',
              style: getEdgeStyle('colleague')
            });
          }
        }
      }
    }
    
    // 4. 添加合作者节点和边
    if (data.collaborators && data.collaborators.length > 0) {
      data.collaborators.forEach((collaborator, index) => {
        if (collaborator && collaborator.id && collaborator.name) {
          // 计算位置 - 左侧半圆
          const angle = Math.PI / 2 + (index / Math.max(1, data.collaborators.length - 1)) * (Math.PI / 2);
          const radius = 150;
          const x = 250 + radius * Math.cos(angle);
          const y = 250 + radius * Math.sin(angle);
          
          // 添加合作者节点
          newNodes.push({
            id: collaborator.id.toString(),
            type: 'employee',
            position: { x, y },
            data: {
              label: collaborator.name,
              position: '项目合作',
              role: 'collaborator',
              project: collaborator.projectName
            }
          });
          
          // 添加合作边
          newEdges.push({
            id: `e-collaborator-${collaborator.id}`,
            source: data.employee.id.toString(),
            target: collaborator.id.toString(),
            type: 'straight',
            style: getEdgeStyle('collaboration'),
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#f59e0b'
            }
          });
        }
      });
      
      // 分组项目合作者
      const projectGroups = {};
      data.collaborators.forEach(collaborator => {
        if (collaborator && collaborator.projectName) {
          if (!projectGroups[collaborator.projectName]) {
            projectGroups[collaborator.projectName] = [];
          }
          projectGroups[collaborator.projectName].push(collaborator.id);
        }
      });
      
      // 添加同项目合作者之间的连接
      Object.values(projectGroups).forEach(group => {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            newEdges.push({
              id: `e-project-${group[i]}-${group[j]}`,
              source: group[i].toString(),
              target: group[j].toString(),
              type: 'straight',
              style: getEdgeStyle('collaboration')
            });
          }
        }
      });
    }
    
    // 5. 添加一些跨组连接，增强网络感
    if (data.colleagues && data.collaborators) {
      const maxCrossLinks = Math.min(3, Math.min(data.colleagues.length, data.collaborators.length));
      for (let i = 0; i < maxCrossLinks; i++) {
        const colleagueIdx = i % data.colleagues.length;
        const collaboratorIdx = i % data.collaborators.length;
        
        if (data.colleagues[colleagueIdx] && data.collaborators[collaboratorIdx]) {
          newEdges.push({
            id: `e-cross-${data.colleagues[colleagueIdx].id}-${data.collaborators[collaboratorIdx].id}`,
            source: data.colleagues[colleagueIdx].id.toString(),
            target: data.collaborators[collaboratorIdx].id.toString(),
            type: 'straight',
            style: { stroke: '#94a3b8', strokeWidth: 1, opacity: 0.6 }
          });
        }
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // 手动同步关系数据
  const handleSyncRelations = () => {
    setSyncing(true);
    setTimeout(() => {
      try {
        const data = getMockNetworkData(employeeId);
        buildNetworkGraph(data);
        alert("同步关系数据成功（模拟）");
      } catch (err) {
        console.error("同步关系数据失败:", err);
        alert("同步关系数据失败，请稍后再试");
      } finally {
        setSyncing(false);
      }
    }, 1000);
  };

  // 图例组件
  const Legend = () => (
    <div className="bg-white p-2 rounded-md shadow-md text-xs">
      <h4 className="font-bold mb-1">图例</h4>
      <div className="space-y-1">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
          <span>当前员工</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
          <span>管理关系</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
          <span>同事关系</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
          <span>合作关系</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">加载关系网络中...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>重试</Button>
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%', border: '1px solid #e2e8f0' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            defaultEdgeOptions={{
              type: 'straight',
              animated: false
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e2e8f0" gap={16} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => getNodeBorderColor(node.data.role)}
              maskColor="rgba(0, 0, 0, 0.05)"
              style={{ border: '1px solid #e2e8f0' }}
            />
            <Panel position="top-right">
              <Legend />
            </Panel>
            <Panel position="top-left">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white" 
                onClick={handleSyncRelations}
                disabled={syncing}
              >
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    同步中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    刷新关系数据
                  </>
                )}
              </Button>
            </Panel>
            
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center space-y-3">
                  <Network className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">暂无关系数据</p>
                </div>
              </div>
            )}
          </ReactFlow>
        </div>
      )}
    </div>
  );
} 