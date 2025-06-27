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
  { emp_id: 1, emp_name: '张三', phone: '13800138001', gender: '男', hire_date: '2020-01-01', status: '在职', emp_type: '系统管理员', education: '本科生', school: '北京大学', position: 'IT管理员' },
  { emp_id: 2, emp_name: '李四', phone: '13800138002', gender: '男', hire_date: '2020-02-01', status: '在职', emp_type: '高层', education: '硕士', school: '清华大学', position: '部门经理' },
  { emp_id: 3, emp_name: '王五', phone: '13800138003', gender: '男', hire_date: '2020-03-01', status: '在职', emp_type: '人事专员', education: '本科生', school: '复旦大学', position: '人力资源专员' },
  { emp_id: 4, emp_name: '赵六', phone: '13800138004', gender: '男', hire_date: '2020-04-01', status: '在职', emp_type: '高层', education: '硕士', school: '上海交大', position: '部门经理' },
  { emp_id: 5, emp_name: '钱七', phone: '13800138005', gender: '女', hire_date: '2020-05-01', status: '在职', emp_type: '高层', education: '博士', school: '浙江大学', position: '部门经理' },
  { emp_id: 6, emp_name: '孙八', phone: '13800138006', gender: '女', hire_date: '2020-06-01', status: '在职', emp_type: '普通用户', education: '本科生', school: '南京大学', position: '前端开发工程师' },
  { emp_id: 7, emp_name: '周九', phone: '13800138007', gender: '男', hire_date: '2020-07-01', status: '在职', emp_type: '人事专员', education: '本科生', school: '武汉大学', position: '人力资源专员' },
  { emp_id: 8, emp_name: '吴十', phone: '13800138008', gender: '女', hire_date: '2020-08-01', status: '在职', emp_type: '人事专员', education: '大专', school: '深圳职业技术学院', position: '人力资源专员' },
  { emp_id: 9, emp_name: '郑十一', phone: '13800138009', gender: '男', hire_date: '2020-09-01', status: '离职', emp_type: '普通用户', education: '本科生', school: '中山大学', position: '测试工程师' },
  { emp_id: 10, emp_name: '王十二', phone: '13800138010', gender: '女', hire_date: '2020-10-01', status: '在职', emp_type: '普通用户', education: '硕士', school: '华南理工大学', position: '产品经理' },
  { emp_id: 11, emp_name: '李十三', phone: '13800138011', gender: '男', hire_date: '2020-11-01', status: '借调', emp_type: '普通用户', education: '本科生', school: '厦门大学', position: '运维工程师' },
  { emp_id: 12, emp_name: '赵十四', phone: '13800138012', gender: '女', hire_date: '2020-12-01', status: '在职', emp_type: '普通用户', education: '本科生', school: '四川大学', position: '数据分析师' },
  { emp_id: 13, emp_name: '钱十五', phone: '13800138013', gender: '男', hire_date: '2021-01-01', status: '在职', emp_type: '普通用户', education: '硕士', school: '重庆大学', position: '算法工程师' },
  { emp_id: 14, emp_name: '孙十六', phone: '13800138014', gender: '女', hire_date: '2021-02-01', status: '离职', emp_type: '普通用户', education: '大专', school: '广州大学', position: '市场专员' },
  { emp_id: 15, emp_name: '周十七', phone: '13800138015', gender: '男', hire_date: '2021-03-01', status: '在职', emp_type: '普通用户', education: '本科生', school: '天津大学', position: '财务专员' },
  { emp_id: 16, emp_name: '张无忌', phone: '13800138016', gender: '男', hire_date: '2021-04-01', status: '在职', emp_type: '系统管理员', education: '硕士', school: '华中科技大学', position: '系统架构师' },
];

