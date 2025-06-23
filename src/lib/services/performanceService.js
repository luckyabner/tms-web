import api from '../api';

/**
 * 获取所有绩效考核列表
 * @returns {Promise} 返回绩效考核列表数据
 */
export const getAllPerformances = async () => {
  try {
    console.log('从API获取绩效考核数据');
    const response = await api.get('/performances');
    console.log('API返回原始绩效考核数据:', response.data);
    
    // 处理API返回的数据格式
    let performances = [];
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // 标准API格式: {code, msg, data: [...]}
      performances = response.data.data;
    } else if (Array.isArray(response.data)) {
      // 直接返回数组格式
      performances = response.data;
    } else {
      console.error('未知的API响应格式:', response.data);
      throw new Error('API返回未知格式的数据');
    }
    
    // 处理字段映射，确保前端需要的字段都存在
    const processedPerformances = performances.map(perf => {
      return {
        id: perf.id || perf.per_id,
        name: perf.name || perf.perName || perf.per_name || '',
        creatorId: perf.creatorId || perf.creator_id,
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
 * 获取模拟绩效考核数据（用于API失败时的后备）
 * @returns {Array} 返回模拟数据
 */
const getMockPerformances = () => {
  return [
    {
      id: 1,
      per_id: 1,
      name: "未知考核",
      per_name: "未知考核",
      creatorId: 3,
      creator_id: 3,
      creatorName: "张三",
      startDate: "2023-01-01",
      start_date: "2023-01-01",
      endDate: "2023-03-31",
      end_date: "2023-03-31",
      state: "已结束",
      description: "2023年第一季度绩效考核",
      is_deleted: 0,
      created_at: "2022-12-15",
      createdAt: "2022-12-15",
      updated_at: "2023-04-05",
      updatedAt: "2023-04-05"
    }
  ];
};

/**
 * 获取单个绩效考核详情
 * @param {number} id 绩效考核ID
 * @returns {Promise} 返回绩效考核详情数据
 */
export const getPerformanceById = async (id) => {
  try {
    console.log(`获取绩效考核ID=${id}详情`);
    const response = await api.get(`/performances/${id}`);
    console.log(`API返回绩效考核ID=${id}详情:`, response.data);
    
    // 处理可能的不同数据格式
    let performance = null;
    
    if (response.data && response.data.data) {
      // 标准API格式: {code, msg, data: {...}}
      performance = response.data.data;
    } else if (response.data && !response.data.code) {
      // 直接返回对象格式
      performance = response.data;
    } else {
      throw new Error('未找到绩效考核数据');
    }
    
    // 处理字段映射
    const processedPerf = {
      id: performance.id || performance.per_id,
      name: performance.name || performance.perName || performance.per_name || '',
      creatorId: performance.creatorId || performance.creator_id,
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
 * 获取所有员工绩效评估列表
 * @returns {Promise} 返回员工绩效评估列表数据
 */
export const getAllEmployeePerformances = async () => {
  try {
    console.log('从API获取员工绩效评估数据');
    const response = await api.get('/employee-performances');
    console.log('API返回原始员工绩效评估数据:', response.data);
    
    // 处理API返回的数据格式
    let empPerformances = [];
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // 标准API格式: {code, msg, data: [...]}
      empPerformances = response.data.data;
    } else if (Array.isArray(response.data)) {
      // 直接返回数组格式
      empPerformances = response.data;
    } else {
      console.error('未知的API响应格式:', response.data);
      console.log('使用模拟数据作为后备');
      empPerformances = getMockEmployeePerformances();
    }
    
    if (empPerformances.length === 0) {
      console.log('API返回的数据为空，使用模拟数据');
      empPerformances = getMockEmployeePerformances();
    }
    
    // 获取员工数据，用于关联信息
    let employees = [];
    try {
      const empResponse = await api.get('/employees');
      if (empResponse.data && empResponse.data.data) {
        if (Array.isArray(empResponse.data.data)) {
          employees = empResponse.data.data;
        } else if (empResponse.data.data.records && Array.isArray(empResponse.data.data.records)) {
          employees = empResponse.data.data.records;
        }
      } else if (Array.isArray(empResponse.data)) {
        employees = empResponse.data;
      }
      console.log('获取到的员工数据:', employees.length, '条记录');
    } catch (err) {
      console.error('获取员工数据失败:', err);
      // 如果获取员工数据失败，使用模拟员工数据
      employees = [
        { emp_id: 1, emp_name: '张三', gender: '男', position: 'IT管理员', department: '技术部' },
        { emp_id: 2, emp_name: '李四', gender: '男', position: '部门经理', department: '市场部' },
        { emp_id: 3, emp_name: '王五', gender: '男', position: '人力资源专员', department: '人力资源部' },
        { emp_id: 4, emp_name: '赵六', gender: '男', position: '部门经理', department: '财务部' },
        { emp_id: 5, emp_name: '钱七', gender: '女', position: '部门经理', department: '产品部' }
      ];
    }
    
    // 获取绩效考核数据，用于关联信息
    let performances = [];
    try {
      const perfResponse = await api.get('/performances');
      if (perfResponse.data && perfResponse.data.data && Array.isArray(perfResponse.data.data)) {
        performances = perfResponse.data.data;
      } else if (Array.isArray(perfResponse.data)) {
        performances = perfResponse.data;
      }
      console.log('获取到的绩效考核数据:', performances.length, '条记录', performances);
    } catch (err) {
      console.error('获取绩效考核数据失败:', err);
      // 如果获取绩效考核数据失败，使用模拟绩效考核数据
      performances = getMockPerformances();
    }
    
    if (performances.length === 0) {
      console.log('绩效考核数据为空，使用模拟数据');
      performances = getMockPerformances();
    }
    
    // 处理员工绩效评估数据，添加关联信息
    const processedEmpPerformances = empPerformances.map(empPerf => {
      // 根据API文档，字段名为empId, perId, approverId等
      const empId = empPerf.empId || empPerf.emp_id;
      const perId = empPerf.perId || empPerf.per_id;
      const approverId = empPerf.approverId || empPerf.approver_id;
      
      // 查找关联的员工信息
      const employee = employees.find(e => e.id === empId || e.emp_id === empId);
      
      // 查找关联的绩效考核信息
      const performance = performances.find(p => p.id === perId || p.per_id === perId);
      console.log('找到绩效考核:', performance);
      
      // 查找关联的评估人信息
      const approver = employees.find(e => e.id === approverId || e.emp_id === approverId);
      
      // 构建处理后的对象
      return {
        id: empPerf.id,
        employeeId: empId,
        employeeName: employee ? (employee.name || employee.emp_name || '未知员工') : '未知员工',
        department: employee ? (employee.departmentName || employee.department || '未知部门') : '未知部门',
        position: employee ? (employee.position || '未知职位') : '未知职位',
        performanceId: perId,
        performanceName: performance ? (performance.name || performance.per_name || '未知考核') : '未知考核',
        approverId: approverId,
        approverName: approver ? (approver.name || approver.emp_name || '未知评估人') : '未知评估人',
        score: empPerf.score || '-',
        state: empPerf.state || '未完成',
        description: empPerf.description || '',
        startDate: performance ? (performance.startDate || performance.start_date || '') : '',
        endDate: performance ? (performance.endDate || performance.end_date || '') : '',
        createdAt: empPerf.createdAt || empPerf.created_at || '',
        gender: employee ? (employee.gender || '') : ''
      };
    });
    
    console.log('处理后的员工绩效评估数据:', processedEmpPerformances.length, '条记录');
    return processedEmpPerformances;
  } catch (error) {
    console.error('获取员工绩效评估列表失败:', error);
    console.log('使用模拟数据作为后备');
    // 发生错误时返回模拟数据
    return getMockEmployeePerformances().map(item => ({
      ...item,
      performanceName: getMockPerformances()[0].per_name || '2023年第一季度绩效考核'
    }));
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
      department: "未知部门",
      position: "未知职位",
      performanceId: 1,
      performanceName: "未知考核",
      approverId: 2,
      approverName: "张三",
      score: "85.5",
      state: "已完成",
      description: "表现良好，代码质量高",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      createdAt: "2023-01-01"
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: "张三",
      department: "未知部门",
      position: "未知职位",
      performanceId: 1,
      performanceName: "未知考核",
      approverId: 2,
      approverName: "张三",
      score: "92",
      state: "已完成",
      description: "表现优秀，设计创新能力强",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      createdAt: "2023-01-01"
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: "张三",
      department: "未知部门",
      position: "未知职位",
      performanceId: 1,
      performanceName: "未知考核",
      approverId: 3,
      approverName: "张三",
      score: "88",
      state: "已完成",
      description: "产品规划能力强，执行力高",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      createdAt: "2023-01-01"
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: "张三",
      department: "未知部门",
      position: "未知职位",
      performanceId: 1,
      performanceName: "未知考核",
      approverId: 3,
      approverName: "张三",
      score: "95",
      state: "已完成",
      description: "代码质量高，解决问题能力强",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      createdAt: "2023-01-01"
    },
    {
      id: 5,
      employeeId: 5,
      employeeName: "张三",
      department: "未知部门",
      position: "未知职位",
      performanceId: 1,
      performanceName: "未知考核",
      approverId: 5,
      approverName: "张三",
      score: "87.5",
      state: "已完成",
      description: "数据分析能力强，报告详实",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      createdAt: "2023-01-01"
    }
  ];
}; 