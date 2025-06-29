import api from "../api";

// 缓存员工数据，避免重复请求
let employeesCache = null;

// 获取员工的部门历史记录
export async function getEmployeeDepartmentHistory(id) {
  try {
    const res = await api.get(`/employee-departments/histries/${id}`);
    return res.data.data || [];
  } catch (err) {
    console.error(`获取员工ID=${id}的历史记录失败:`, err);
    throw err;
  }
}

/**
 * 获取所有员工数据，并缓存结果
 * @returns {Promise<Array>} 员工数据列表
 */
const fetchEmployeesData = async () => {
  if (employeesCache) {
    return employeesCache;
  }

  try {
    const response = await api.get("/employees");

    // 处理可能的不同数据格式
    let employees = [];

    if (Array.isArray(response.data)) {
      employees = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      employees = response.data.data;
    } else {
      console.error("未知的员工API响应格式:", response.data);
      employees = [];
    }

    // 缓存员工数据
    employeesCache = employees.map((emp) => ({
      id: emp.id || emp.emp_id,
      name: emp.name || emp.emp_name || "",
    }));

    return employeesCache;
  } catch (error) {
    console.error("获取员工数据失败:", error);
    return [];
  }
};

/**
 * 获取所有部门列表
 * @returns {Promise} 返回部门列表数据
 */
