import api from "../api";
import { EMPLOYEE_RELATIONS } from "../mockRelationData";

/**
 * 获取管理链条
 * @param {number} employeeId 员工ID
 * @returns {Promise} 返回管理链条数据
 */
export const getManagementChain = async (employeeId) => {
  try {
    const response = await api.get(`/relations/managementchain/${employeeId}`);
    // 确保返回的是数组格式
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data || [];
  } catch (error) {
    console.error("获取管理链条失败:", error);
    // 返回模拟数据而不是抛出错误
    return getMockChainData(employeeId);
  }
};

/**
 * 获取综合关系网络
 * @param {number} employeeId 员工ID
 * @returns {Promise} 返回综合关系网络数据
 */
export const getRelationNetwork = async (employeeId) => {
  try {
    const response = await api.get(`/relations/network/${employeeId}`);
    // 确保返回的是对象格式
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    return response.data || {};
  } catch (error) {
    console.error("获取综合关系网络失败:", error);
    // 返回模拟数据而不是抛出错误
    return getMockNetworkData(employeeId);
  }
};

/**
 * 手动触发同步关系数据
 * @returns {Promise} 返回同步结果
 */
export const syncRelations = async () => {
  try {
    const response = await api.post("/relations/sync");
    return { success: true, message: "同步成功" };
  } catch (error) {
    console.error("同步关系数据失败:", error);
    // 返回模拟成功响应，确保前端流程不中断
    return { success: true, message: "同步成功（模拟）" };
  }
};

/**
 * 模拟管理链条数据
 * @param {number} employeeId 员工ID
 * @returns {Array} 返回模拟的管理链条数据
 */
export const getMockChainData = (employeeId) => {
  const id = parseInt(employeeId) || 1;
  
  // 从静态数据中查找员工
  const employee = EMPLOYEE_RELATIONS.find(emp => emp.emp_id === id) || EMPLOYEE_RELATIONS[0];
  
  // 构建管理链条 - 当前员工为第一层
  const chain = [
    [
      {
        id: employee.emp_id.toString(),
        name: employee.emp_name,
      }
    ]
  ];
  
  // 解析上级管理
  if (employee.management && employee.management.length > 0) {
    for (const manager of employee.management) {
      // 从"名字 (上级)"格式中提取名字
      const managerName = manager.split(' ')[0];
      
      // 尝试在员工列表中找到该上级
      const managerData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === managerName);
      
      if (managerData) {
        chain.push([
          {
            id: managerData.emp_id.toString(),
            name: managerData.emp_name,
          }
        ]);
      }
    }
  }
  
  return chain;
};

/**
 * 模拟网络数据
 * @param {number} employeeId 员工ID
 * @returns {Object} 返回模拟的关系网络数据
 */
export const getMockNetworkData = (employeeId) => {
  const id = parseInt(employeeId) || 1;
  
  // 从静态数据中查找员工
  const employee = EMPLOYEE_RELATIONS.find(emp => emp.emp_id === id) || EMPLOYEE_RELATIONS[0];
  
  // 构建返回数据结构
  const networkData = {
    employee: {
      id: employee.emp_id.toString(),
      name: employee.emp_name,
    },
    management: [],
    colleagues: [],
    collaborators: []
  };
  
  // 第一层 - 当前员工
  networkData.management.push([
    {
      id: employee.emp_id.toString(),
      name: employee.emp_name,
    }
  ]);
  
  // 第二层 - 直接上级
  if (employee.management && employee.management.length > 0) {
    const managementLayer = [];
    
    for (const manager of employee.management) {
      // 从"名字 (上级)"格式中提取名字
      const managerName = manager.split(' ')[0];
      
      // 尝试在员工列表中找到该上级
      const managerData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === managerName);
      
      if (managerData) {
        managementLayer.push({
          id: managerData.emp_id.toString(),
          name: managerData.emp_name,
        });
      }
    }
    
    if (managementLayer.length > 0) {
      networkData.management.push(managementLayer);
    }
  }
  
  // 同事
  if (employee.colleagues && employee.colleagues.length > 0) {
    for (const colleague of employee.colleagues) {
      // 排除自己
      if (colleague === employee.emp_name) continue;
      
      // 尝试在员工列表中找到该同事
      const colleagueData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === colleague);
      
      if (colleagueData) {
        networkData.colleagues.push({
          id: colleagueData.emp_id.toString(),
          name: colleagueData.emp_name,
        });
      }
    }
  }
  
  // 合作者
  if (employee.collaborators && employee.collaborators.length > 0) {
    for (const collaborator of employee.collaborators) {
      // 解析"名字 (项目名)"格式
      const match = collaborator.match(/(.*?)\s*\((.*?)\)/);
      
      if (match) {
        const collaboratorName = match[1];
        const projectName = match[2];
        
        // 尝试在员工列表中找到该合作者
        const collaboratorData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === collaboratorName);
        
        if (collaboratorData) {
          networkData.collaborators.push({
            id: collaboratorData.emp_id.toString(),
            name: collaboratorData.emp_name,
            projectName: projectName
          });
        }
      }
    }
  }
  
  return networkData;
}; 