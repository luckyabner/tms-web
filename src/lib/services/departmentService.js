import api from '../api';

/**
 * 获取所有部门列表
 * @returns {Promise} 返回部门列表数据
 */
export const getAllDepartments = async () => {
  try {
    const response = await api.get('/departments');
    console.log('API返回原始数据:', response.data);
    
    // 处理可能的不同数据格式
    let departments = [];
    
    if (Array.isArray(response.data)) {
      // 如果直接返回数组
      departments = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // 如果返回 {code, msg, data} 格式
      departments = response.data.data;
    } else {
      console.error('未知的API响应格式:', response.data);
      departments = [];
    }
    
    // 打印第一个部门的数据结构
    if (departments.length > 0) {
      console.log('第一个部门数据结构:', JSON.stringify(departments[0], null, 2));
    }
    
    // 处理字段映射，确保前端需要的字段都存在
    const processedDepartments = departments.map(dept => {
      // 创建基本部门对象
      const processedDept = {
        id: dept.id || dept.dep_id,
        name: dept.name || dept.dep_name || '',
        managerId: dept.managerId || dept.manager_id,
        parentId: dept.parentId || dept.parent_id,
        employeeCount: dept.employeeCount || 0,
        description: dept.description || '',
        isDeleted: dept.isDeleted === 1 || dept.is_deleted === 1,
        createdAt: dept.createdAt || dept.created_at || ''
      };
      
      // 确保managerName字段存在
      if (dept.managerName) {
        processedDept.managerName = dept.managerName;
      } else if (dept.manager) {
        processedDept.managerName = dept.manager;
      } else {
        // 如果没有managerName，根据managerId生成一个临时值
        processedDept.managerName = dept.managerId ? `ID: ${dept.managerId}` : '未指定';
      }
      
      // 确保parentName字段存在
      if (dept.parentName) {
        processedDept.parentName = dept.parentName;
      } else {
        // 如果没有parentName，尝试在departments中查找
        if (dept.parentId) {
          const parentDept = departments.find(d => (d.id || d.dep_id) === dept.parentId);
          if (parentDept) {
            processedDept.parentName = parentDept.name || parentDept.dep_name || `ID: ${dept.parentId}`;
          } else {
            processedDept.parentName = `ID: ${dept.parentId}`;
          }
        } else {
          processedDept.parentName = null;
        }
      }
      
      return processedDept;
    });
    
    console.log('处理后的部门数据:', processedDepartments.length, '条记录');
    return processedDepartments;
  } catch (error) {
    console.error('获取部门列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个部门详情
 * @param {number} id 部门ID
 * @returns {Promise} 返回部门详情数据
 */
export const getDepartmentById = async (id) => {
  try {
    const response = await api.get(`/departments/${id}`);
    
    // 处理可能的不同数据格式
    let department = null;
    
    if (response.data && !response.data.code) {
      // 直接返回部门对象
      department = response.data;
    } else if (response.data && response.data.data) {
      // 返回 {code, msg, data} 格式
      department = response.data.data;
    }
    
    if (!department) {
      throw new Error('未找到部门数据');
    }
    
    // 处理字段映射
    return {
      id: department.id || department.dep_id,
      name: department.name || department.dep_name || '',
      managerId: department.managerId || department.manager_id,
      managerName: department.managerName || department.manager || '',
      parentId: department.parentId || department.parent_id,
      parentName: department.parentName || '',
      employeeCount: department.employeeCount || 0,
      description: department.description || '',
      isDeleted: department.isDeleted === 1 || department.is_deleted === 1,
      createdAt: department.createdAt || department.created_at || ''
    };
  } catch (error) {
    console.error(`获取部门ID=${id}详情失败:`, error);
    throw error;
  }
};

/**
 * 创建新部门
 * @param {Object} departmentData 部门数据
 * @returns {Promise} 返回创建结果
 */
export const createDepartment = async (departmentData) => {
  try {
    // 转换为API需要的格式
    const apiData = {
      dep_name: departmentData.name,
      parent_id: departmentData.parentId || null,
      manager_id: departmentData.managerId || null,
      description: departmentData.description || ''
    };
    
    const response = await api.post('/departments', apiData);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('创建部门失败');
  } catch (error) {
    console.error('创建部门失败:', error);
    throw error;
  }
};

/**
 * 更新部门信息
 * @param {number} id 部门ID
 * @param {Object} departmentData 部门更新数据
 * @returns {Promise} 返回更新结果
 */
export const updateDepartment = async (id, departmentData) => {
  try {
    // 转换为API需要的格式
    const apiData = {
      dep_name: departmentData.name,
      parent_id: departmentData.parentId || null,
      manager_id: departmentData.managerId || null,
      description: departmentData.description || ''
    };
    
    const response = await api.put(`/departments/${id}`, apiData);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }
    
    throw new Error('更新部门失败');
  } catch (error) {
    console.error(`更新部门ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 删除部门
 * @param {number} id 部门ID
 * @returns {Promise} 返回删除结果
 */
export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`);
    
    // 处理响应
    if (response.data && response.data.code === '200') {
      return { success: true };
    } else if (response.data && response.data.message) {
      return { success: true, message: response.data.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`删除部门ID=${id}失败:`, error);
    throw error;
  }
};

/**
 * 获取所有员工列表（用于选择部门主管）
 * @returns {Promise} 返回员工列表数据
 */
export const getAllEmployees = async () => {
  try {
    const response = await api.get('/employees');
    
    // 处理可能的不同数据格式
    let employees = [];
    
    if (Array.isArray(response.data)) {
      employees = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      employees = response.data.data;
    } else {
      console.error('未知的员工API响应格式:', response.data);
      employees = [];
    }
    
    return employees.map(emp => ({
      id: emp.id || emp.emp_id,
      name: emp.name || emp.emp_name || '',
    }));
  } catch (error) {
    console.error('获取员工列表失败:', error);
    return [];
  }
}; 