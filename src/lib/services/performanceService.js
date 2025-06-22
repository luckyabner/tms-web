import api from '../api';

/**
 * 获取所有绩效考核列表
 * @returns {Promise} 返回绩效考核列表数据
 */
export const getAllPerformances = async () => {
  try {
    const response = await api.get('/performances');
    console.log('API返回原始绩效考核数据:', response.data);
    
    // 处理可能的不同数据格式
    let performances = [];
    
    if (Array.isArray(response.data)) {
      // 如果直接返回数组
      performances = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // 如果返回 {code, msg, data} 格式
      performances = response.data.data;
    } else {
      console.error('未知的API响应格式:', response.data);
      performances = [];
    }
    
    // 处理字段映射，确保前端需要的字段都存在
    const processedPerformances = performances.map(perf => {
      return {
        id: perf.id || perf.per_id,
        name: perf.name || perf.per_name || '',
        creatorId: perf.creatorId || perf.creator_id,
        creatorName: perf.creatorName || '',
        startDate: perf.startDate || perf.start_date || '',
        endDate: perf.endDate || perf.end_date || '',
        state: perf.state || '未开始',
        description: perf.description || '',
        createdAt: perf.createdAt || perf.created_at || ''
      };
    });
    
    console.log('处理后的绩效考核数据:', processedPerformances.length, '条记录');
    return processedPerformances;
  } catch (error) {
    console.error('获取绩效考核列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个绩效考核详情
 * @param {number} id 绩效考核ID
 * @returns {Promise} 返回绩效考核详情数据
 */
export const getPerformanceById = async (id) => {
  try {
    const response = await api.get(`/performances/${id}`);
    
    // 处理可能的不同数据格式
    let performance = null;
    
    if (response.data && !response.data.code) {
      // 直接返回绩效考核对象
      performance = response.data;
    } else if (response.data && response.data.data) {
      // 返回 {code, msg, data} 格式
      performance = response.data.data;
    }
    
    if (!performance) {
      throw new Error('未找到绩效考核数据');
    }
    
    // 处理字段映射
    const processedPerf = {
      id: performance.id || performance.per_id,
      name: performance.name || performance.per_name || '',
      creatorId: performance.creatorId || performance.creator_id,
      creatorName: performance.creatorName || '',
      startDate: performance.startDate || performance.start_date || '',
      endDate: performance.endDate || performance.end_date || '',
      state: performance.state || '未开始',
      description: performance.description || '',
      createdAt: performance.createdAt || performance.created_at || ''
    };
    
    return processedPerf;
  } catch (error) {
    console.error(`获取绩效考核ID=${id}详情失败:`, error);
    throw error;
  }
};

/**
 * 创建新绩效考核
 * @param {Object} performanceData 绩效考核数据
 * @returns {Promise} 返回创建结果
 */
export const createPerformance = async (performanceData) => {
  try {
    console.log('创建绩效考核，前端提交数据:', performanceData);
    
    // 转换为API需要的格式
    const apiData = {
      per_name: performanceData.name,
      creator_id: performanceData.creatorId,
      start_date: performanceData.startDate,
      end_date: performanceData.endDate,
      state: performanceData.state || '未开始',
      description: performanceData.description || ''
    };
    
    console.log('转换后的API数据:', JSON.stringify(apiData, null, 2));
    
    const response = await api.post('/performances', apiData);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('创建绩效考核失败');
  } catch (error) {
    console.error('创建绩效考核失败:', error);
    throw error;
  }
};

/**
 * 更新绩效考核信息
 * @param {number} id 绩效考核ID
 * @param {Object} performanceData 绩效考核更新数据
 * @returns {Promise} 返回更新结果
 */
export const updatePerformance = async (id, performanceData) => {
  try {
    console.log('更新绩效考核，前端提交数据:', JSON.stringify(performanceData, null, 2));
    
    // 转换为API需要的格式
    const apiData = {
      per_name: performanceData.name,
      start_date: performanceData.startDate,
      end_date: performanceData.endDate,
      state: performanceData.state,
      description: performanceData.description || ''
    };
    
    console.log('转换后的API数据:', JSON.stringify(apiData, null, 2));
    
    // 确保id是数字类型
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error(`无效的绩效考核ID: ${id}`);
    }
    
    const response = await api.put(`/performances/${numericId}`, apiData);
    
    console.log('API响应数据:', JSON.stringify(response.data, null, 2));
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('更新绩效考核失败');
  } catch (error) {
    console.error(`更新绩效考核ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 删除绩效考核
 * @param {number} id 绩效考核ID
 * @returns {Promise} 返回删除结果
 */
export const deletePerformance = async (id) => {
  try {
    const response = await api.delete(`/performances/${id}`);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return { success: true };
    } else if (response.data && response.data.message) {
      return { success: true, message: response.data.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`删除绩效考核ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 获取员工绩效评估列表
 * @returns {Promise} 返回员工绩效评估列表数据
 */
export const getAllEmployeePerformances = async () => {
  try {
    // 获取员工绩效评估数据
    const response = await api.get('/employee-performances');
    console.log('API返回原始员工绩效评估数据:', response.data);
    
    // 处理可能的不同数据格式
    let empPerformances = [];
    
    if (Array.isArray(response.data)) {
      // 如果直接返回数组
      empPerformances = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // 如果返回 {code, msg, data} 格式
      empPerformances = response.data.data;
    } else {
      console.error('未知的API响应格式:', response.data);
      // 使用模拟数据作为后备
      empPerformances = getMockEmployeePerformances();
      console.log('使用模拟数据作为后备:', empPerformances);
    }

    // 获取所有绩效考核数据，用于关联信息
    let performances = [];
    try {
      const perfResponse = await api.get('/performances');
      if (Array.isArray(perfResponse.data)) {
        performances = perfResponse.data;
      } else if (perfResponse.data && perfResponse.data.data && Array.isArray(perfResponse.data.data)) {
        performances = perfResponse.data.data;
      }
      console.log('获取到的绩效考核数据:', performances.length, '条记录');
    } catch (err) {
      console.error('获取绩效考核数据失败:', err);
    }

    // 获取所有员工数据，用于关联信息
    let employees = [];
    try {
      const empResponse = await api.get('/employees');
      if (Array.isArray(empResponse.data)) {
        employees = empResponse.data;
      } else if (empResponse.data && empResponse.data.data && Array.isArray(empResponse.data.data)) {
        employees = empResponse.data.data;
      }
      console.log('获取到的员工数据:', employees.length, '条记录');
    } catch (err) {
      console.error('获取员工数据失败:', err);
    }
    
    // 处理字段映射，确保前端需要的字段都存在
    const processedEmpPerformances = empPerformances.map(empPerf => {
      console.log('处理员工绩效评估数据:', JSON.stringify(empPerf, null, 2));
      
      // 查找关联的绩效考核信息
      const performance = performances.find(p => p.per_id === empPerf.per_id || p.id === empPerf.per_id);
      
      // 查找关联的员工信息
      const employee = employees.find(e => e.emp_id === empPerf.emp_id || e.id === empPerf.emp_id);
      
      // 查找关联的审批人信息
      const approver = employees.find(e => e.emp_id === empPerf.approver_id || e.id === empPerf.approver_id);
      
      // 构建处理后的对象
      const processedEmpPerf = {
        id: empPerf.id,
        employeeId: empPerf.emp_id,
        employeeName: employee ? (employee.emp_name || employee.name) : '未知员工',
        department: employee ? (employee.department || employee.dep_name || '未知部门') : '未知部门',
        position: employee ? (employee.position || employee.emp_position || '未知职位') : '未知职位',
        performanceId: empPerf.per_id,
        performanceName: performance ? (performance.per_name || performance.name || '未知考核') : '未知考核',
        approverId: empPerf.approver_id,
        approverName: approver ? (approver.emp_name || approver.name || '未知评估人') : '未知评估人',
        score: empPerf.score || '-',
        state: empPerf.state || '未完成',
        description: empPerf.description || '',
        startDate: performance ? (performance.start_date || performance.startDate || '') : '',
        endDate: performance ? (performance.end_date || performance.endDate || '') : '',
        createdAt: empPerf.created_at || empPerf.createdAt || ''
      };
      
      console.log('处理后的员工绩效评估数据:', JSON.stringify(processedEmpPerf, null, 2));
      return processedEmpPerf;
    });
    
    console.log('处理后的员工绩效评估数据:', processedEmpPerformances.length, '条记录');
    return processedEmpPerformances;
  } catch (error) {
    console.error('获取员工绩效评估列表失败:', error);
    // 发生错误时返回模拟数据
    const mockData = getMockEmployeePerformances();
    console.log('使用模拟数据作为后备:', mockData);
    return mockData;
  }
};

/**
 * 创建员工绩效评估
 * @param {Object} employeePerformanceData 员工绩效评估数据
 * @returns {Promise} 返回创建结果
 */
export const createEmployeePerformance = async (employeePerformanceData) => {
  try {
    console.log('创建员工绩效评估，前端提交数据:', employeePerformanceData);
    
    // 转换为API需要的格式
    const apiData = {
      approver_id: employeePerformanceData.approverId,
      emp_id: employeePerformanceData.employeeId,
      per_id: employeePerformanceData.performanceId,
      score: employeePerformanceData.score || 0,
      state: employeePerformanceData.state || '未完成',
      description: employeePerformanceData.description || ''
    };
    
    console.log('转换后的API数据:', JSON.stringify(apiData, null, 2));
    
    const response = await api.post('/employee-performances', apiData);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('创建员工绩效评估失败');
  } catch (error) {
    console.error('创建员工绩效评估失败:', error);
    throw error;
  }
};

/**
 * 更新员工绩效评估
 * @param {number} id 员工绩效评估ID
 * @param {Object} employeePerformanceData 员工绩效评估更新数据
 * @returns {Promise} 返回更新结果
 */
export const updateEmployeePerformance = async (id, employeePerformanceData) => {
  try {
    console.log('更新员工绩效评估，前端提交数据:', JSON.stringify(employeePerformanceData, null, 2));
    
    // 转换为API需要的格式
    const apiData = {
      score: employeePerformanceData.score,
      state: employeePerformanceData.state,
      description: employeePerformanceData.description || ''
    };
    
    console.log('转换后的API数据:', JSON.stringify(apiData, null, 2));
    
    // 确保id是数字类型
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error(`无效的员工绩效评估ID: ${id}`);
    }
    
    const response = await api.put(`/employee-performances/${numericId}`, apiData);
    
    console.log('API响应数据:', JSON.stringify(response.data, null, 2));
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('更新员工绩效评估失败');
  } catch (error) {
    console.error(`更新员工绩效评估ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 删除员工绩效评估
 * @param {number} id 员工绩效评估ID
 * @returns {Promise} 返回删除结果
 */
export const deleteEmployeePerformance = async (id) => {
  try {
    const response = await api.delete(`/employee-performances/${id}`);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return { success: true };
    } else if (response.data && response.data.message) {
      return { success: true, message: response.data.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`删除员工绩效评估ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 获取模拟员工绩效评估数据（用于API失败时的后备）
 * @returns {Array} 返回模拟数据
 */
const getMockEmployeePerformances = () => {
  return [
    {
      id: 1,
      employeeId: 1,
      employeeName: "张三",
      department: "技术部",
      position: "前端开发工程师",
      performanceId: 1,
      performanceName: "2024年第一季度绩效考核",
      approverId: 2,
      approverName: "李四",
      score: "85.5",
      state: "已完成",
      description: "表现良好，代码质量高",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      employeeId: 3,
      employeeName: "王五",
      department: "设计部",
      position: "UI/UX设计师",
      performanceId: 2,
      performanceName: "2023年第四季度绩效考核",
      approverId: 4,
      approverName: "赵六",
      score: "92",
      state: "已完成",
      description: "表现优秀，设计创新能力强",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      createdAt: "2023-10-01"
    },
    {
      id: 3,
      employeeId: 2,
      employeeName: "李四",
      department: "产品部",
      position: "产品经理",
      performanceId: 1,
      performanceName: "2024年第一季度绩效考核",
      approverId: 1,
      approverName: "张三",
      score: "88",
      state: "已完成",
      description: "产品规划能力强，执行力高",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      createdAt: "2024-01-01"
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: "赵六",
      department: "技术部",
      position: "后端开发工程师",
      performanceId: 2,
      performanceName: "2023年第四季度绩效考核",
      approverId: 3,
      approverName: "王五",
      score: "95",
      state: "已完成",
      description: "代码质量高，解决问题能力强",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      createdAt: "2023-10-01"
    },
    {
      id: 5,
      employeeId: 5,
      employeeName: "钱七",
      department: "数据部",
      position: "数据分析师",
      performanceId: 1,
      performanceName: "2024年第一季度绩效考核",
      approverId: 6,
      approverName: "孙八",
      score: "87.5",
      state: "已完成",
      description: "数据分析能力强，报告详实",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      createdAt: "2024-01-01"
    }
  ];
}; 