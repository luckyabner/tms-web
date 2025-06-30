"use client";

import { Button } from "@/components/ui/button";
import { getMockNetworkData } from '@/lib/services/relationService';
import { BriefcaseBusiness, Loader2, Network, RefreshCw, Users } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MarkerType,
    MiniMap,
    Panel,
    useEdgesState,
    useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// 节点类型 - 极简版本
const nodeTypes = {
  employee: ({ data }) => (
    <div 
      className="px-2 py-2 shadow-md rounded-md border-2"
      style={{ 
        width: '100px', 
        height: '55px', 
        fontSize: '11px', 
        textAlign: 'center',
        borderColor: getNodeBorderColor(data.role),
        backgroundColor: getNodeBgColor(data.role)
      }}
    >
      <div className="font-bold text-xs truncate">{data.label}</div>
      <div className="text-[9px] truncate">{data.position}</div>
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
        strokeWidth: 2
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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
                type: 'step',
                animated: true,
                style: getEdgeStyle('management'),
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#3b82f6',
                  width: 15,
                  height: 15
                }
              });
            }
          });
        }
      }
    }
    
    // 3. 添加同事节点和边
    if (data.colleagues && data.colleagues.length > 0) {
      const angleStep = Math.min(Math.PI / 2, (Math.PI / 2) / data.colleagues.length);
      
      data.colleagues.forEach((colleague, index) => {
        if (colleague && colleague.id && colleague.name) {
          // 计算位置 - 右侧半圆
          const angle = -Math.PI / 4 + (index * angleStep);
          const radius = 180;
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
            type: 'smoothstep',
            style: getEdgeStyle('colleague'),
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#8b5cf6',
              width: 10,
              height: 10
            }
          });
        }
      });
      
      // 添加同事之间的连接 (减少连接数量以提高可视化效果)
      if (data.colleagues.length > 1) {
        for (let i = 0; i < data.colleagues.length - 1; i++) {
          if (data.colleagues[i] && data.colleagues[i+1]) {
            newEdges.push({
              id: `e-colleague-net-${data.colleagues[i].id}-${data.colleagues[i+1].id}`,
              source: data.colleagues[i].id.toString(),
              target: data.colleagues[i+1].id.toString(),
              type: 'straight',
              style: {
                ...getEdgeStyle('colleague'),
                strokeDasharray: '5,5',
                opacity: 0.6
              }
            });
          }
        }
      }
    }
    
    // 4. 添加合作者节点和边
    if (data.collaborators && data.collaborators.length > 0) {
      const angleStep = Math.min(Math.PI / 2, (Math.PI / 2) / data.collaborators.length);
      
      data.collaborators.forEach((collaborator, index) => {
        if (collaborator && collaborator.id && collaborator.name) {
          // 计算位置 - 左侧半圆
          const angle = Math.PI / 2 + (index * angleStep);
          const radius = 180;
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
            type: 'smoothstep',
            style: getEdgeStyle('collaboration'),
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#f59e0b',
              width: 10,
              height: 10
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
        if (group.length > 1) {
          for (let i = 0; i < group.length - 1; i++) {
            newEdges.push({
              id: `e-project-${group[i]}-${group[i+1]}`,
              source: group[i].toString(),
              target: group[i+1].toString(),
              type: 'straight',
              style: {
                ...getEdgeStyle('collaboration'),
                strokeDasharray: '5,5',
                opacity: 0.6
              }
            });
          }
        }
      });
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.2}
            maxZoom={1.5}
            defaultEdgeOptions={{
              type: 'smoothstep'
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