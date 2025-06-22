import api from '../api';

/**
 * 获取所有日志列表（分页）
 * @param {Object} params 分页参数
 * @returns {Promise} 返回日志列表数据和分页信息
 */
export const getAllLogs = async (params = { pageNum: 1, pageSize: 10, level: null, userId: null, startDate: null, endDate: null }) => {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('pageNum', params.pageNum);
    queryParams.append('pageSize', params.pageSize);
    
    if (params.level) {
      queryParams.append('level', params.level);
    }
    
    if (params.userId) {
      queryParams.append('userId', params.userId);
    }
    
    // 添加日期范围参数
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    
    const url = `/system/logs?${queryParams.toString()}`;
    console.log('请求URL:', url);
    
    const response = await api.get(url);
    console.log('API返回原始日志数据:', response.data);
    console.log('API响应状态:', response.status);
    
    // 处理可能的不同数据格式
    let logs = [];
    let pagination = {
      current: params.pageNum,
      pageSize: params.pageSize,
      total: 0
    };
    
    // 检查是否是标准响应格式: {code, msg, data}
    if (response.data && response.data.code === '200' && response.data.data) {
      // 如果data是分页对象
      if (response.data.data.records && Array.isArray(response.data.data.records)) {
        logs = response.data.data.records;
        pagination = {
          current: response.data.data.current || params.pageNum,
          pageSize: response.data.data.size || params.pageSize,
          total: response.data.data.total || 0
        };
        console.log('数据格式: {code, msg, data(分页对象)}');
      }
      // 如果data是数组，直接使用
      else if (Array.isArray(response.data.data)) {
        logs = response.data.data;
        pagination.total = logs.length;
        console.log('数据格式: {code, msg, data(数组)}');
      } 
      // 如果data是单个日志对象（如获取单个日志的情况）
      else if (typeof response.data.data === 'object') {
        logs = [response.data.data];
        pagination.total = 1;
        console.log('数据格式: {code, msg, data(单个对象)}');
      }
    } 
    // 检查是否直接返回了数组
    else if (Array.isArray(response.data)) {
      logs = response.data;
      pagination.total = logs.length;
      console.log('数据格式: 数组');
    }
    // 检查是否是分页格式
    else if (response.data && response.data.records && Array.isArray(response.data.records)) {
      logs = response.data.records;
      pagination = {
        current: response.data.current || params.pageNum,
        pageSize: response.data.size || params.pageSize,
        total: response.data.total || 0
      };
      console.log('数据格式: {records, total, size, current}');
    }
    // 如果是空对象
    else if (response.data && Object.keys(response.data).length === 0) {
      console.log('API返回了空对象，可能是因为没有日志数据');
      logs = [];
    } else {
      console.error('未知的API响应格式:', response.data);
      logs = [];
    }
    
    // 处理字段映射，确保前端需要的字段都存在
    const processedLogs = logs.map(log => {
      // 规范化日志级别
      let normalizedLevel = 'unknown';
      if (log.level) {
        const levelStr = String(log.level).toLowerCase();
        if (levelStr === 'info' || levelStr === 'information') {
          normalizedLevel = 'info';
        } else if (levelStr === 'error' || levelStr === 'err') {
          normalizedLevel = 'error';
        } else if (levelStr === 'warn' || levelStr === 'warning') {
          normalizedLevel = 'warn'; // 确保警告日志统一使用 'warn'
        } else {
          normalizedLevel = levelStr;
        }
      }
      
      console.log('规范化日志级别:', log.level, '->', normalizedLevel);
      
      // 创建基本日志对象
      return {
        id: log.id || log.log_id || Math.random().toString(36).substr(2, 9),
        timestamp: log.createdAt || log.created_at || new Date().toISOString(),
        level: normalizedLevel,
        message: log.action || log.message || '',
        source: log.source || log.module || '系统',
        user: log.username || `用户${log.userId || log.user_id || 'unknown'}`,
        ip: log.ip || log.ipAddress || log.ip_address || '127.0.0.1'
      };
    });
    
    console.log('处理后的日志数据:', processedLogs);
    console.log('分页信息:', pagination);
    
    return {
      logs: processedLogs,
      pagination
    };
  } catch (error) {
    console.error('获取日志列表失败:', error);
    console.error('错误详情:', error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    } : '无响应');
    return {
      logs: [],
      pagination: {
        current: params.pageNum,
        pageSize: params.pageSize,
        total: 0
      }
    };
  }
};

