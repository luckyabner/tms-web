import api from "../api";

/**
 * 获取所有员工列表
 * @returns {Promise} 返回员工列表数据
 */
export async function getAllEmployees() {
  try {
    console.log("正在获取所有员工数据...");
    const res = await api.get("/employees/details");
    
    // 处理API返回的数据
    let employees = [];
    
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      employees = res.data.data;
    } else if (Array.isArray(res.data)) {
      employees = res.data;
    } else {
      console.error("未知的员工API响应格式:", res.data);
      return [];
    }
    
    // 确保员工数据包含部门信息
    console.log(`获取到 ${employees.length} 名员工数据`);
    
    // 尝试获取员工部门关系数据
    try {
      const deptRes = await api.get("/employee-departments?is_current=1");
      let employeeDepartments = [];
      
      if (deptRes.data && deptRes.data.data && Array.isArray(deptRes.data.data)) {
        employeeDepartments = deptRes.data.data;
      } else if (Array.isArray(deptRes.data)) {
        employeeDepartments = deptRes.data;
      }
      
      console.log(`获取到 ${employeeDepartments.length} 条员工-部门关系数据`);
      
      // 获取所有部门信息
      const deptsRes = await api.get("/departments");
      let departments = [];
      
      if (deptsRes.data && deptsRes.data.data && Array.isArray(deptsRes.data.data)) {
        departments = deptsRes.data.data;
      } else if (Array.isArray(deptsRes.data)) {
        departments = deptsRes.data;
      }
      
      console.log(`获取到 ${departments.length} 个部门数据`);
      
      // 为每个员工添加部门信息
      const processedEmployees = employees.map(emp => {
        // 查找员工的当前部门关系
        const empDept = employeeDepartments.find(
          ed => (ed.empId === emp.id || ed.emp_id === emp.id) && 
                (ed.isCurrent === 1 || ed.is_current === 1)
        );
        
        if (empDept) {
          // 查找部门名称
          const department = departments.find(
            dept => dept.id === (empDept.depId || empDept.dep_id)
          );
          
          return {
            ...emp,
            departmentId: empDept.depId || empDept.dep_id,
            departmentName: department ? (department.name || department.dep_name) : "未知部门",
            position: empDept.position || emp.position || "",
          };
        }
        
        return emp;
      });
      
      console.log("处理后的员工数据包含部门信息");
      return processedEmployees;
      
    } catch (deptError) {
      console.error("获取员工部门关系失败，返回原始员工数据:", deptError);
      return employees;
    }
  } catch (err) {
    console.error("获取员工数据失败:", err);
    return [];
  }
}

/**
 * 获取单个员工详情
 * @param {number} id 员工ID
 * @returns {Promise} 返回员工详情数据
 */
export const getEmployeeById = async (id) => {
  try {
    const res = await api.get(`/employees/details/${id}`);
    return res.data.data || {};
  } catch (error) {
    console.error(`获取员工ID=${id}详情失败:`, error);
    throw error;
  }
};

export async function getEmployeesByDepartment(departmentId) {
  try {
    const res = await api.get(
      `/employee-departments/departments/${departmentId}`
    );
    return res.data.data || [];
  } catch (err) {
    console.error("Error fetching employees by department:", err);
    throw err;
  }
}

