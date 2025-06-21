const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 9090;

// 配置CORS，允许所有来源
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求体解析
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误捕获:', err);
  res.status(500).json({
    code: '500',
    msg: '服务器内部错误: ' + (err.message || '未知错误'),
    error: err.stack
  });
});

// 捕获未处理的Promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise rejection:', reason);
});

// 捕获未处理的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
});

// 模拟员工数据
const employees = [
  { emp_id: 1, emp_name: '张三', phone: '13800138001', gender: '男', hire_date: '2020-01-01', status: '在职', emp_type: '系统管理员' },
  { emp_id: 2, emp_name: '李四', phone: '13800138002', gender: '男', hire_date: '2020-02-01', status: '在职', emp_type: '高层' },
  { emp_id: 3, emp_name: '王五', phone: '13800138003', gender: '男', hire_date: '2020-03-01', status: '在职', emp_type: '人事专员' },
  { emp_id: 4, emp_name: '赵六', phone: '13800138004', gender: '男', hire_date: '2020-04-01', status: '在职', emp_type: '高层' },
  { emp_id: 5, emp_name: '钱七', phone: '13800138005', gender: '女', hire_date: '2020-05-01', status: '在职', emp_type: '高层' },
  { emp_id: 6, emp_name: '孙八', phone: '13800138006', gender: '女', hire_date: '2020-06-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 7, emp_name: '周九', phone: '13800138007', gender: '男', hire_date: '2020-07-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 8, emp_name: '吴十', phone: '13800138008', gender: '女', hire_date: '2020-08-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 9, emp_name: '郑十一', phone: '13800138009', gender: '男', hire_date: '2020-09-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 10, emp_name: '王十二', phone: '13800138010', gender: '女', hire_date: '2020-10-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 11, emp_name: '李十三', phone: '13800138011', gender: '男', hire_date: '2020-11-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 12, emp_name: '赵十四', phone: '13800138012', gender: '女', hire_date: '2020-12-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 13, emp_name: '钱十五', phone: '13800138013', gender: '男', hire_date: '2021-01-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 14, emp_name: '孙十六', phone: '13800138014', gender: '女', hire_date: '2021-02-01', status: '在职', emp_type: '普通用户' },
  { emp_id: 15, emp_name: '周十七', phone: '13800138015', gender: '男', hire_date: '2021-03-01', status: '在职', emp_type: '普通用户' },
];

// 模拟部门数据
let departments = [
  { 
    dep_id: 1, 
    dep_name: '技术部', 
    parent_id: null,
    manager_id: 1, 
    employeeCount: 45, 
    description: '负责公司所有软件产品的开发和维护',
    is_deleted: 0,
    created_at: '2020-01-15',
    updated_at: '2020-01-15'
  },
  { 
    dep_id: 2, 
    dep_name: '市场部', 
    parent_id: null,
    manager_id: 2, 
    employeeCount: 28, 
    description: '负责产品营销、市场调研和品牌推广',
    is_deleted: 0,
    created_at: '2020-02-20',
    updated_at: '2020-02-20'
  },
  { 
    dep_id: 3, 
    dep_name: '人力资源部', 
    parent_id: null,
    manager_id: 3, 
    employeeCount: 15, 
    description: '负责员工招聘、培训和绩效管理',
    is_deleted: 0,
    created_at: '2020-03-10',
    updated_at: '2020-03-10'
  },
  { 
    dep_id: 4, 
    dep_name: '财务部', 
    parent_id: null,
    manager_id: 4, 
    employeeCount: 12, 
    description: '负责公司财务规划、会计核算和资金管理',
    is_deleted: 0,
    created_at: '2020-04-05',
    updated_at: '2020-04-05'
  },
  { 
    dep_id: 5, 
    dep_name: '产品部', 
    parent_id: null,
    manager_id: 5, 
    employeeCount: 20, 
    description: '负责产品规划、需求分析和产品设计',
    is_deleted: 0,
    created_at: '2020-05-12',
    updated_at: '2020-05-12'
  },
];

