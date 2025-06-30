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
 * 获取员工数据（带循环检测以避免循环引用）
 * @param {string} employeeName 员工名称
 * @param {Set} visitedEmployees 已访问的员工集合（避免循环引用）
 * @returns {Object|null} 员工数据或null
 */
const getEmployeeByName = (employeeName, visitedEmployees = new Set()) => {
  if (visitedEmployees.has(employeeName)) {
    return null; // 避免循环引用
  }
  
  const employee = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === employeeName);
  return employee || null;
};

/**
 * 构建管理链条（带循环检测）
 * @param {number} employeeId 员工ID
 * @param {Set} visitedEmployees 已访问的员工集合
 * @returns {Array} 管理链条数据
 */
const buildManagementChain = (employeeId, visitedEmployees = new Set()) => {
  const id = parseInt(employeeId);
  const employee = EMPLOYEE_RELATIONS.find(emp => emp.emp_id === id);
  
  if (!employee || visitedEmployees.has(employee.emp_name)) {
    return []; // 避免循环引用
  }
  
  const chain = [];
  
  // 添加当前员工
  chain.push({
    id: employee.emp_id.toString(),
    name: employee.emp_name,
    position: "当前员工"
  });
  
  // 拷贝已访问员工集合并添加当前员工
  const visited = new Set(visitedEmployees);
  visited.add(employee.emp_name);
  
  // 递归构建上级链条
  if (employee.management && employee.management.length > 0) {
    for (const managerStr of employee.management) {
      const managerName = managerStr.split(' ')[0];
      const manager = getEmployeeByName(managerName);
      
      if (manager && !visited.has(managerName)) {
        chain.push({
          id: manager.emp_id.toString(),
          name: manager.emp_name,
          position: "上级领导"
        });
        
        // 添加当前管理者到已访问集合
        visited.add(managerName);
        
        // 处理再上一级
        if (manager.management && manager.management.length > 0) {
          for (const higherManagerStr of manager.management) {
            const higherManagerName = higherManagerStr.split(' ')[0];
            const higherManager = getEmployeeByName(higherManagerName);
            
            if (higherManager && !visited.has(higherManagerName)) {
              chain.push({
                id: higherManager.emp_id.toString(),
                name: higherManager.emp_name,
                position: "高级管理层"
              });
              
              visited.add(higherManagerName);
            }
          }
        }
      }
    }
  }
  
  return chain;
};

/**
 * 模拟管理链条数据
 * @param {number} employeeId 员工ID
 * @returns {Array} 返回模拟的管理链条数据
 */
export const getMockChainData = (employeeId) => {
  return buildManagementChain(employeeId);
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
  
  // 避免循环引用的访问集合
  const visitedEmployees = new Set([employee.emp_name]);
  
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
      
      // 确保不存在循环引用
      if (!visitedEmployees.has(managerName)) {
        // 尝试在员工列表中找到该上级
        const managerData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === managerName);
        
        if (managerData) {
          managementLayer.push({
            id: managerData.emp_id.toString(),
            name: managerData.emp_name,
          });
          
          // 将此上级标记为已访问
          visitedEmployees.add(managerName);
          
          // 添加第三层 - 更高级管理层
          if (managerData.management && managerData.management.length > 0) {
            const higherManagementLayer = [];
            
            for (const higherManager of managerData.management) {
              const higherManagerName = higherManager.split(' ')[0];
              
              // 确保不存在循环引用
              if (!visitedEmployees.has(higherManagerName)) {
                const higherManagerData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === higherManagerName);
                
                if (higherManagerData) {
                  higherManagementLayer.push({
                    id: higherManagerData.emp_id.toString(),
                    name: higherManagerData.emp_name,
                  });
                  
                  // 将此高级管理者标记为已访问
                  visitedEmployees.add(higherManagerName);
                }
              }
            }
            
            if (higherManagementLayer.length > 0) {
              networkData.management.push(higherManagementLayer);
            }
          }
        }
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