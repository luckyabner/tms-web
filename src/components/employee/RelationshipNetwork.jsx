"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMockNetworkData, getRelationNetwork, syncRelations } from '@/lib/services/relationService';
import { Loader2, Network, RefreshCw, Users } from 'lucide-react';
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

// 自定义节点样式
const nodeTypes = {
  employee: ({ data }) => (
    <div className={`px-4 py-2 shadow-md rounded-md border ${getNodeColorClass(data.role)}`}>
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColorClass(data.role)}`}>
          {data.avatar ? (
            <img src={data.avatar} alt={data.label} className="rounded-full" />
          ) : (
            <span className="text-lg font-bold">{data.label.charAt(0)}</span>
          )}
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs">{data.position}</div>
        </div>
      </div>
      {data.department && (
        <div className="mt-1 text-xs text-gray-500">{data.department}</div>
      )}
    </div>
  )
};

// 根据角色获取节点颜色
const getNodeColorClass = (role) => {
  switch (role) {
    case 'leader':
      return 'border-blue-500 bg-blue-50';
    case 'manager':
      return 'border-green-500 bg-green-50';
    case 'hr':
      return 'border-purple-500 bg-purple-50';
    case 'employee':
      return 'border-gray-300 bg-white';
    case 'current':
      return 'border-red-500 bg-red-50';
    default:
      return 'border-gray-300 bg-white';
  }
};

// 根据角色获取图标颜色
const getIconColorClass = (role) => {
  switch (role) {
    case 'leader':
      return 'bg-blue-100 text-blue-500';
    case 'manager':
      return 'bg-green-100 text-green-500';
    case 'hr':
      return 'bg-purple-100 text-purple-500';
    case 'employee':
      return 'bg-gray-100 text-gray-500';
    case 'current':
      return 'bg-red-100 text-red-500';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

// 边的样式配置
const getEdgeStyle = (type) => {
  switch (type) {
    case 'manages':
      return {
        stroke: '#10b981', // emerald-500
        strokeWidth: 2,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
        },
      };
    case 'same_department':
      return {
        stroke: '#a855f7', // purple-500
        strokeWidth: 2,
        strokeDasharray: '5,5',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#a855f7',
        },
      };
    case 'collaborates_with':
      return {
        stroke: '#f59e0b', // amber-500
        strokeWidth: 2,
        strokeDasharray: '3,3',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#f59e0b',
        },
      };
    default:
      return {
        stroke: '#94a3b8', // slate-400
        strokeWidth: 1,
      };
  }
};

export default function RelationshipNetwork({ employeeId }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // 处理API返回的关系网络数据
  const processApiNetworkData = useCallback((data) => {
    const nodes = [];
    const edges = [];
    
    // 处理当前员工 - 放在中心位置
    if (data.employee) {
      const currentEmployee = data.employee;
      nodes.push({
        id: currentEmployee.id.toString(),
        type: 'employee',
        position: { x: 300, y: 300 },
        data: {
          label: currentEmployee.name || `员工 ${currentEmployee.id}`,
          position: '当前员工',
          role: 'current' // 特殊角色，高亮显示
        }
      });
    }
    
    // 计算圆形布局的位置
    const calculateCirclePosition = (index, total, radius, centerX, centerY) => {
      const angle = (index / total) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x, y };
    };
    
    // 处理管理链条 - 上方垂直排列
    if (data.management && Array.isArray(data.management)) {
      // 跳过第一个（当前员工）
      const managers = data.management.slice(1);
      
      managers.forEach((level, levelIndex) => {
        if (Array.isArray(level) && level.length > 0) {
          const manager = level[0];
          if (manager && manager.id && manager.name) {
            // 添加管理者节点 - 上方垂直排列
            nodes.push({
              id: manager.id.toString(),
              type: 'employee',
              position: { x: 300, y: 150 - levelIndex * 100 }, // 越高级的管理者越靠上
              data: {
                label: manager.name,
                position: levelIndex === 0 ? '直接上级' : `上级 L${levelIndex + 1}`,
                role: 'leader'
              }
            });
            
            // 添加管理关系边 - 连接到下一级
            const targetId = levelIndex === 0 
              ? data.employee.id.toString() 
              : data.management[levelIndex][0].id.toString();
            
            edges.push({
              id: `e-manage-${edges.length}`,
              source: manager.id.toString(),
              target: targetId,
              label: '管理',
              type: 'smoothstep',
              style: getEdgeStyle('manages')
            });
            
            // 如果不是最后一级，添加跨级连接
            if (data.employee && levelIndex > 0) {
              edges.push({
                id: `e-manage-skip-${edges.length}`,
                source: manager.id.toString(),
                target: data.employee.id.toString(),
                label: '间接管理',
                type: 'smoothstep',
                style: { ...getEdgeStyle('manages'), strokeDasharray: '5,5', opacity: 0.6 }
              });
            }
          }
        }
      });
    }
    
    // 处理同事 - 环绕当前员工的圆形布局
    if (data.colleagues && Array.isArray(data.colleagues) && data.colleagues.length > 0) {
      const totalColleagues = data.colleagues.length;
      data.colleagues.forEach((colleague, index) => {
        if (colleague && colleague.id && colleague.name) {
          // 计算圆形布局位置
          const position = calculateCirclePosition(
            index, totalColleagues, 150, 300, 300
          );
          
          // 添加同事节点
          nodes.push({
            id: colleague.id.toString(),
            type: 'employee',
            position,
            data: {
              label: colleague.name,
              position: '同事',
              role: 'employee'
            }
          });
          
          // 添加同事关系边 - 双向连接
          if (data.employee) {
            edges.push({
              id: `e-colleague-${edges.length}`,
              source: data.employee.id.toString(),
              target: colleague.id.toString(),
              label: '同事',
              type: 'straight',
              style: getEdgeStyle('same_department')
            });
            
            // 同事之间也相互连接，形成网络
            data.colleagues.forEach((otherColleague, otherIndex) => {
              if (otherIndex > index && otherColleague && otherColleague.id) {
                edges.push({
                  id: `e-colleague-net-${edges.length}`,
                  source: colleague.id.toString(),
                  target: otherColleague.id.toString(),
                  type: 'straight',
                  style: { ...getEdgeStyle('same_department'), strokeWidth: 1, opacity: 0.3 }
                });
              }
            });
          }
        }
      });
    }
    
    // 处理合作者 - 底部区域布局
    if (data.collaborators && Array.isArray(data.collaborators) && data.collaborators.length > 0) {
      const totalCollaborators = data.collaborators.length;
      data.collaborators.forEach((collaborator, index) => {
        if (collaborator && collaborator.id && collaborator.name) {
          // 计算位置 - 底部扇形区域
          const position = calculateCirclePosition(
            (index + 0.5) / (totalCollaborators + 1), 
            1, 
            200, 
            300, 
            450
          );
          
          // 添加合作者节点
          nodes.push({
            id: collaborator.id.toString(),
            type: 'employee',
            position,
            data: {
              label: collaborator.name,
              position: '合作者',
              role: 'hr' // 使用HR样式以区分
            }
          });
          
          // 添加合作关系边
          if (data.employee) {
            edges.push({
              id: `e-collab-${edges.length}`,
              source: data.employee.id.toString(),
              target: collaborator.id.toString(),
              label: '合作',
              type: 'bezier',
              style: getEdgeStyle('collaborates_with')
            });
            
            // 合作者之间也可能有连接
            if (index > 0) {
              edges.push({
                id: `e-collab-net-${edges.length}`,
                source: collaborator.id.toString(),
                target: data.collaborators[0].id.toString(),
                type: 'bezier',
                style: { ...getEdgeStyle('collaborates_with'), strokeWidth: 1, opacity: 0.3 }
              });
            }
          }
        }
      });
    }
    
    return { nodes, edges };
  }, []);

  // 处理关系数据，转换为React Flow格式 (用于模拟数据)
  const processNetworkData = useCallback((data) => {
    // 处理节点
    const processedNodes = data.nodes?.map((node, index) => ({
      id: node.id.toString(),
      type: 'employee',
      position: { x: 100 + (index % 3) * 200, y: 100 + Math.floor(index / 3) * 150 },
      data: {
        label: node.name || `员工 ${node.id}`,
        position: node.position || '职位未知',
        department: node.department || '部门未知',
        role: node.role || 'employee',
        avatar: node.avatar || null
      }
    })) || [];

    // 处理边，移除汇报关系
    const processedEdges = data.edges?.filter(edge => 
      edge.relationship !== 'reports_to'
    ).map((edge, index) => ({
      id: `e${index}`,
      source: edge.source.toString(),
      target: edge.target.toString(),
      label: edge.relationship || '',
      type: 'bezier',
      style: getEdgeStyle(edge.relationship)
    })) || [];

    return { nodes: processedNodes, edges: processedEdges };
  }, []);

  // 加载关系网络数据
  const loadNetworkData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRelationNetwork(employeeId);
      
      // 检查是否有实际的API返回数据
      if (data && data.employee && data.employee.id) {
        // 处理API返回的数据结构
        const { nodes: apiNodes, edges: apiEdges } = processApiNetworkData(data);
        setNodes(apiNodes);
        setEdges(apiEdges);
      } else if (!data || Object.keys(data).length === 0) {
        // 如果没有数据，显示默认的模拟数据
        const mockData = getMockNetworkData(employeeId);
        // 处理模拟数据
        const { nodes: apiNodes, edges: apiEdges } = processApiNetworkData(mockData);
        setNodes(apiNodes);
        setEdges(apiEdges);
      } else {
        // 如果数据格式不符合预期，使用模拟数据
        const mockData = getMockNetworkData(employeeId);
        const { nodes: apiNodes, edges: apiEdges } = processApiNetworkData(mockData);
        setNodes(apiNodes);
        setEdges(apiEdges);
      }
    } catch (err) {
      console.error("加载关系网络数据失败:", err);
      setError("无法加载关系网络数据，请稍后再试");
      // 加载失败时使用模拟数据
      const mockData = getMockNetworkData(employeeId);
      const { nodes: apiNodes, edges: apiEdges } = processApiNetworkData(mockData);
      setNodes(apiNodes);
      setEdges(apiEdges);
    } finally {
      setLoading(false);
    }
  }, [employeeId, processNetworkData, processApiNetworkData, setNodes, setEdges]);

  // 同步关系数据
  const handleSyncRelations = async () => {
    setSyncing(true);
    try {
      await syncRelations();
      // 同步后重新加载数据
      await loadNetworkData();
    } catch (err) {
      console.error("同步关系数据失败:", err);
      setError("同步关系数据失败，请稍后再试");
    } finally {
      setSyncing(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    loadNetworkData();
  }, [loadNetworkData]);

  return (
    <Card className="w-full h-[600px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-600" />
            员工关系网络
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadNetworkData}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              刷新
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSyncRelations}
              disabled={syncing}
            >
              {syncing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Users className="h-4 w-4 mr-1" />}
              同步关系数据
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center h-[550px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">加载关系网络中...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[550px] text-red-500">
            {error}
          </div>
        ) : (
          <div style={{ width: '100%', height: '550px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
              defaultZoom={0.8}
              attributionPosition="bottom-right"
            >
              <Background color="#f1f5f9" gap={16} />
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  switch (node.data.role) {
                    case 'leader': return '#3b82f6';
                    case 'manager': return '#10b981';
                    case 'hr': return '#a855f7';
                    case 'current': return '#ef4444';
                    default: return '#94a3b8';
                  }
                }}
                maskColor="rgba(241, 245, 249, 0.6)"
              />
              <Panel position="top-left" className="bg-white p-2 rounded shadow-md">
                <div className="text-xs font-medium mb-1">关系类型:</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></div>
                    <span className="text-xs">管理关系</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                    <span className="text-xs">同部门</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                    <span className="text-xs">合作关系</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-xs">当前员工</span>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 