// 缓存日志统计数据，避免重复请求
let cachedLogData = null;
let cachedTimestamp = null;
const CACHE_DURATION = 10000; // 缓存10秒，减少缓存时间以便更快获取新数据

/**
 * 获取日志统计数据
 * @returns {Promise} 返回日志统计数据
 */
export const getLogStats = async (params = {}) => {
  try {
    // 检查是否有有效缓存，但初始加载时不使用缓存
    const now = Date.now();
    if (cachedLogData && cachedTimestamp && (now - cachedTimestamp < CACHE_DURATION) && params.useCache !== false) {
      console.log('使用缓存的日志统计数据');
      
      // 如果有筛选条件，则过滤缓存数据
      if (params.level || params.startDate || params.endDate) {
        console.log('基于筛选条件处理缓存数据');
        const filteredLogs = cachedLogData.filter(log => {
          // 过滤日志级别
          if (params.level && log.level !== params.level) {
            return false;
          }
          
          // 过滤日期范围
          if (params.startDate || params.endDate) {
            const logDate = new Date(log.timestamp);
            if (params.startDate && new Date(params.startDate) > logDate) {
              return false;
            }
            if (params.endDate && new Date(params.endDate) < logDate) {
              return false;
            }
          }
          
          return true;
        });
        
        // 计算统计数据
        const errorLogs = filteredLogs.filter(log => log.level === 'error');
        const infoLogs = filteredLogs.filter(log => log.level === 'info');
        
        return {
          total: filteredLogs.length,
          error: errorLogs.length,
          info: infoLogs.length,
          warning: 0
        };
      }
      
      // 没有筛选条件，返回完整统计
      const errorLogs = cachedLogData.filter(log => log.level === 'error');
      const infoLogs = cachedLogData.filter(log => log.level === 'info');
      
      return {
        total: cachedLogData.length,
        error: errorLogs.length,
        info: infoLogs.length,
        warning: 0
      };
    }
    
    // 没有缓存或缓存过期，请求新数据
    const { logs, pagination } = await getAllLogs({ 
      pageNum: 1, 
      pageSize: 1000, // 获取较多数据以便统计
      level: null, // 不筛选级别，获取全部数据
      startDate: null,
      endDate: null
    });
    console.log('获取新的日志数据用于统计');
    
    // 更新缓存
    cachedLogData = logs;
    cachedTimestamp = now;
    
    // 如果有筛选条件，则过滤数据
    let filteredLogs = logs;
    if (params.level || params.startDate || params.endDate) {
      filteredLogs = logs.filter(log => {
        // 过滤日志级别
        if (params.level && log.level !== params.level) {
          return false;
        }
        
        // 过滤日期范围
        if (params.startDate || params.endDate) {
          const logDate = new Date(log.timestamp);
          if (params.startDate && new Date(params.startDate) > logDate) {
            return false;
          }
          if (params.endDate && new Date(params.endDate) < logDate) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // 计算统计数据
    const errorLogs = filteredLogs.filter(log => log.level === 'error');
    const warnLogs = filteredLogs.filter(log => log.level === 'warn');
    const infoLogs = filteredLogs.filter(log => log.level === 'info');
    
    const stats = {
      total: pagination.total, // 使用后端返回的总数
      error: errorLogs.length,
      info: infoLogs.length,
      warning: warnLogs.length
    };
    
    console.log('计算得到的日志统计:', stats);
    return stats;
  } catch (error) {
    console.error('获取日志统计数据失败:', error);
    return {
      total: 0,
      error: 0,
      info: 0,
      warning: 0
    };
  }
};

/**
 * 获取日志活动数据（按小时）
 * @returns {Promise} 返回日志活动数据
 */
export const getLogActivity = async (params = {}) => {
  try {
    // 使用缓存数据计算活动图表，避免额外请求
    let logsToUse = [];
    
    if (cachedLogData && cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION) && params.useCache !== false) {
      console.log('使用缓存的日志数据生成活动图表');
      logsToUse = cachedLogData;
    } else {
      // 没有缓存或缓存过期，请求新数据
      const { logs } = await getAllLogs({ 
        pageNum: 1, 
        pageSize: 100,
        level: null, // 不筛选级别，获取全部数据
        startDate: null,
        endDate: null
      });
      logsToUse = logs;
      
      // 更新缓存
      cachedLogData = logs;
      cachedTimestamp = Date.now();
    }
    
    // 如果有筛选条件，则过滤数据
    if (params.level || params.startDate || params.endDate) {
      logsToUse = logsToUse.filter(log => {
        // 过滤日志级别
        if (params.level && log.level !== params.level) {
          return false;
        }
        
        // 过滤日期范围
        if (params.startDate || params.endDate) {
          const logDate = new Date(log.timestamp);
          if (params.startDate && new Date(params.startDate) > logDate) {
            return false;
          }
          if (params.endDate && new Date(params.endDate) < logDate) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // 创建24小时的空数据
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      信息: 0,
      警告: 0,
      错误: 0
    }));
    
    // 根据日志时间统计每小时的日志数量
    logsToUse.forEach(log => {
      try {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        
        if (hour >= 0 && hour < 24) {
          if (log.level === 'error') {
            hourlyData[hour].错误 += 1;
          } else if (log.level === 'warn') {
            hourlyData[hour].警告 += 1;
          } else if (log.level === 'info') {
            hourlyData[hour].信息 += 1;
          }
        }
      } catch (err) {
        console.error('处理日志时间失败:', err, log.timestamp);
      }
    });
    
    console.log('生成的日志活动数据:', hourlyData);
    return hourlyData;
  } catch (error) {
    console.error('获取日志活动数据失败:', error);
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      信息: 0,
      警告: 0,
      错误: 0
    }));
  }
};

/**
 * 获取日志来源数据
 * @returns {Promise} 返回日志来源数据
 */
export const getLogSources = async (params = {}) => {
  try {
    // 使用缓存数据计算来源图表，避免额外请求
    let logsToUse = [];
    
    if (cachedLogData && cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION) && params.useCache !== false) {
      console.log('使用缓存的日志数据生成来源图表');
      logsToUse = cachedLogData;
    } else {
      // 没有缓存或缓存过期，请求新数据
      const { logs } = await getAllLogs({ 
        pageNum: 1, 
        pageSize: 100,
        level: null, // 不筛选级别，获取全部数据
        startDate: null,
        endDate: null
      });
      logsToUse = logs;
      
      // 更新缓存
      cachedLogData = logs;
      cachedTimestamp = Date.now();
    }
    
    // 如果有筛选条件，则过滤数据
    if (params.level || params.startDate || params.endDate) {
      logsToUse = logsToUse.filter(log => {
        // 过滤日志级别
        if (params.level && log.level !== params.level) {
          return false;
        }
        
        // 过滤日期范围
        if (params.startDate || params.endDate) {
          const logDate = new Date(log.timestamp);
          if (params.startDate && new Date(params.startDate) > logDate) {
            return false;
          }
          if (params.endDate && new Date(params.endDate) < logDate) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // 统计不同来源的日志数量
    const sources = {};
    logsToUse.forEach(log => {
      const source = log.source || '未知';
      if (!sources[source]) {
        sources[source] = 0;
      }
      sources[source]++;
    });
    
    // 按用户ID分组
    const userSources = {};
    logsToUse.forEach(log => {
      const user = log.user || '未知用户';
      if (!userSources[user]) {
        userSources[user] = 0;
      }
      userSources[user]++;
    });
    
    // 合并来源数据
    let sourceData = [
      ...Object.entries(sources).map(([name, value]) => ({
        name: `来源: ${name}`,
        value
      })),
      ...Object.entries(userSources).map(([name, value]) => ({
        name: `用户: ${name}`,
        value
      }))
    ];
    
    // 如果没有数据，添加一个默认项
    if (sourceData.length === 0) {
      sourceData.push({ name: '暂无数据', value: 1 });
    }
    
    console.log('生成的日志来源数据:', sourceData);
    return sourceData;
  } catch (error) {
    console.error('获取日志来源数据失败:', error);
    return [{ name: '暂无数据', value: 1 }];
  }
};

/**
 * 删除单个日志
 * @param {number|string} id 日志ID
 * @returns {Promise<boolean>} 是否删除成功
 */
export const deleteLog = async (id) => {
  try {
    const response = await api.delete(`/system/logs/${id}`);
    console.log('删除日志响应:', response.data);
    
    // 删除后清除缓存，确保下次获取最新数据
    cachedLogData = null;
    cachedTimestamp = null;
    
    if (response.data && response.data.code === '200') {
      return true;
    }
    
    return response.status === 200;
  } catch (error) {
    console.error('删除日志失败:', error);
    return false;
  }
};

/**
 * 清空所有日志
 * @returns {Promise<boolean>} 是否清空成功
 */
export const clearAllLogs = async () => {
  try {
    const response = await api.delete('/system/logs/clear');
    console.log('清空日志响应:', response.data);
    
    // 清空后清除缓存，确保下次获取最新数据
    cachedLogData = null;
    cachedTimestamp = null;
    
    if (response.data && response.data.code === '200') {
      return true;
    }
    
    return response.status === 200;
  } catch (error) {
    console.error('清空日志失败:', error);
    return false;
  }
};

/**
 * 导出日志
 * @param {Object} filters 过滤条件
 * @returns {Promise} 返回导出结果
 */
export const exportLogs = async (filters = {}) => {
  try {
    // 使用缓存数据导出，避免额外请求
    let logsToExport = [];
    
    if (cachedLogData && cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION)) {
      console.log('使用缓存的日志数据导出');
      logsToExport = cachedLogData;
    } else {
      // 没有缓存或缓存过期，请求新数据
      const { logs } = await getAllLogs({ 
        pageNum: 1, 
        pageSize: 1000,
        level: null, // 不筛选级别，获取全部数据
        startDate: null,
        endDate: null
      });
      logsToExport = logs;
      
      // 更新缓存
      cachedLogData = logs;
      cachedTimestamp = Date.now();
    }
    
    // 如果有筛选条件，则过滤数据
    if (filters.level || filters.startDate || filters.endDate) {
      logsToExport = logsToExport.filter(log => {
        // 过滤日志级别
        if (filters.level && log.level !== filters.level) {
          return false;
        }
        
        // 过滤日期范围
        if (filters.startDate || filters.endDate) {
          const logDate = new Date(log.timestamp);
          if (filters.startDate && new Date(filters.startDate) > logDate) {
            return false;
          }
          if (filters.endDate && new Date(filters.endDate) < logDate) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // 创建CSV内容
    const headers = 'ID,时间,级别,消息,用户,IP地址\n';
    const rows = logsToExport.map(log => 
      `${log.id},"${log.timestamp}","${log.level}","${log.message}","${log.user}","${log.ip}"`
    ).join('\n');
    
    return new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
  } catch (error) {
    console.error('导出日志失败:', error);
    const csvContent = 'timestamp,level,message,source,user,ip\n' +
      new Date().toISOString() + ',info,导出功能暂不可用,系统,system,127.0.0.1';
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
};

/**
 * 根据时间范围获取日期范围
 * @param {string} timeRange 时间范围（today, yesterday, week, month）
 * @returns {Object} 开始日期和结束日期
 */
export const getDateRangeFromTimeRange = (timeRange) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate = null;
  let endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 默认结束日期为明天（包含今天的所有数据）
  
  switch (timeRange) {
    case 'today':
      startDate = today;
      break;
    case 'yesterday':
      startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      endDate = today;
      break;
    case 'week':
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = null;
  }
  
  // 格式化为YYYY-MM-DD格式
  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}; 