// 添加子部门
departments = [
  ...departments,
  { dep_id: 6, dep_name: '前端开发组', parent_id: 1, manager_id: 6, employeeCount: 15, description: '负责前端开发工作', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 7, dep_name: '后端开发组', parent_id: 1, manager_id: 7, employeeCount: 18, description: '负责后端开发工作', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 8, dep_name: '测试组', parent_id: 1, manager_id: 8, employeeCount: 8, description: '负责软件测试工作', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 9, dep_name: '运维组', parent_id: 1, manager_id: 9, employeeCount: 4, description: '负责系统运维工作', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 10, dep_name: '国内市场组', parent_id: 2, manager_id: 10, employeeCount: 12, description: '负责国内市场推广', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 11, dep_name: '国际市场组', parent_id: 2, manager_id: 11, employeeCount: 8, description: '负责国际市场推广', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 12, dep_name: '招聘组', parent_id: 3, manager_id: 12, employeeCount: 6, description: '负责人才招聘', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 13, dep_name: '培训组', parent_id: 3, manager_id: 13, employeeCount: 4, description: '负责员工培训', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 14, dep_name: '会计组', parent_id: 4, manager_id: 14, employeeCount: 6, description: '负责财务会计工作', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { dep_id: 15, dep_name: '审计组', parent_id: 4, manager_id: 15, employeeCount: 5, description: '负责财务审计工作', is_deleted: 0, created_at: '2020-06-15', updated_at: '2020-06-15' },
];

// 获取部门名称
const getDepartmentName = (id) => {
  if (!id) return null;
  const dept = departments.find(d => d.dep_id === parseInt(id));
  return dept ? dept.dep_name : null;
};

// 获取员工名称
const getEmployeeName = (id) => {
  if (!id) return null;
  const emp = employees.find(e => e.emp_id === parseInt(id));
  return emp ? emp.emp_name : null;
};

// 处理部门数据，添加关联信息
const processDepartmentData = (departments) => {
  console.log('处理部门数据，输入数据:', JSON.stringify(departments, null, 2));
  
  try {
    const result = departments.map(dept => {
      try {
        // 获取部门主管名称
        let managerName = null;
        if (dept.manager_id !== null && dept.manager_id !== undefined) {
          console.log(`查找主管，manager_id=${dept.manager_id}，类型=${typeof dept.manager_id}`);
          const manager = employees.find(e => e.emp_id === parseInt(dept.manager_id));
          if (manager) {
            managerName = manager.emp_name;
            console.log(`找到主管: ${managerName}`);
          } else {
            console.log(`未找到主管，manager_id=${dept.manager_id}`);
          }
        } else {
          console.log(`部门 ${dept.dep_name} 没有指定主管`);
        }
        
        // 获取上级部门名称
        let parentName = null;
        if (dept.parent_id !== null && dept.parent_id !== undefined) {
          console.log(`查找上级部门，parent_id=${dept.parent_id}，类型=${typeof dept.parent_id}`);
          const parent = departments.find(d => d.dep_id === parseInt(dept.parent_id));
          if (parent) {
            parentName = parent.dep_name;
            console.log(`找到上级部门: ${parentName}`);
          } else {
            console.log(`未找到上级部门，parent_id=${dept.parent_id}`);
          }
        } else {
          console.log(`部门 ${dept.dep_name} 没有上级部门`);
        }
        
        console.log(`处理部门: ${dept.dep_name}, 主管ID: ${dept.manager_id}, 主管名: ${managerName}, 上级部门ID: ${dept.parent_id}, 上级部门名: ${parentName}`);
        
        // 返回处理后的数据
        const result = {
          dep_id: dept.dep_id,
          id: dept.dep_id, // 兼容前端使用id字段
          dep_name: dept.dep_name,
          name: dept.dep_name, // 兼容前端使用name字段
          parent_id: dept.parent_id,
          parentId: dept.parent_id, // 兼容前端使用parentId字段
          manager_id: dept.manager_id,
          managerId: dept.manager_id, // 兼容前端使用managerId字段
          managerName: managerName,
          parentName: parentName,
          employeeCount: dept.employeeCount || 0,
          description: dept.description || '',
          is_deleted: dept.is_deleted,
          isDeleted: dept.is_deleted === 1, // 兼容前端使用isDeleted字段
          created_at: dept.created_at,
          createdAt: dept.created_at, // 兼容前端使用createdAt字段
          updated_at: dept.updated_at,
          updatedAt: dept.updated_at // 兼容前端使用updatedAt字段
        };
        
        console.log(`处理结果:`, JSON.stringify(result, null, 2));
        return result;
      } catch (err) {
        console.error(`处理部门数据出错:`, err, '部门数据:', dept);
        // 返回基本数据，避免整个处理失败
        return {
          dep_id: dept.dep_id,
          id: dept.dep_id,
          dep_name: dept.dep_name,
          name: dept.dep_name,
          description: dept.description || '',
          is_deleted: dept.is_deleted,
          created_at: dept.created_at,
          updated_at: dept.updated_at
        };
      }
    });
    
    console.log('处理后的部门数据结果:', result.length, '条记录');
    return result;
  } catch (err) {
    console.error('处理部门数据总体失败:', err);
    return departments.map(dept => ({
      dep_id: dept.dep_id,
      id: dept.dep_id,
      dep_name: dept.dep_name,
      name: dept.dep_name
    }));
  }
};

// 获取所有部门
app.get('/departments', (req, res) => {
  console.log('GET /departments - 返回所有部门数据:', departments.length, '条记录');
  
  // 过滤未删除的部门
  const activeDepartments = departments.filter(d => d.is_deleted === 0);
  const processedDepartments = processDepartmentData(activeDepartments);
  
  // 打印处理后的数据
  console.log('处理后的部门数据示例:', JSON.stringify(processedDepartments[0], null, 2));
  
  // 返回符合实际API格式的数据
  res.json({
    code: '200',
    msg: '请求成功',
    data: processedDepartments
  });
});

// 获取单个部门
app.get('/departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const department = departments.find(d => d.dep_id === id && d.is_deleted === 0);
  
  if (!department) {
    console.log(`GET /departments/${id} - 未找到部门`);
    return res.status(404).json({
      code: '404',
      msg: '部门不存在',
      data: null
    });
  }
  
  const processedDepartment = processDepartmentData([department])[0];
  console.log(`GET /departments/${id} - 返回部门信息:`, processedDepartment.name);
  
  res.json({
    code: '200',
    msg: '请求成功',
    data: processedDepartment
  });
});

