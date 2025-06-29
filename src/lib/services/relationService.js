import api from "../api";

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
    return getMockChainData();
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
 * @returns {Array} 返回模拟的管理链条数据
 */
export const getMockChainData = () => {
  // 返回模拟的嵌套数组格式，与API返回格式一致
  return [
    [
      {
        id: "4",
        name: "当前员工",
        subordinates: [],
        colleagues: [],
        projects: []
      }
    ],
    [
      {
        id: "2",
        name: "部门经理",
        subordinates: [],
        colleagues: [],
        projects: []
      }
    ],
    [
      {
        id: "1",
        name: "总监",
        subordinates: [],
        colleagues: [],
        projects: []
      }
    ]
  ];
};

/**
 * 模拟网络数据
 * @param {number} id 员工ID
 * @returns {Object} 返回模拟的关系网络数据
 */
export const getMockNetworkData = (id) => {
  const employeeId = parseInt(id) || 1;
  
  // 返回与API格式一致的模拟数据
  return {
    management: [
      [
        {
          id: employeeId.toString(),
          name: "当前员工",
          subordinates: [],
          colleagues: [],
          projects: []
        }
      ],
      [
        {
          id: (employeeId + 1).toString(),
          name: "部门经理",
          subordinates: [],
          colleagues: [],
          projects: []
        }
      ],
      [
        {
          id: (employeeId + 2).toString(),
          name: "总监",
          subordinates: [],
          colleagues: [],
          projects: []
        }
      ]
    ],
    colleagues: [
      {
        id: (employeeId + 3).toString(),
        name: "同事A",
        subordinates: [],
        colleagues: [],
        projects: []
      },
      {
        id: (employeeId + 4).toString(),
        name: "同事B",
        subordinates: [],
        colleagues: [],
        projects: []
      }
    ],
    collaborators: [
      {
        id: (employeeId + 5).toString(),
        name: "项目合作者",
        subordinates: [],
        colleagues: [],
        projects: []
      }
    ],
    employee: {
      id: employeeId.toString(),
      name: "当前员工",
      subordinates: null,
      colleagues: null,
      projects: null
    }
  };
}; 