/**
 * 创建新员工
 * @param {Object} employeeData 员工数据
 * @returns {Promise} 返回创建结果
 */
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/employees/with-department", employeeData);

    return response.data.data || response.data;
  } catch (error) {
    console.error("创建员工失败:", error);
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
    console.log(
      "updateEmployee 接收到的数据:",
      JSON.stringify(employeeData, null, 2)
    );

    const response = await api.put(
      `/employees/with-department/${id}`,
      employeeData
    );

    console.log("API 响应:", JSON.stringify(response.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error(`更新员工ID=${id}失败:`, error);
    if (error.response) {
      console.error(
        "API 错误详情:",
        error.response.status,
        error.response.data
      );
    }
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
    await api.delete(`/employees/${id}`);
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
    const response = await api.get("/departments");

    // 处理可能的不同数据格式
    let departments = [];

    if (Array.isArray(response.data)) {
      departments = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      departments = response.data.data;
    } else {
      console.error("未知的部门API响应格式:", response.data);
      departments = [];
    }

    return departments.map((dept) => ({
      id: dept.id || dept.dep_id,
      name: dept.name || dept.dep_name || "",
    }));
  } catch (error) {
    console.error("获取部门列表失败:", error);
    return [];
  }
};

/**
 * 获取所有人事调动申请
 * @returns {Promise} 返回所有人事调动申请列表
 */
export const getAllTransfers = async () => {
  try {
    const response = await api.get("/employee-departments");
    // 处理可能的不同数据格式
    let transfers = [];
    if (Array.isArray(response.data)) {
      transfers = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      transfers = response.data.data;
    } else {
      console.error("未知的API响应格式:", response.data);
      transfers = [];
    }

    // 获取所有员工、部门、所有employee_department历史
    const employees = await getAllEmployees();
    const departmentsResponse = await api.get("/departments");
    let departments = [];
    if (Array.isArray(departmentsResponse.data)) {
      departments = departmentsResponse.data;
    } else if (
      departmentsResponse.data &&
      departmentsResponse.data.data &&
      Array.isArray(departmentsResponse.data.data)
    ) {
      departments = departmentsResponse.data.data;
    }
    // 获取所有employee_department历史（不加is_current参数）
    let allEmpDeps = [];
    try {
      const allEmpDepsResp = await api.get("/employee-departments");
      if (Array.isArray(allEmpDepsResp.data)) {
        allEmpDeps = allEmpDepsResp.data;
      } else if (
        allEmpDepsResp.data &&
        allEmpDepsResp.data.data &&
        Array.isArray(allEmpDepsResp.data.data)
      ) {
        allEmpDeps = allEmpDepsResp.data.data;
      }
    } catch (e) {
      allEmpDeps = [];
    }

    // 处理字段映射，添加员工姓名、部门名称、原部门/职位
    const processedTransfers = transfers.map((transfer) => {
      const employee = employees.find((emp) => emp.id === transfer.empId);
      const department = departments.find(
        (dept) => dept.id === transfer.depId || dept.dep_id === transfer.depId
      );
      const creator = employees.find((emp) => emp.id === transfer.creatorId);
      // 新部门/职位
      const newDepartmentName = department
        ? department.name || department.dep_name
        : `部门ID: ${transfer.depId}`;
      const newPosition = transfer.position || "";
      // 查找原部门/职位（该员工当前的部门和职位）
      let oldEmpDep = null;
      // 首先尝试找到当前的部门和职位
      const currentEmpDeps = allEmpDeps.filter(
        (ed) =>
          (ed.empId === transfer.empId || ed.emp_id === transfer.empId) &&
          (ed.isCurrent === 1 || ed.is_current === 1)
      );

      if (currentEmpDeps.length > 0) {
        oldEmpDep = currentEmpDeps[0]; // 使用当前的部门作为"原部门"
      } else {
        // 如果没有当前部门，则尝试找到最新的历史记录
        const empDeps = allEmpDeps.filter(
          (ed) =>
            (ed.empId === transfer.empId || ed.emp_id === transfer.empId) &&
            (ed.isCurrent === 0 || ed.is_current === 0)
        );
        if (empDeps.length > 0) {
          // 取最新的（createdAt最大）
          oldEmpDep = empDeps.reduce((a, b) =>
            new Date(
              a.updatedAt || a.updated_at || a.createdAt || a.created_at
            ) >
            new Date(b.updatedAt || b.updated_at || b.createdAt || b.created_at)
              ? a
              : b
          );
        }
      }

      let oldDepartmentName = "";
      let oldPosition = "";
      if (oldEmpDep) {
        const oldDept = departments.find(
          (dept) => dept.id === (oldEmpDep.depId || oldEmpDep.dep_id)
        );
        oldDepartmentName = oldDept
          ? oldDept.name || oldDept.dep_name
          : `部门ID: ${oldEmpDep.depId || oldEmpDep.dep_id}`;
        oldPosition = oldEmpDep.position || "";
      }
      // 查找员工当前部门
      let currentDepartment = null;
      const empDept = employees.find((emp) => emp.id === transfer.empId);
      if (empDept && empDept.department) {
        currentDepartment = empDept.department;
      }
      return {
        id: transfer.id,
        empId: transfer.empId,
        employeeName: employee ? employee.name : `员工ID: ${transfer.empId}`,
        depId: transfer.depId,
        departmentName: newDepartmentName,
        currentDepartment: currentDepartment || "未分配",
        position: newPosition,
        oldDepartmentName: oldDepartmentName || "未知",
        oldPosition: oldPosition || "未知",
        superiorId: transfer.superiorId,
        creatorId: transfer.creatorId,
        creatorName: creator ? creator.name : `创建者ID: ${transfer.creatorId}`,
        state: transfer.state || "待审批",
        approverId: transfer.approverId,
        description: transfer.description || "",
        createdAt: transfer.createdAt || transfer.created_at || "",
        updatedAt: transfer.updatedAt || transfer.updated_at || "",
      };
    });
    return processedTransfers;
  } catch (error) {
    console.error("获取人事调动申请失败:", error);
    throw error;
  }
};

/**
 * 获取待审批的人事调动申请
 * @returns {Promise} 返回待审批的人事调动申请列表
 */
export const getPendingTransfers = async () => {
  try {
    const response = await api.get("/employee-departments/pending-transfers");

    // 处理可能的不同数据格式
    let transfers = [];

    if (Array.isArray(response.data)) {
      transfers = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      transfers = response.data.data;
    } else {
      console.error("未知的API响应格式:", response.data);
      transfers = [];
    }

    // 获取员工数据和部门数据，用于填充名称
    const employees = await getAllEmployees();
    const departmentsResponse = await api.get("/departments");
    let departments = [];

    if (Array.isArray(departmentsResponse.data)) {
      departments = departmentsResponse.data;
    } else if (
      departmentsResponse.data &&
      departmentsResponse.data.data &&
      Array.isArray(departmentsResponse.data.data)
    ) {
      departments = departmentsResponse.data.data;
    }

    // 处理字段映射，添加员工姓名和部门名称
    const processedTransfers = transfers.map((transfer) => {
      const employee = employees.find((emp) => emp.id === transfer.empId);
      const department = departments.find(
        (dept) => dept.id === transfer.depId || dept.dep_id === transfer.depId
      );
      const creator = employees.find((emp) => emp.id === transfer.creatorId);

      // 查找员工当前部门
      let currentDepartment = null;
      const empDept = employees.find((emp) => emp.id === transfer.empId);
      if (empDept && empDept.department) {
        currentDepartment = empDept.department;
      }

      return {
        id: transfer.id,
        empId: transfer.empId,
        employeeName: employee ? employee.name : `员工ID: ${transfer.empId}`,
        depId: transfer.depId,
        departmentName: department
          ? department.name || department.dep_name
          : `部门ID: ${transfer.depId}`,
        currentDepartment: currentDepartment || "未分配",
        position: transfer.position || "",
        superiorId: transfer.superiorId,
        creatorId: transfer.creatorId,
        creatorName: creator ? creator.name : `创建者ID: ${transfer.creatorId}`,
        state: transfer.state || "待审批",
        approverId: transfer.approverId,
        description: transfer.description || "",
        createdAt: transfer.createdAt || transfer.created_at || "",
        updatedAt: transfer.updatedAt || transfer.updated_at || "",
      };
    });

    return processedTransfers;
  } catch (error) {
    console.error("获取待审批的人事调动申请失败:", error);
    throw error;
  }
};

/**
 * 审批人事调动申请
 * @param {number} id 人事调动申请ID
 * @param {Object} approvalData 审批数据
 * @returns {Promise} 返回审批结果
 */
export const approveTransfer = async (id, approvalData) => {
  try {
    console.log(`审批人事调动申请ID=${id}, 数据:`, approvalData);

    // 确保所有字段使用正确的命名约定
    const apiData = {
      state: approvalData.state,
      approverId: approvalData.approverId,
      description: approvalData.description || "",
      position: approvalData.position || "",
      // 将isCurrent转换为is_current，确保是数字类型
      is_current:
        typeof approvalData.isCurrent === "boolean"
          ? approvalData.isCurrent
            ? 1
            : 0
          : approvalData.isCurrent || 0,
      // 添加必要的字段
      superior_id: approvalData.superiorId || null,
      dep_id: approvalData.depId || null,
    };

    console.log("格式化后的API数据:", apiData);

    const response = await api.put(`/employee-departments/${id}`, apiData);

    if (response.status >= 200 && response.status < 300) {
      return true;
    } else {
      throw new Error("审批失败");
    }
  } catch (error) {
    console.error(`审批人事调动申请ID=${id}失败:`, error);
    if (error.response) {
      console.error("错误详情:", error.response.status, error.response.data);
    }
    throw error;
  }
};