// 模拟员工-部门关系数据
const employeeDepartments = [
  { id: 1, emp_id: 1, dep_id: 1, position: 'IT管理员', is_current: 1, created_at: '2020-01-15', updated_at: '2020-01-15' },
  { id: 2, emp_id: 2, dep_id: 2, position: '部门经理', is_current: 1, created_at: '2020-02-20', updated_at: '2020-02-20' },
  { id: 3, emp_id: 3, dep_id: 3, position: '人力资源专员', is_current: 1, created_at: '2020-03-10', updated_at: '2020-03-10' },
  { id: 4, emp_id: 4, dep_id: 4, position: '部门经理', is_current: 1, created_at: '2020-04-05', updated_at: '2020-04-05' },
  { id: 5, emp_id: 5, dep_id: 5, position: '部门经理', is_current: 1, created_at: '2020-05-12', updated_at: '2020-05-12' },
  { id: 6, emp_id: 6, dep_id: 6, position: '前端开发工程师', is_current: 1, created_at: '2020-06-15', updated_at: '2020-06-15' },
  { id: 7, emp_id: 7, dep_id: 3, position: '人力资源专员', is_current: 1, created_at: '2020-07-01', updated_at: '2020-07-01' },
  { id: 8, emp_id: 8, dep_id: 3, position: '人力资源专员', is_current: 1, created_at: '2020-08-01', updated_at: '2020-08-01' },
  { id: 9, emp_id: 9, dep_id: 8, position: '测试工程师', is_current: 0, created_at: '2020-09-01', updated_at: '2023-01-01' },
  { id: 10, emp_id: 10, dep_id: 5, position: '产品经理', is_current: 1, created_at: '2020-10-01', updated_at: '2020-10-01' },
  { id: 11, emp_id: 11, dep_id: 9, position: '运维工程师', is_current: 1, created_at: '2020-11-01', updated_at: '2020-11-01' },
  { id: 12, emp_id: 12, dep_id: 5, position: '数据分析师', is_current: 1, created_at: '2020-12-01', updated_at: '2020-12-01' },
  { id: 13, emp_id: 13, dep_id: 7, position: '算法工程师', is_current: 1, created_at: '2021-01-01', updated_at: '2021-01-01' },
  { id: 14, emp_id: 14, dep_id: 10, position: '市场专员', is_current: 0, created_at: '2021-02-01', updated_at: '2023-03-01' },
  { id: 15, emp_id: 15, dep_id: 4, position: '财务专员', is_current: 1, created_at: '2021-03-01', updated_at: '2021-03-01' },
  { id: 16, emp_id: 16, dep_id: 1, position: '系统架构师', is_current: 1, created_at: '2021-04-01', updated_at: '2021-04-01' },
  // 历史记录
  { id: 17, emp_id: 9, dep_id: 6, position: '前端开发工程师', is_current: 0, created_at: '2019-05-01', updated_at: '2020-09-01' },
  { id: 18, emp_id: 14, dep_id: 2, position: '市场助理', is_current: 0, created_at: '2020-07-01', updated_at: '2021-02-01' },
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

// 模拟绩效考核数据
let performances = [
  {
    per_id: 1,
    creator_id: 3,
    per_name: '2023年第一季度绩效考核',
    start_date: '2023-01-01',
    end_date: '2023-03-31',
    state: '已结束',
    description: '2023年第一季度全公司绩效考核',
    is_deleted: 0,
    created_at: '2022-12-15',
    updated_at: '2023-04-05'
  },
  {
    per_id: 2,
    creator_id: 3,
    per_name: '2023年第二季度绩效考核',
    start_date: '2023-04-01',
    end_date: '2023-06-30',
    state: '已结束',
    description: '2023年第二季度全公司绩效考核',
    is_deleted: 0,
    created_at: '2023-03-15',
    updated_at: '2023-07-05'
  },
  {
    per_id: 3,
    creator_id: 3,
    per_name: '2023年第三季度绩效考核',
    start_date: '2023-07-01',
    end_date: '2023-09-30',
    state: '已结束',
    description: '2023年第三季度全公司绩效考核',
    is_deleted: 0,
    created_at: '2023-06-15',
    updated_at: '2023-10-05'
  },
  {
    per_id: 4,
    creator_id: 3,
    per_name: '2023年第四季度绩效考核',
    start_date: '2023-10-01',
    end_date: '2023-12-31',
    state: '已结束',
    description: '2023年第四季度全公司绩效考核',
    is_deleted: 0,
    created_at: '2023-09-15',
    updated_at: '2024-01-05'
  },
  {
    per_id: 5,
    creator_id: 3,
    per_name: '2024年第一季度绩效考核',
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    state: '已结束',
    description: '2024年第一季度全公司绩效考核',
    is_deleted: 0,
    created_at: '2023-12-15',
    updated_at: '2024-04-05'
  }
];

// 模拟员工绩效评估数据
let employeePerformances = [
  {
    id: 1,
    approver_id: 3,
    emp_id: 1,
    per_id: 1,
    score: 85.5,
    state: '已完成',
    description: '工作表现良好，技术能力强，团队协作有待提高',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 2,
    approver_id: 3,
    emp_id: 2,
    per_id: 1,
    score: 92.0,
    state: '已完成',
    description: '工作表现优秀，管理能力突出，团队建设成效显著',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 3,
    approver_id: 3,
    emp_id: 3,
    per_id: 1,
    score: 88.0,
    state: '已完成',
    description: '工作认真负责，招聘工作完成良好，培训计划执行到位',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 4,
    approver_id: 3,
    emp_id: 4,
    per_id: 1,
    score: 95.0,
    state: '已完成',
    description: '工作表现突出，财务管理严谨，成本控制效果显著',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 5,
    approver_id: 1,
    emp_id: 5,
    per_id: 1,
    score: 87.5,
    state: '已完成',
    description: '产品规划合理，需求分析到位，产品迭代速度有待提高',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 6,
    approver_id: 6,
    emp_id: 1,
    per_id: 2,
    score: 86.0,
    state: '已完成',
    description: '第二季度工作表现稳定，系统维护及时',
    is_deleted: 0,
    created_at: '2023-07-01',
    updated_at: '2023-07-01'
  },
  {
    id: 7,
    approver_id: 3,
    emp_id: 6,
    per_id: 1,
    score: 82.5,
    state: '已完成',
    description: '前端开发工作完成良好，代码质量有待提高',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 8,
    approver_id: 3,
    emp_id: 7,
    per_id: 1,
    score: 84.0,
    state: '已完成',
    description: '人力资源工作基本到位，流程优化有待加强',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 9,
    approver_id: 3,
    emp_id: 8,
    per_id: 1,
    score: 79.5,
    state: '已完成',
    description: '基础工作扎实，创新意识不足',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  },
  {
    id: 10,
    approver_id: 3,
    emp_id: 10,
    per_id: 1,
    score: 90.0,
    state: '已完成',
    description: '市场拓展成效显著，客户满意度高',
    is_deleted: 0,
    created_at: '2023-04-01',
    updated_at: '2023-04-01'
  }
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

// 获取绩效考核名称
const getPerformanceName = (id) => {
  if (!id) return null;
  const perf = performances.find(p => p.per_id === parseInt(id));
  return perf ? p.per_name : null;
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

// 处理绩效考核数据，添加关联信息
const processPerformanceData = (performances) => {
  try {
    return performances.map(perf => {
      try {
        // 获取创建者名称
        const creatorName = getEmployeeName(perf.creator_id);
        
        return {
          per_id: perf.per_id,
          id: perf.per_id, // 兼容前端使用id字段
          per_name: perf.per_name,
          name: perf.per_name, // 兼容前端使用name字段
          creator_id: perf.creator_id,
          creatorId: perf.creator_id, // 兼容前端使用creatorId字段
          creatorName: creatorName,
          start_date: perf.start_date,
          startDate: perf.start_date, // 兼容前端使用startDate字段
          end_date: perf.end_date,
          endDate: perf.end_date, // 兼容前端使用endDate字段
          state: perf.state,
          description: perf.description || '',
          is_deleted: perf.is_deleted,
          isDeleted: perf.is_deleted === 1, // 兼容前端使用isDeleted字段
          created_at: perf.created_at,
          createdAt: perf.created_at, // 兼容前端使用createdAt字段
          updated_at: perf.updated_at,
          updatedAt: perf.updated_at // 兼容前端使用updatedAt字段
        };
      } catch (err) {
        console.error(`处理绩效考核数据出错:`, err, '绩效考核数据:', perf);
        // 返回基本数据，避免整个处理失败
        return {
          per_id: perf.per_id,
          id: perf.per_id,
          per_name: perf.per_name,
          name: perf.per_name,
          description: perf.description || '',
          is_deleted: perf.is_deleted,
          created_at: perf.created_at,
          updated_at: perf.updated_at
        };
      }
    });
  } catch (err) {
    console.error('处理绩效考核数据总体失败:', err);
    return performances.map(perf => ({
      per_id: perf.per_id,
      id: perf.per_id,
      per_name: perf.per_name,
      name: perf.per_name
    }));
  }
};

// 处理员工绩效评估数据，添加关联信息
const processEmployeePerformanceData = (empPerformances) => {
  try {
    return empPerformances.map(empPerf => {
      try {
        // 获取员工信息
        const employee = employees.find(e => e.emp_id === empPerf.emp_id);
        // 获取绩效考核信息
        const performance = performances.find(p => p.per_id === empPerf.per_id);
        // 获取审批人信息
        const approver = employees.find(e => e.emp_id === empPerf.approver_id);
        
        // 获取员工部门信息
        const empDepartment = departments.find(d => {
          // 这里简化处理，实际应该查询employee_department表
          return d.manager_id === empPerf.emp_id;
        });

        // 为不同员工分配合理的部门
        let departmentName = '未知部门';
        let position = employee ? employee.position || '未知职位' : '未知职位';
        
        // 根据员工ID分配部门
        switch(empPerf.emp_id) {
          case 1:
            departmentName = '技术部';
            position = 'IT管理员';
            break;
          case 2:
            departmentName = '市场部';
            position = '部门经理';
            break;
          case 3:
            departmentName = '人力资源部';
            position = '人力资源专员';
            break;
          case 4:
            departmentName = '财务部';
            position = '部门经理';
            break;
          case 5:
            departmentName = '产品部';
            position = '部门经理';
            break;
          case 6:
            departmentName = '前端开发组';
            position = '前端开发工程师';
            break;
          case 7:
            departmentName = '人力资源部';
            position = '人力资源专员';
            break;
          case 8:
            departmentName = '人力资源部';
            position = '人力资源专员';
            break;
          case 9:
            departmentName = '测试组';
            position = '测试工程师';
            break;
          case 10:
            departmentName = '产品部';
            position = '产品经理';
            break;
          default:
            // 如果有部门关联信息，使用它
            departmentName = empDepartment ? empDepartment.dep_name : '未知部门';
        }
        
        return {
          id: empPerf.id,
          approver_id: empPerf.approver_id,
          approverId: empPerf.approver_id, // 兼容前端使用approverId字段
          approverName: approver ? approver.emp_name : '张三',
          emp_id: empPerf.emp_id,
          employeeId: empPerf.emp_id, // 兼容前端使用employeeId字段
          employeeName: employee ? employee.emp_name : '张三',
          department: departmentName,
          position: position,
          per_id: empPerf.per_id,
          performanceId: empPerf.per_id, // 兼容前端使用performanceId字段
          performanceName: performance ? performance.per_name : '2023年第一季度绩效考核',
          score: empPerf.score,
          state: empPerf.state,
          description: empPerf.description || '',
          startDate: performance ? performance.start_date : '2023-01-01',
          endDate: performance ? performance.end_date : '2023-03-31',
          is_deleted: empPerf.is_deleted,
          isDeleted: empPerf.is_deleted === 1, // 兼容前端使用isDeleted字段
          created_at: empPerf.created_at,
          createdAt: empPerf.created_at, // 兼容前端使用createdAt字段
          updated_at: empPerf.updated_at,
          updatedAt: empPerf.updated_at // 兼容前端使用updatedAt字段
        };
      } catch (err) {
        console.error(`处理员工绩效评估数据出错:`, err, '员工绩效评估数据:', empPerf);
        // 返回基本数据，避免整个处理失败
        return {
          id: empPerf.id,
          emp_id: empPerf.emp_id,
          per_id: empPerf.per_id,
          score: empPerf.score,
          state: empPerf.state,
          description: empPerf.description || '',
          is_deleted: empPerf.is_deleted,
          created_at: empPerf.created_at,
          updated_at: empPerf.updated_at
        };
      }
    });
  } catch (err) {
    console.error('处理员工绩效评估数据总体失败:', err);
    return empPerformances.map(empPerf => ({
      id: empPerf.id,
      emp_id: empPerf.emp_id,
      per_id: empPerf.per_id,
      score: empPerf.score,
      state: empPerf.state
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

// 获取所有员工
app.get('/employees', (req, res) => {
  console.log('GET /employees - 返回所有员工数据:', employees.length, '条记录');
  
  const processedEmployees = employees.map(e => ({
    id: e.emp_id,
    name: e.emp_name,
    gender: e.gender,
    phone: e.phone,
    role: e.emp_type,
    position: e.position || '',
    status: e.status,
    department: e.departmentId ? 
      (departments.find(d => d.dep_id === parseInt(e.departmentId))?.dep_name || '未知部门') : 
      '未分配',
    departmentId: e.departmentId,
    hireDate: e.hire_date,
    birthDate: e.birth_date,
    education: e.education,
    school: e.school
  }));
  
  res.json({
    code: '200',
    msg: '获取成功',
    data: processedEmployees
  });
});

// 获取单个员工
app.get('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const employee = employees.find(e => e.emp_id === id);
  
  if (!employee) {
    console.log(`GET /employees/${id} - 未找到员工`);
    return res.status(404).json({
      code: '404',
      msg: '员工不存在',
      data: null
    });
  }
  
  // 查找员工所属部门
  const department = departments.find(d => {
    // 检查部门的员工列表中是否包含该员工
    return d.employeeCount > 0 && d.manager_id === employee.emp_id;
  });
  
  // 确保角色名称正确映射
  let role = employee.emp_type;
  if (role === '普通用户') {
    role = '普通员工';
  } else if (role === '高层') {
    role = '公司高层';
  }
  
  console.log(`获取员工 ${employee.emp_name} 的角色: ${employee.emp_type} -> ${role}`);
  
  const employeeWithDetails = {
    ...employee,
    id: employee.emp_id,
    name: employee.emp_name,
    role: role,
    department: department ? department.dep_name : '未分配',
    departmentId: department ? department.dep_id : null
  };
  
  console.log(`GET /employees/${id} - 返回员工信息:`, employeeWithDetails.emp_name, `角色: ${employeeWithDetails.role}`);
  
  res.json({
    code: '200',
    msg: '请求成功',
    data: employeeWithDetails
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

// 创建员工
app.post('/employees', (req, res) => {
  console.log('POST /employees - 请求体:', JSON.stringify(req.body, null, 2));
  
  try {
    // 检查必填字段
    if (!req.body.name) {
      console.error('POST /employees - 缺少员工姓名字段');
      return res.status(400).json({
        code: '400',
        msg: '员工姓名不能为空',
        data: null
      });
    }
    
    // 处理角色映射，确保与数据库一致
    let emp_type = req.body.empType || req.body.role || '普通用户';
    console.log(`创建员工，接收到的角色: ${emp_type}`);
    
    const newEmployee = {
      emp_id: employees.length > 0 ? Math.max(...employees.map(e => e.emp_id)) + 1 : 1,
      emp_name: req.body.name,
      phone: req.body.phone || '',
      gender: req.body.gender || '男',
      birth_date: req.body.birthDate || new Date().toISOString().split('T')[0],
      hire_date: req.body.hireDate || new Date().toISOString().split('T')[0],
      status: req.body.status || '在职',
      emp_type: emp_type,
      education: req.body.education || '本科',
      school: req.body.school || '',
      position: req.body.position || '',
      description: req.body.description || '',
      departmentId: req.body.departmentId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: 0
    };
    
    console.log('POST /employees - 创建的新员工对象:', JSON.stringify(newEmployee, null, 2));
    
    // 如果指定了部门，更新部门员工数量
    if (newEmployee.departmentId) {
      const departmentIndex = departments.findIndex(d => d.dep_id === parseInt(newEmployee.departmentId));
      if (departmentIndex !== -1) {
        departments[departmentIndex].employeeCount += 1;
      }
    }
    
    employees.push(newEmployee);
    console.log('POST /employees - 创建新员工成功:', newEmployee.emp_name);
    console.log('POST /employees - 当前员工总数:', employees.length);
    
    // 角色映射回前端格式
    let role = newEmployee.emp_type;
    if (role === '普通用户') {
      role = '普通员工';
    } else if (role === '高层') {
      role = '公司高层';
    }
    
    // 构建返回数据
    const responseEmployee = {
      id: newEmployee.emp_id,
      emp_id: newEmployee.emp_id,
      name: newEmployee.emp_name,
      emp_name: newEmployee.emp_name,
      role: role,
      gender: newEmployee.gender,
      phone: newEmployee.phone,
      position: newEmployee.position,
      status: newEmployee.status,
      hireDate: newEmployee.hire_date,
      hire_date: newEmployee.hire_date,
      birthDate: newEmployee.birth_date,
      birth_date: newEmployee.birth_date,
      education: newEmployee.education,
      school: newEmployee.school,
      department: newEmployee.departmentId ? 
        (departments.find(d => d.dep_id === parseInt(newEmployee.departmentId))?.dep_name || '未知部门') : 
        '未分配',
      departmentId: newEmployee.departmentId
    };
    
    res.status(201).json({
      code: '200',
      msg: '创建成功',
      data: responseEmployee
    });
  } catch (err) {
    console.error('POST /employees - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误: ' + (err.message || '未知错误'),
      data: null
    });
  }
});

// 更新员工
app.put('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PUT /employees/${id} - 请求体:`, JSON.stringify(req.body, null, 2));
  
  try {
    // 验证id参数
    if (isNaN(id)) {
      console.error(`PUT /employees/${id} - 无效的ID参数`);
      return res.status(400).json({
        code: '400',
        msg: '无效的员工ID',
        data: null
      });
    }
    
    const index = employees.findIndex(e => e.emp_id === id);
    
    if (index === -1) {
      console.log(`PUT /employees/${id} - 未找到员工`);
      return res.status(404).json({
        code: '404',
        msg: '员工不存在',
        data: null
      });
    }
    
    // 打印原始员工数据
    console.log(`PUT /employees/${id} - 原始员工数据:`, JSON.stringify(employees[index], null, 2));
    
    // 安全地获取请求中的字段
    const emp_name = req.body.name !== undefined ? req.body.name : employees[index].emp_name;
    const phone = req.body.phone !== undefined ? req.body.phone : employees[index].phone;
    const gender = req.body.gender !== undefined ? req.body.gender : employees[index].gender;
    const hire_date = req.body.hireDate !== undefined ? req.body.hireDate : employees[index].hire_date;
    const status = req.body.status !== undefined ? 
      (req.body.status === 'active' ? '在职' : '离职') : 
      employees[index].status;
    
    // 处理角色，保持与数据库一致
    const emp_type = req.body.role !== undefined ? req.body.role : employees[index].emp_type;
    console.log(`更新员工角色: ${emp_type}`);
    
    const position = req.body.position !== undefined ? req.body.position : employees[index].position;
    const email = req.body.email !== undefined ? req.body.email : employees[index].email;
    
    // 处理部门变更
    let departmentId = employees[index].departmentId;
    if (req.body.departmentId !== undefined) {
      // 如果原来有部门，减少原部门的员工数量
      if (employees[index].departmentId) {
        const oldDepartmentIndex = departments.findIndex(d => d.dep_id === parseInt(employees[index].departmentId));
        if (oldDepartmentIndex !== -1 && departments[oldDepartmentIndex].employeeCount > 0) {
          departments[oldDepartmentIndex].employeeCount -= 1;
        }
      }
      
      departmentId = req.body.departmentId;
      
      // 如果新分配了部门，增加新部门的员工数量
      if (departmentId) {
        const newDepartmentIndex = departments.findIndex(d => d.dep_id === parseInt(departmentId));
        if (newDepartmentIndex !== -1) {
          departments[newDepartmentIndex].employeeCount += 1;
        }
      }
    }
    
    // 更新员工信息
    employees[index] = { 
      ...employees[index], 
      emp_name,
      phone,
      gender,
      hire_date,
      status,
      emp_type,
      position,
      email,
      departmentId
    };
    
    console.log(`PUT /employees/${id} - 更新后的员工数据:`, JSON.stringify(employees[index], null, 2));
    
    // 确保角色名称正确映射回前端格式
    let role = emp_type;
    if (role === '普通用户') {
      role = '普通员工';
    } else if (role === '高层') {
      role = '公司高层';
    }
    
    // 构建返回数据
    const responseEmployee = {
      ...employees[index],
      id: employees[index].emp_id,
      name: employees[index].emp_name,
      role: role,
      department: employees[index].departmentId ? 
        (departments.find(d => d.dep_id === parseInt(employees[index].departmentId))?.dep_name || '未知部门') : 
        '未分配'
    };
    
    res.json({
      code: '200',
      msg: '更新成功',
      data: responseEmployee
    });
  } catch (err) {
    console.error(`PUT /employees/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误: ' + err.message,
      data: null
    });
  }
});

// 删除员工
app.delete('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(e => e.emp_id === id);
  
  if (index === -1) {
    console.log(`DELETE /employees/${id} - 未找到员工`);
    return res.status(404).json({
      code: '404',
      msg: '员工不存在',
      data: null
    });
  }
  
  const deletedEmployee = employees[index];
  
  // 如果员工有关联的部门，更新部门员工数量
  if (deletedEmployee.departmentId) {
    const departmentIndex = departments.findIndex(d => d.dep_id === parseInt(deletedEmployee.departmentId));
    if (departmentIndex !== -1 && departments[departmentIndex].employeeCount > 0) {
      departments[departmentIndex].employeeCount -= 1;
    }
  }
  
  // 从员工列表中移除
  employees.splice(index, 1);
  
  console.log(`DELETE /employees/${id} - 删除员工:`, deletedEmployee.emp_name);
  
  res.json({
    code: '200',
    msg: '删除成功',
    data: {
      emp_id: deletedEmployee.emp_id,
      emp_name: deletedEmployee.emp_name
    }
  });
});

// 获取所有绩效考核
app.get('/performances', (req, res) => {
  try {
    console.log('GET /performances - 获取所有绩效考核');
    
    // 过滤掉已删除的绩效考核
    const activePerformances = performances.filter(p => p.is_deleted === 0);
    
    // 处理绩效考核数据，添加关联信息
    const processedPerformances = processPerformanceData(activePerformances);
    
    console.log(`GET /performances - 返回 ${processedPerformances.length} 条绩效考核记录`);
    
    res.json(processedPerformances);
  } catch (err) {
    console.error('GET /performances - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 获取单个绩效考核
app.get('/performances/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`GET /performances/${id} - 获取单个绩效考核`);
    
    const performance = performances.find(p => p.per_id === id && p.is_deleted === 0);
    
    if (!performance) {
      console.log(`GET /performances/${id} - 未找到绩效考核`);
      return res.status(404).json({
        code: '404',
        msg: '绩效考核不存在',
        data: null
      });
    }
    
    // 处理绩效考核数据，添加关联信息
    const [processedPerformance] = processPerformanceData([performance]);
    
    console.log(`GET /performances/${id} - 返回绩效考核:`, processedPerformance.name);
    
    res.json(processedPerformance);
  } catch (err) {
    console.error(`GET /performances/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 创建绩效考核
app.post('/performances', (req, res) => {
  try {
    console.log('POST /performances - 请求体:', req.body);
    
    // 检查必填字段
    if (!req.body.per_name && !req.body.name) {
      console.error('POST /performances - 缺少绩效考核名称字段');
      return res.status(400).json({
        code: '400',
        msg: '绩效考核名称不能为空',
        data: null
      });
    }
    
    if (!req.body.creator_id && !req.body.creatorId) {
      console.error('POST /performances - 缺少创建者ID字段');
      return res.status(400).json({
        code: '400',
        msg: '创建者ID不能为空',
        data: null
      });
    }
    
    if (!req.body.start_date && !req.body.startDate) {
      console.error('POST /performances - 缺少开始日期字段');
      return res.status(400).json({
        code: '400',
        msg: '开始日期不能为空',
        data: null
      });
    }
    
    if (!req.body.end_date && !req.body.endDate) {
      console.error('POST /performances - 缺少结束日期字段');
      return res.status(400).json({
        code: '400',
        msg: '结束日期不能为空',
        data: null
      });
    }
    
    const newPerformance = {
      per_id: performances.length > 0 ? Math.max(...performances.map(p => p.per_id)) + 1 : 1,
      creator_id: req.body.creator_id || req.body.creatorId,
      per_name: req.body.per_name || req.body.name,
      start_date: req.body.start_date || req.body.startDate,
      end_date: req.body.end_date || req.body.endDate,
      state: req.body.state || '未开始',
      description: req.body.description || '',
      is_deleted: 0,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    // 自动设置状态
    const currentDate = new Date().toISOString().split('T')[0];
    if (newPerformance.start_date > currentDate) {
      newPerformance.state = '未开始';
    } else if (newPerformance.end_date < currentDate) {
      newPerformance.state = '已结束';
    } else {
      newPerformance.state = '进行中';
    }
    
    performances.push(newPerformance);
    
    console.log('POST /performances - 创建新绩效考核:', newPerformance.per_name);
    
    // 处理绩效考核数据，添加关联信息
    const [processedPerformance] = processPerformanceData([newPerformance]);
    
    res.status(201).json({
      code: '200',
      msg: '创建成功',
      data: processedPerformance
    });
  } catch (err) {
    console.error('POST /performances - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 更新绩效考核
app.put('/performances/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`PUT /performances/${id} - 请求体:`, req.body);
    
    // 验证id参数
    if (isNaN(id)) {
      console.error(`PUT /performances/${id} - 无效的ID参数`);
      return res.status(400).json({
        code: '400',
        msg: '无效的绩效考核ID',
        data: null
      });
    }
    
    const index = performances.findIndex(p => p.per_id === id);
    
    if (index === -1) {
      console.log(`PUT /performances/${id} - 未找到绩效考核`);
      return res.status(404).json({
        code: '404',
        msg: '绩效考核不存在',
        data: null
      });
    }
    
    // 安全地获取请求中的字段
    const per_name = req.body.per_name || req.body.name || performances[index].per_name;
    const start_date = req.body.start_date || req.body.startDate || performances[index].start_date;
    const end_date = req.body.end_date || req.body.endDate || performances[index].end_date;
    const state = req.body.state || performances[index].state;
    const description = req.body.description !== undefined ? req.body.description : performances[index].description;
    
    // 更新绩效考核信息
    performances[index] = {
      ...performances[index],
      per_name,
      start_date,
      end_date,
      state,
      description,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    console.log(`PUT /performances/${id} - 更新绩效考核:`, performances[index].per_name);
    
    // 处理绩效考核数据，添加关联信息
    const [processedPerformance] = processPerformanceData([performances[index]]);
    
    res.json({
      code: '200',
      msg: '更新成功',
      data: processedPerformance
    });
  } catch (err) {
    console.error(`PUT /performances/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 删除绩效考核
app.delete('/performances/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`DELETE /performances/${id} - 删除绩效考核`);
    
    const index = performances.findIndex(p => p.per_id === id);
    
    if (index === -1) {
      console.log(`DELETE /performances/${id} - 未找到绩效考核`);
      return res.status(404).json({
        code: '404',
        msg: '绩效考核不存在',
        data: null
      });
    }
    
    const deletedPerformance = performances[index];
    
    // 逻辑删除，而不是物理删除
    performances[index] = {
      ...performances[index],
      is_deleted: 1,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    console.log(`DELETE /performances/${id} - 删除绩效考核:`, deletedPerformance.per_name);
    
    res.json({
      code: '200',
      msg: '删除成功',
      data: {
        per_id: deletedPerformance.per_id,
        per_name: deletedPerformance.per_name
      }
    });
  } catch (err) {
    console.error(`DELETE /performances/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 获取所有员工绩效评估
app.get('/employee-performances', (req, res) => {
  try {
    console.log('GET /employee-performances - 获取所有员工绩效评估');
    
    // 过滤掉已删除的员工绩效评估
    const activeEmployeePerformances = employeePerformances.filter(ep => ep.is_deleted === 0);
    
    // 处理员工绩效评估数据，添加关联信息
    const processedEmployeePerformances = processEmployeePerformanceData(activeEmployeePerformances);
    
    console.log(`GET /employee-performances - 返回 ${processedEmployeePerformances.length} 条员工绩效评估记录`);
    
    res.json(processedEmployeePerformances);
  } catch (err) {
    console.error('GET /employee-performances - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 获取单个员工绩效评估
app.get('/employee-performances/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`GET /employee-performances/${id} - 获取单个员工绩效评估`);
    
    const employeePerformance = employeePerformances.find(ep => ep.id === id && ep.is_deleted === 0);
    
    if (!employeePerformance) {
      console.log(`GET /employee-performances/${id} - 未找到员工绩效评估`);
      return res.status(404).json({
        code: '404',
        msg: '员工绩效评估不存在',
        data: null
      });
    }
    
    // 处理员工绩效评估数据，添加关联信息
    const [processedEmployeePerformance] = processEmployeePerformanceData([employeePerformance]);
    
    console.log(`GET /employee-performances/${id} - 返回员工绩效评估`);
    
    res.json(processedEmployeePerformance);
  } catch (err) {
    console.error(`GET /employee-performances/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 创建员工绩效评估
app.post('/employee-performances', (req, res) => {
  try {
    console.log('POST /employee-performances - 请求体:', req.body);
    
    // 检查必填字段
    if (!req.body.approver_id && !req.body.approverId) {
      console.error('POST /employee-performances - 缺少审批人ID字段');
      return res.status(400).json({
        code: '400',
        msg: '审批人ID不能为空',
        data: null
      });
    }
    
    if (!req.body.emp_id && !req.body.employeeId) {
      console.error('POST /employee-performances - 缺少员工ID字段');
      return res.status(400).json({
        code: '400',
        msg: '员工ID不能为空',
        data: null
      });
    }
    
    if (!req.body.per_id && !req.body.performanceId) {
      console.error('POST /employee-performances - 缺少绩效考核ID字段');
      return res.status(400).json({
        code: '400',
        msg: '绩效考核ID不能为空',
        data: null
      });
    }
    
    const newEmployeePerformance = {
      id: employeePerformances.length > 0 ? Math.max(...employeePerformances.map(ep => ep.id)) + 1 : 1,
      approver_id: req.body.approver_id || req.body.approverId,
      emp_id: req.body.emp_id || req.body.employeeId,
      per_id: req.body.per_id || req.body.performanceId,
      score: req.body.score || 0,
      state: req.body.state || '未完成',
      description: req.body.description || '',
      is_deleted: 0,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    employeePerformances.push(newEmployeePerformance);
    
    console.log('POST /employee-performances - 创建新员工绩效评估');
    
    // 处理员工绩效评估数据，添加关联信息
    const [processedEmployeePerformance] = processEmployeePerformanceData([newEmployeePerformance]);
    
    res.status(201).json({
      code: '200',
      msg: '创建成功',
      data: processedEmployeePerformance
    });
  } catch (err) {
    console.error('POST /employee-performances - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 更新员工绩效评估
app.put('/employee-performances/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`PUT /employee-performances/${id} - 请求体:`, req.body);
    
    // 验证id参数
    if (isNaN(id)) {
      console.error(`PUT /employee-performances/${id} - 无效的ID参数`);
      return res.status(400).json({
        code: '400',
        msg: '无效的员工绩效评估ID',
        data: null
      });
    }
    
    const index = employeePerformances.findIndex(ep => ep.id === id);
    
    if (index === -1) {
      console.log(`PUT /employee-performances/${id} - 未找到员工绩效评估`);
      return res.status(404).json({
        code: '404',
        msg: '员工绩效评估不存在',
        data: null
      });
    }
    
    // 安全地获取请求中的字段
    const score = req.body.score !== undefined ? req.body.score : employeePerformances[index].score;
    const state = req.body.state || employeePerformances[index].state;
    const description = req.body.description !== undefined ? req.body.description : employeePerformances[index].description;
    
    // 更新员工绩效评估信息
    employeePerformances[index] = {
      ...employeePerformances[index],
      score,
      state,
      description,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    console.log(`PUT /employee-performances/${id} - 更新员工绩效评估`);
    
    // 处理员工绩效评估数据，添加关联信息
    const [processedEmployeePerformance] = processEmployeePerformanceData([employeePerformances[index]]);
    
    res.json({
      code: '200',
      msg: '更新成功',
      data: processedEmployeePerformance
    });
  } catch (err) {
    console.error(`PUT /employee-performances/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 删除员工绩效评估
app.delete('/employee-performances/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`DELETE /employee-performances/${id} - 删除员工绩效评估`);
    
    const index = employeePerformances.findIndex(ep => ep.id === id);
    
    if (index === -1) {
      console.log(`DELETE /employee-performances/${id} - 未找到员工绩效评估`);
      return res.status(404).json({
        code: '404',
        msg: '员工绩效评估不存在',
        data: null
      });
    }
    
    const deletedEmployeePerformance = employeePerformances[index];
    
    // 逻辑删除，而不是物理删除
    employeePerformances[index] = {
      ...employeePerformances[index],
      is_deleted: 1,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    console.log(`DELETE /employee-performances/${id} - 删除员工绩效评估`);
    
    res.json({
      code: '200',
      msg: '删除成功',
      data: {
        id: deletedEmployeePerformance.id,
        emp_id: deletedEmployeePerformance.emp_id,
        per_id: deletedEmployeePerformance.per_id
      }
    });
  } catch (err) {
    console.error(`DELETE /employee-performances/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
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
  console.log('  GET    /employees/:id      - 获取单个员工');
  console.log('  POST   /employees          - 创建新员工');
  console.log('  PUT    /employees/:id      - 更新员工');
  console.log('  DELETE /employees/:id      - 删除员工');
  console.log('  GET    /performances       - 获取所有绩效考核');
  console.log('  GET    /performances/:id   - 获取单个绩效考核');
  console.log('  POST   /performances       - 创建新绩效考核');
  console.log('  PUT    /performances/:id   - 更新绩效考核');
  console.log('  DELETE /performances/:id   - 删除绩效考核');
  console.log('  GET    /employee-performances      - 获取所有员工绩效评估');
  console.log('  GET    /employee-performances/:id  - 获取单个员工绩效评估');
  console.log('  POST   /employee-performances      - 创建新员工绩效评估');
  console.log('  PUT    /employee-performances/:id  - 更新员工绩效评估');
  console.log('  DELETE /employee-performances/:id  - 删除员工绩效评估');
  console.log('  GET    /health             - 健康检查\n');
}); 

// 处理员工-部门关系数据，添加关联信息
const processEmployeeDepartmentData = (empDepartments) => {
  try {
    return empDepartments.map(empDept => {
      try {
        // 获取员工信息
        const employee = employees.find(e => e.emp_id === empDept.emp_id);
        // 获取部门信息
        const department = departments.find(d => d.dep_id === empDept.dep_id);
        
        return {
          id: empDept.id,
          emp_id: empDept.emp_id,
          empId: empDept.emp_id, // 兼容前端使用empId字段
          employeeName: employee ? employee.emp_name : '未知员工',
          dep_id: empDept.dep_id,
          depId: empDept.dep_id, // 兼容前端使用depId字段
          departmentName: department ? department.dep_name : '未知部门',
          position: empDept.position || '',
          is_current: empDept.is_current,
          isCurrent: empDept.is_current === 1, // 兼容前端使用isCurrent字段
          created_at: empDept.created_at,
          createdAt: empDept.created_at, // 兼容前端使用createdAt字段
          updated_at: empDept.updated_at,
          updatedAt: empDept.updated_at // 兼容前端使用updatedAt字段
        };
      } catch (err) {
        console.error(`处理员工-部门关系数据出错:`, err, '员工-部门关系数据:', empDept);
        // 返回基本数据，避免整个处理失败
        return {
          id: empDept.id,
          emp_id: empDept.emp_id,
          empId: empDept.emp_id,
          dep_id: empDept.dep_id,
          depId: empDept.dep_id,
          position: empDept.position || '',
          is_current: empDept.is_current,
          isCurrent: empDept.is_current === 1
        };
      }
    });
  } catch (err) {
    console.error('处理员工-部门关系数据总体失败:', err);
    return empDepartments.map(empDept => ({
      id: empDept.id,
      emp_id: empDept.emp_id,
      empId: empDept.emp_id,
      dep_id: empDept.dep_id,
      depId: empDept.dep_id
    }));
  }
};

// 员工-部门关系API

// 获取所有员工-部门关系
app.get('/employee-departments', (req, res) => {
  try {
    console.log('GET /employee-departments - 获取所有员工-部门关系');
    
    // 处理查询参数
    const empId = req.query.empId || req.query.emp_id;
    const depId = req.query.depId || req.query.dep_id;
    const isCurrent = req.query.isCurrent || req.query.is_current;
    
    // 根据查询参数过滤数据
    let filteredEmployeeDepartments = [...employeeDepartments];
    
    if (empId) {
      filteredEmployeeDepartments = filteredEmployeeDepartments.filter(ed => 
        ed.emp_id === parseInt(empId)
      );
    }
    
    if (depId) {
      filteredEmployeeDepartments = filteredEmployeeDepartments.filter(ed => 
        ed.dep_id === parseInt(depId)
      );
    }
    
    if (isCurrent !== undefined) {
      const isCurrentValue = parseInt(isCurrent);
      filteredEmployeeDepartments = filteredEmployeeDepartments.filter(ed => 
        ed.is_current === isCurrentValue
      );
    }
    
    // 处理员工-部门关系数据，添加关联信息
    const processedEmployeeDepartments = processEmployeeDepartmentData(filteredEmployeeDepartments);
    
    console.log(`GET /employee-departments - 返回 ${processedEmployeeDepartments.length} 条员工-部门关系记录`);
    
    res.json({
      code: '200',
      msg: '请求成功',
      data: processedEmployeeDepartments
    });
  } catch (err) {
    console.error('GET /employee-departments - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 获取单个员工-部门关系
app.get('/employee-departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`GET /employee-departments/${id} - 获取单个员工-部门关系`);
    
    const employeeDepartment = employeeDepartments.find(ed => ed.id === id);
    
    if (!employeeDepartment) {
      console.log(`GET /employee-departments/${id} - 未找到员工-部门关系`);
      return res.status(404).json({
        code: '404',
        msg: '员工-部门关系不存在',
        data: null
      });
    }
    
    // 处理员工-部门关系数据，添加关联信息
    const [processedEmployeeDepartment] = processEmployeeDepartmentData([employeeDepartment]);
    
    console.log(`GET /employee-departments/${id} - 返回员工-部门关系`);
    
    res.json({
      code: '200',
      msg: '请求成功',
      data: processedEmployeeDepartment
    });
  } catch (err) {
    console.error(`GET /employee-departments/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 创建员工-部门关系（人事调动）
app.post('/employee-departments', (req, res) => {
  try {
    console.log('POST /employee-departments - 请求体:', req.body);
    
    // 检查必填字段
    if (!req.body.emp_id && !req.body.empId) {
      console.error('POST /employee-departments - 缺少员工ID字段');
      return res.status(400).json({
        code: '400',
        msg: '员工ID不能为空',
        data: null
      });
    }
    
    if (!req.body.dep_id && !req.body.depId) {
      console.error('POST /employee-departments - 缺少部门ID字段');
      return res.status(400).json({
        code: '400',
        msg: '部门ID不能为空',
        data: null
      });
    }
    
    const empId = parseInt(req.body.emp_id || req.body.empId);
    const depId = parseInt(req.body.dep_id || req.body.depId);
    
    // 检查员工是否存在
    const employee = employees.find(e => e.emp_id === empId);
    if (!employee) {
      console.error(`POST /employee-departments - 员工ID=${empId}不存在`);
      return res.status(400).json({
        code: '400',
        msg: '员工不存在',
        data: null
      });
    }
    
    // 检查部门是否存在
    const department = departments.find(d => d.dep_id === depId);
    if (!department) {
      console.error(`POST /employee-departments - 部门ID=${depId}不存在`);
      return res.status(400).json({
        code: '400',
        msg: '部门不存在',
        data: null
      });
    }
    
    // 如果要设置为当前部门，则将其他关系设为非当前
    if (req.body.is_current === 1 || req.body.isCurrent === true) {
      employeeDepartments.forEach((ed, index) => {
        if (ed.emp_id === empId && ed.is_current === 1) {
          employeeDepartments[index].is_current = 0;
          employeeDepartments[index].updated_at = new Date().toISOString().split('T')[0];
        }
      });
    }
    
    const newEmployeeDepartment = {
      id: employeeDepartments.length > 0 ? Math.max(...employeeDepartments.map(ed => ed.id)) + 1 : 1,
      emp_id: empId,
      dep_id: depId,
      position: req.body.position || '',
      is_current: req.body.is_current !== undefined ? parseInt(req.body.is_current) : 
                 (req.body.isCurrent !== undefined ? (req.body.isCurrent ? 1 : 0) : 1),
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    employeeDepartments.push(newEmployeeDepartment);
    
    console.log('POST /employee-departments - 创建新员工-部门关系');
    
    // 更新部门员工数量
    const departmentIndex = departments.findIndex(d => d.dep_id === depId);
    if (departmentIndex !== -1) {
      departments[departmentIndex].employeeCount += 1;
    }
    
    // 更新员工的部门ID
    const employeeIndex = employees.findIndex(e => e.emp_id === empId);
    if (employeeIndex !== -1) {
      employees[employeeIndex].departmentId = depId;
      if (req.body.position) {
        employees[employeeIndex].position = req.body.position;
      }
    }
    
    // 处理员工-部门关系数据，添加关联信息
    const [processedEmployeeDepartment] = processEmployeeDepartmentData([newEmployeeDepartment]);
    
    res.status(201).json({
      code: '200',
      msg: '创建成功',
      data: processedEmployeeDepartment
    });
  } catch (err) {
    console.error('POST /employee-departments - 处理请求时出错:', err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 更新员工-部门关系
app.put('/employee-departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`PUT /employee-departments/${id} - 请求体:`, req.body);
    
    // 验证id参数
    if (isNaN(id)) {
      console.error(`PUT /employee-departments/${id} - 无效的ID参数`);
      return res.status(400).json({
        code: '400',
        msg: '无效的员工-部门关系ID',
        data: null
      });
    }
    
    const index = employeeDepartments.findIndex(ed => ed.id === id);
    
    if (index === -1) {
      console.log(`PUT /employee-departments/${id} - 未找到员工-部门关系`);
      return res.status(404).json({
        code: '404',
        msg: '员工-部门关系不存在',
        data: null
      });
    }
    
    // 如果要设置为当前部门，则将其他关系设为非当前
    if ((req.body.is_current !== undefined && req.body.is_current === 1) || 
        (req.body.isCurrent !== undefined && req.body.isCurrent === true)) {
      const empId = employeeDepartments[index].emp_id;
      employeeDepartments.forEach((ed, idx) => {
        if (idx !== index && ed.emp_id === empId && ed.is_current === 1) {
          employeeDepartments[idx].is_current = 0;
          employeeDepartments[idx].updated_at = new Date().toISOString().split('T')[0];
        }
      });
    }
    
    // 安全地获取请求中的字段
    const position = req.body.position !== undefined ? req.body.position : employeeDepartments[index].position;
    const is_current = req.body.is_current !== undefined ? parseInt(req.body.is_current) : 
                      (req.body.isCurrent !== undefined ? (req.body.isCurrent ? 1 : 0) : employeeDepartments[index].is_current);
    
    // 更新员工-部门关系信息
    employeeDepartments[index] = {
      ...employeeDepartments[index],
      position,
      is_current,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    console.log(`PUT /employee-departments/${id} - 更新员工-部门关系`);
    
    // 如果更新了职位，同时更新员工表中的职位
    if (req.body.position !== undefined) {
      const employeeIndex = employees.findIndex(e => e.emp_id === employeeDepartments[index].emp_id);
      if (employeeIndex !== -1) {
        employees[employeeIndex].position = position;
      }
    }
    
    // 处理员工-部门关系数据，添加关联信息
    const [processedEmployeeDepartment] = processEmployeeDepartmentData([employeeDepartments[index]]);
    
    res.json({
      code: '200',
      msg: '更新成功',
      data: processedEmployeeDepartment
    });
  } catch (err) {
    console.error(`PUT /employee-departments/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});

// 删除员工-部门关系
app.delete('/employee-departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    console.log(`DELETE /employee-departments/${id} - 删除员工-部门关系`);
    
    const index = employeeDepartments.findIndex(ed => ed.id === id);
    
    if (index === -1) {
      console.log(`DELETE /employee-departments/${id} - 未找到员工-部门关系`);
      return res.status(404).json({
        code: '404',
        msg: '员工-部门关系不存在',
        data: null
      });
    }
    
    const deletedEmployeeDepartment = employeeDepartments[index];
    
    // 检查是否为当前关系，如果是，可能需要更新员工的部门ID
    if (deletedEmployeeDepartment.is_current === 1) {
      const employeeIndex = employees.findIndex(e => e.emp_id === deletedEmployeeDepartment.emp_id);
      if (employeeIndex !== -1) {
        employees[employeeIndex].departmentId = null;
      }
      
      // 更新部门员工数量
      const departmentIndex = departments.findIndex(d => d.dep_id === deletedEmployeeDepartment.dep_id);
      if (departmentIndex !== -1 && departments[departmentIndex].employeeCount > 0) {
        departments[departmentIndex].employeeCount -= 1;
      }
    }
    
    // 物理删除，从数组中移除
    employeeDepartments.splice(index, 1);
    
    console.log(`DELETE /employee-departments/${id} - 删除员工-部门关系`);
    
    res.json({
      code: '200',
      msg: '删除成功',
      data: {
        id: deletedEmployeeDepartment.id,
        emp_id: deletedEmployeeDepartment.emp_id,
        dep_id: deletedEmployeeDepartment.dep_id
      }
    });
  } catch (err) {
    console.error(`DELETE /employee-departments/${id} - 处理请求时出错:`, err);
    res.status(500).json({
      code: '500',
      msg: '服务器内部错误',
      data: null
    });
  }
});