export const getAllDepartments = async () => {
  try {
    const response = await api.get("/departments");
    console.log("API返回原始数据:", response.data);

    // 处理可能的不同数据格式
    let departments = [];

    if (Array.isArray(response.data)) {
      // 如果直接返回数组
      departments = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      // 如果返回 {code, msg, data} 格式
      departments = response.data.data;
    } else {
      console.error("未知的API响应格式:", response.data);
      departments = [];
    }

    // 打印第一个部门的数据结构
    if (departments.length > 0) {
      console.log(
        "第一个部门数据结构:",
        JSON.stringify(departments[0], null, 2)
      );
    }

    // 获取员工-部门关系数据，用于计算部门员工数量
    let employeeDepartments = [];
    try {
      const edResponse = await api.get("/employee-departments?is_current=1");
      if (Array.isArray(edResponse.data)) {
        employeeDepartments = edResponse.data;
      } else if (
        edResponse.data &&
        edResponse.data.data &&
        Array.isArray(edResponse.data.data)
      ) {
        employeeDepartments = edResponse.data.data;
      }
      console.log(
        "获取到员工-部门关系数据:",
        employeeDepartments.length,
        "条记录"
      );
    } catch (error) {
      console.error("获取员工-部门关系数据失败:", error);
    }

    // 获取所有员工数据，用于查找主管姓名
    const employees = await fetchEmployeesData();

    // 处理字段映射，确保前端需要的字段都存在
    const processedDepartments = departments.map((dept) => {
      // 计算部门员工数量
      const deptId = dept.id || dept.dep_id;
      const deptEmployees = employeeDepartments.filter(
        (ed) => ed.depId === deptId || ed.dep_id === deptId
      );
      const employeeCount = deptEmployees.length;

      // 创建基本部门对象
      const processedDept = {
        id: dept.id || dept.dep_id,
        name: dept.name || dept.dep_name || "",
        managerId: dept.managerId || dept.manager_id,
        parentId: dept.parentId || dept.parent_id,
        employeeCount: employeeCount || dept.employeeCount || 0,
        description: dept.description || "",
        isDeleted: dept.isDeleted === 1 || dept.is_deleted === 1,
        createdAt: dept.createdAt || dept.created_at || "",
      };

      // 确保managerName字段存在
      if (dept.managerName) {
        processedDept.managerName = dept.managerName;
      } else if (dept.manager) {
        processedDept.managerName = dept.manager;
      } else if (dept.managerId) {
        // 如果没有managerName，但有managerId，查找对应的员工姓名
        const manager = employees.find(
          (emp) => emp.id.toString() === dept.managerId.toString()
        );
        processedDept.managerName = manager
          ? manager.name
          : `ID: ${dept.managerId}`;
      } else {
        processedDept.managerName = "未指定";
      }

      // 确保parentName字段存在
      if (dept.parentName) {
        processedDept.parentName = dept.parentName;
      } else {
        // 如果没有parentName，尝试在departments中查找
        if (dept.parentId) {
          const parentDept = departments.find(
            (d) => (d.id || d.dep_id) === dept.parentId
          );
          if (parentDept) {
            processedDept.parentName =
              parentDept.name || parentDept.dep_name || `ID: ${dept.parentId}`;
          } else {
            processedDept.parentName = `ID: ${dept.parentId}`;
          }
        } else {
          processedDept.parentName = null;
        }
      }

      return processedDept;
    });

    console.log("处理后的部门数据:", processedDepartments.length, "条记录");
    return processedDepartments;
  } catch (error) {
    console.error("获取部门列表失败:", error);
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
      throw new Error("未找到部门数据");
    }

    // 获取员工数据，用于查找主管姓名
    const employees = await fetchEmployeesData();

    // 获取部门员工数量和员工列表
    let employeeCount = department.employeeCount || 0;
    let departmentEmployees = [];

    try {
      const edResponse = await api.get(
        `/employee-departments?dep_id=${id}&is_current=1`
      );
      let employeeDepartments = [];

      if (Array.isArray(edResponse.data)) {
        employeeDepartments = edResponse.data;
      } else if (
        edResponse.data &&
        edResponse.data.data &&
        Array.isArray(edResponse.data.data)
      ) {
        employeeDepartments = edResponse.data.data;
      }

      employeeCount = employeeDepartments.length;
      departmentEmployees = employeeDepartments.map((ed) => ({
        id: ed.empId || ed.emp_id,
        name: ed.employeeName || "",
        position: ed.position || "",
      }));
    } catch (error) {
      console.error(`获取部门ID=${id}的员工关系失败:`, error);
    }

    // 处理managerId，获取对应的员工姓名
    const managerId = department.managerId || department.manager_id;
    let managerName = department.managerName || department.manager || "";

    if (!managerName && managerId) {
      const manager = employees.find(
        (emp) => emp.id.toString() === managerId.toString()
      );
      managerName = manager ? manager.name : `ID: ${managerId}`;
    }

    // 处理字段映射
    return {
      id: department.id || department.dep_id,
      name: department.name || department.dep_name || "",
      managerId: managerId,
      managerName: managerName,
      parentId: department.parentId || department.parent_id,
      parentName: department.parentName || "",
      employeeCount: employeeCount,
      departmentEmployees: departmentEmployees,
      description: department.description || "",
      isDeleted: department.isDeleted === 1 || department.is_deleted === 1,
      createdAt: department.createdAt || department.created_at || "",
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
    console.log("创建部门，前端提交数据:", departmentData);

    // 转换为API需要的格式
    const apiData = {
      name: departmentData.name || "",
      parentId: departmentData.parentId === "" ? null : departmentData.parentId,
      managerId:
        departmentData.managerId === "" ? null : departmentData.managerId,
      employeeCount: departmentData.employeeCount || 0,
      description: departmentData.description || "",
    };

    // 确保parentId和managerId是数字或null
    if (apiData.parentId !== null && apiData.parentId !== undefined) {
      const parentId = parseInt(apiData.parentId);
      apiData.parentId = isNaN(parentId) ? null : parentId;
    }

    if (apiData.managerId !== null && apiData.managerId !== undefined) {
      const managerId = parseInt(apiData.managerId);
      apiData.managerId = isNaN(managerId) ? null : managerId;
    }

    console.log("转换后的API数据:", JSON.stringify(apiData, null, 2));

    const response = await api.post("/departments", apiData);

    // 处理响应
    if (response.data && response.data.code === "200") {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }

    throw new Error("创建部门失败");
  } catch (error) {
    console.error("创建部门失败:", error);
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
    console.log(
      "更新部门，前端提交数据:",
      JSON.stringify(departmentData, null, 2)
    );

    // 转换为API需要的格式，特别处理各种类型的值
    const apiData = {
      name: departmentData.name || "",
      parentId: departmentData.parentId === "" ? null : departmentData.parentId,
      managerId:
        departmentData.managerId === "" ? null : departmentData.managerId,
      description: departmentData.description || "",
    };

    // 确保parentId和managerId是数字或null
    if (apiData.parentId !== null && apiData.parentId !== undefined) {
      const parentId = parseInt(apiData.parentId);
      apiData.parentId = isNaN(parentId) ? null : parentId;
    }

    if (apiData.managerId !== null && apiData.managerId !== undefined) {
      const managerId = parseInt(apiData.managerId);
      apiData.managerId = isNaN(managerId) ? null : managerId;
    }

    console.log("转换后的API数据:", JSON.stringify(apiData, null, 2));

    // 确保id是数字类型
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error(`无效的部门ID: ${id}`);
    }

    const response = await api.put(`/departments/${numericId}`, apiData);

    console.log("API响应数据:", JSON.stringify(response.data, null, 2));

    // 处理响应
    if (response.data && response.data.code === "200") {
      return response.data.data;
    } else if (response.data && !response.data.code) {
      return response.data;
    }

    throw new Error("更新部门失败");
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
    if (response.data && response.data.code === "200") {
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
    const response = await api.get("/employees");

    // 处理可能的不同数据格式
    let employees = [];

    if (Array.isArray(response.data)) {
      employees = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      employees = response.data.data;
    } else {
      console.error("未知的员工API响应格式:", response.data);
      employees = [];
    }

    return employees.map((emp) => ({
      id: emp.id || emp.emp_id,
      name: emp.name || emp.emp_name || "",
    }));
  } catch (error) {
    console.error("获取员工列表失败:", error);
    return [];
  }
};