// 获取所有员工（用于选择部门主管）
app.get('/employees', (req, res) => {
  console.log('GET /employees - 返回所有员工数据:', employees.length, '条记录');
  
  res.json({
    code: '200',
    msg: '请求成功',
    data: employees.map(emp => ({
      emp_id: emp.emp_id,
      emp_name: emp.emp_name,
      id: emp.emp_id, // 兼容前端使用id字段
      name: emp.emp_name // 兼容前端使用name字段
    }))
  });
});

// 创建部门
app.post('/departments', (req, res) => {
  console.log('POST /departments - 请求体:', req.body);
  
  try {
    const now = new Date().toISOString().split('T')[0];
    
    // 检查必填字段
    if (!req.body.name) {
      console.error('POST /departments - 缺少部门名称字段');
      return res.status(400).json({
        code: '400',
        msg: '部门名称不能为空',
        data: null
      });
    }
    
    const newDepartment = {
      dep_id: departments.length > 0 ? Math.max(...departments.map(d => d.dep_id)) + 1 : 1,
      dep_name: req.body.name,
      parent_id: req.body.parentId || null,
      manager_id: req.body.managerId || null,
      employeeCount: req.body.employeeCount || 0,
      description: req.body.description || '',
      is_deleted: 0,
      created_at: now,
      updated_at: now
    };
    
    departments.push(newDepartment);
    console.log('POST /departments - 创建新部门:', newDepartment.dep_name);
    
    const processedDepartment = processDepartmentData([newDepartment])[0];
    
    res.status(201).json({
      code: '200',
      msg: '创建成功',
      data: processedDepartment
    });
  } catch (err) {
    console.error('POST /departments - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 更新部门
app.put('/departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PUT /departments/${id} - 请求体:`, JSON.stringify(req.body, null, 2));
  
  try {
    // 验证id参数
    if (isNaN(id)) {
      console.error(`PUT /departments/${id} - 无效的ID参数`);
      return res.status(400).json({
        code: '400',
        msg: '无效的部门ID',
        data: null
      });
    }
    
    const index = departments.findIndex(d => d.dep_id === id);
    
    if (index === -1) {
      console.log(`PUT /departments/${id} - 未找到部门`);
      return res.status(404).json({
        code: '404',
        msg: '部门不存在',
        data: null
      });
    }
    
    // 打印原始部门数据
    console.log(`PUT /departments/${id} - 原始部门数据:`, JSON.stringify(departments[index], null, 2));
    
    // 安全地获取请求中的字段
    const dep_name = req.body.name !== undefined ? req.body.name : departments[index].dep_name;
    
    // 特别处理parent_id和manager_id，确保null值被正确处理
    let parent_id = departments[index].parent_id;
    if (req.body.parentId !== undefined) {
      parent_id = req.body.parentId;
      console.log(`PUT /departments/${id} - 更新parent_id:`, parent_id);
    }
    
    let manager_id = departments[index].manager_id;
    if (req.body.managerId !== undefined) {
      manager_id = req.body.managerId;
      console.log(`PUT /departments/${id} - 更新manager_id:`, manager_id);
    }
    
    const description = req.body.description !== undefined ? req.body.description : departments[index].description;
    
    // 更新部门信息
    departments[index] = { 
      ...departments[index], 
      dep_name,
      parent_id,
      manager_id,
      description,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    console.log(`PUT /departments/${id} - 更新后的部门数据:`, JSON.stringify(departments[index], null, 2));
    
    try {
      const processedDepartment = processDepartmentData([departments[index]])[0];
      console.log(`PUT /departments/${id} - 处理后的部门数据:`, JSON.stringify(processedDepartment, null, 2));
      
      res.json({
        code: '200',
        msg: '更新成功',
        data: processedDepartment
      });
    } catch (processErr) {
      console.error(`PUT /departments/${id} - 处理部门数据时出错:`, processErr);
      res.status(500).json({
        code: '500',
        msg: '处理部门数据时出错: ' + processErr.message,
        data: null
      });
    }
  } catch (err) {
    console.error(`PUT /departments/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误: ' + err.message,
      data: null
    });
  }
});

// 删除部门
app.delete('/departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = departments.findIndex(d => d.dep_id === id);
  
  if (index === -1) {
    console.log(`DELETE /departments/${id} - 未找到部门`);
    return res.status(404).json({
      code: '404',
      msg: '部门不存在',
      data: null
    });
  }
  
  const deletedDepartment = departments[index];
  
  // 逻辑删除，而不是物理删除
  departments[index] = {
    ...departments[index],
    is_deleted: 1,
    updated_at: new Date().toISOString().split('T')[0]
  };
  
  console.log(`DELETE /departments/${id} - 删除部门:`, deletedDepartment.dep_name);
  
  res.json({
    code: '200',
    msg: '删除成功',
    data: {
      dep_id: deletedDepartment.dep_id,
      dep_name: deletedDepartment.dep_name
    }
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n模拟后端服务器运行在 http://localhost:${PORT}`);
  console.log('可用API端点:');
  console.log('  GET    /departments        - 获取所有部门');
  console.log('  GET    /departments/:id    - 获取单个部门');
  console.log('  POST   /departments        - 创建新部门');
  console.log('  PUT    /departments/:id    - 更新部门');
  console.log('  DELETE /departments/:id    - 删除部门');
  console.log('  GET    /employees          - 获取所有员工');
  console.log('  GET    /health             - 健康检查\n');
}); 