import api from '../api';

/**
 * 获取所有员工列表
 * @returns {Promise} 返回员工列表数据
 */
export const getAllEmployees = async () => {
  try {
    const response = await api.get('/employees');
    console.log('API返回原始员工数据:', response.data);
    
    // 处理可能的不同数据格式
    let employees = [];
    
    if (Array.isArray(response.data)) {
      // 如果直接返回数组
      employees = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // 如果返回 {code, msg, data} 格式
      employees = response.data.data;
    } else {
      console.error('未知的API响应格式:', response.data);
      employees = [];
    }
    
    // 处理字段映射，确保前端需要的字段都存在
    const processedEmployees = employees.map(emp => {
      // 创建基本员工对象
      const processedEmp = {
        id: emp.id || emp.emp_id,
        name: emp.name || emp.emp_name || '',
        position: emp.position || emp.emp_position || '',
        department: emp.department || emp.dep_name || '',
        departmentId: emp.departmentId || emp.dep_id || null,
        phone: emp.phone || '',
        role: emp.role || emp.empType || emp.emp_type || '普通员工',
        status: emp.status || '在职',
        gender: emp.gender || '无',
        hireDate: emp.hireDate || emp.hire_date || '',
        education: emp.education || '未知',
        school: emp.school || ''
      };
      
      // 确保角色名称一致性
      if (processedEmp.role === '普通用户') {
        processedEmp.role = '普通员工';
      } else if (processedEmp.role === '高层') {
        processedEmp.role = '公司高层';
      }
      
      console.log(`员工角色映射: ${emp.empType || emp.emp_type || emp.role || '无'} -> ${processedEmp.role}`);
      
      return processedEmp;
    });
    
    console.log('处理后的员工数据:', processedEmployees.length, '条记录');
    return processedEmployees;
  } catch (error) {
    console.error('获取员工列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个员工详情
 * @param {number} id 员工ID
 * @returns {Promise} 返回员工详情数据
 */
export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`);
    
    // 处理可能的不同数据格式
    let employee = null;
    
    if (response.data && !response.data.code) {
      // 直接返回员工对象
      employee = response.data;
    } else if (response.data && response.data.data) {
      // 返回 {code, msg, data} 格式
      employee = response.data.data;
    }
    
    if (!employee) {
      throw new Error('未找到员工数据');
    }
    
    // 处理字段映射
    const processedEmp = {
      id: employee.id || employee.emp_id,
      name: employee.name || employee.emp_name || '',
      position: employee.position || employee.emp_position || '',
      department: employee.department || employee.dep_name || '',
      departmentId: employee.departmentId || employee.dep_id || null,
      phone: employee.phone || '',
      role: employee.role || employee.empType || employee.emp_type || '普通员工',
      status: employee.status || '在职',
      gender: employee.gender || '无',
      hireDate: employee.hireDate || employee.hire_date || '',
      education: employee.education || '未知',
      school: employee.school || ''
    };
    
    // 确保角色名称一致性
    if (processedEmp.role === '普通用户') {
      processedEmp.role = '普通员工';
    } else if (processedEmp.role === '高层') {
      processedEmp.role = '公司高层';
    }
    
    console.log(`获取员工详情，角色: ${employee.empType || employee.emp_type || employee.role || '无'} -> ${processedEmp.role}`);
    
    return processedEmp;
  } catch (error) {
    console.error(`获取员工ID=${id}详情失败:`, error);
    throw error;
  }
};

/**
 * 创建新员工
 * @param {Object} employeeData 员工数据
 * @returns {Promise} 返回创建结果
 */
export const createEmployee = async (employeeData) => {
  try {
    console.log('创建员工，前端提交数据:', employeeData);
    
    // 转换为API需要的格式
    const apiData = {
      name: employeeData.name || '',
      position: employeeData.position || '',
      departmentId: employeeData.departmentId || null,
      phone: employeeData.phone || '',
      empType: employeeData.role || '普通员工',
      status: employeeData.status || '在职',
      gender: employeeData.gender || '无',
      hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0],
      education: employeeData.education || '未知',
      school: employeeData.school || ''
    };
    
    // 确保角色名称与后端一致
    if (apiData.empType === '普通员工') {
      apiData.empType = '普通用户';
    } else if (apiData.empType === '公司高层') {
      apiData.empType = '高层';
    }
    
    console.log('转换后的API数据:', JSON.stringify(apiData, null, 2));
    
    const response = await api.post('/employees', apiData);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('创建员工失败');
  } catch (error) {
    console.error('创建员工失败:', error);
    throw error;
  }
};

/**
 * 更新员工信息
 * @param {number} id 员工ID
 * @param {Object} employeeData 员工更新数据
 * @returns {Promise} 返回更新结果
 */
export const updateEmployee = async (id, employeeData) => {
  try {
    console.log('更新员工，前端提交数据:', JSON.stringify(employeeData, null, 2));
    
    // 转换为API需要的格式
    const apiData = {
      name: employeeData.name || '',
      position: employeeData.position || '',
      departmentId: employeeData.departmentId === '' ? null : employeeData.departmentId,
      phone: employeeData.phone || '',
      empType: employeeData.role || '普通员工',
      status: employeeData.status || '在职',
      gender: employeeData.gender || '无',
      hireDate: employeeData.hireDate || '',
      education: employeeData.education || '未知',
      school: employeeData.school || ''
    };
    
    // 确保角色名称与后端一致
    if (apiData.empType === '普通员工') {
      apiData.empType = '普通用户';
    } else if (apiData.empType === '公司高层') {
      apiData.empType = '高层';
    }
    
    console.log('转换后的API数据:', JSON.stringify(apiData, null, 2));
    
    // 确保departmentId是数字或null
    if (apiData.departmentId !== null && apiData.departmentId !== undefined) {
      const departmentId = parseInt(apiData.departmentId);
      apiData.departmentId = isNaN(departmentId) ? null : departmentId;
    }
    
    // 确保id是数字类型
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error(`无效的员工ID: ${id}`);
    }
    
    const response = await api.put(`/employees/${numericId}`, apiData);
    
    console.log('API响应数据:', JSON.stringify(response.data, null, 2));
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('更新员工失败');
  } catch (error) {
    console.error(`更新员工ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 删除员工
 * @param {number} id 员工ID
 * @returns {Promise} 返回删除结果
 */
export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return { success: true };
    } else if (response.data && response.data.message) {
      return { success: true, message: response.data.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`删除员工ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 获取所有部门列表（用于选择员工所属部门）
 * @returns {Promise} 返回部门列表数据
 */
export const getAllDepartments = async () => {
  try {
    const response = await api.get('/departments');
    
    // 处理可能的不同数据格式
    let departments = [];
    
    if (Array.isArray(response.data)) {
      departments = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      departments = response.data.data;
    } else {
      console.error('未知的部门API响应格式:', response.data);
      departments = [];
    }
    
    return departments.map(dept => ({
      id: dept.id || dept.dep_id,
      name: dept.name || dept.dep_name || '',
    }));
  } catch (error) {
    console.error('获取部门列表失败:', error);
    return [];
  }
}; 