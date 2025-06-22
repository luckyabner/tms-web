import api from '../api';

/**
 * 获取所有日志列表
 * @returns {Promise} 返回日志列表数据
 */
export const getAllLogs = async () => {
  try {
    const response = await api.get('/system/logs');
    console.log('API返回原始日志数据:', response.data);
    console.log('API响应状态:', response.status);
    
    // 处理可能的不同数据格式
    let logs = [];
    
    // 检查是否是标准响应格式: {code, msg, data}
    if (response.data && response.data.code === '200' && response.data.data) {
      // 如果data是数组，直接使用
      if (Array.isArray(response.data.data)) {
        logs = response.data.data;
        console.log('数据格式: {code, msg, data(数组)}');
      } 
      // 如果data是对象且有records字段（分页数据）
      else if (response.data.data.records && Array.isArray(response.data.data.records)) {
        logs = response.data.data.records;
        console.log('数据格式: {code, msg, data.records(数组)}');
      }
      // 如果data是单个日志对象（如获取单个日志的情况）
      else if (typeof response.data.data === 'object') {
        logs = [response.data.data];
        console.log('数据格式: {code, msg, data(单个对象)}');
      }
    } 
    // 检查是否直接返回了数组
    else if (Array.isArray(response.data)) {
      logs = response.data;
      console.log('数据格式: 数组');
    }
    // 检查是否是分页格式
    else if (response.data && response.data.records && Array.isArray(response.data.records)) {
      logs = response.data.records;
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
      // 创建基本日志对象
      return {
        id: log.id || log.log_id || Math.random().toString(36).substr(2, 9),
        timestamp: log.createdAt || log.created_at || new Date().toISOString(),
        level: log.level || 'info',
        message: log.action || log.message || '',
        source: log.source || log.module || '系统',
        user: log.username || `用户${log.userId || log.user_id || 'unknown'}`,
        ip: log.ip || log.ipAddress || log.ip_address || '127.0.0.1'
      };
    });
    
    console.log('处理后的日志数据:', processedLogs);
    return processedLogs;
  } catch (error) {
    console.error('获取日志列表失败:', error);
    console.error('错误详情:', error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    } : '无响应');
    return [];
  }
};

/**
 * 获取日志统计数据
 * @returns {Promise} 返回日志统计数据
 */
export const getLogStats = async () => {
  try {
    // 使用日志列表来计算统计数据
    const logs = await getAllLogs();
    console.log('使用日志列表计算统计数据');
    
    const errorLogs = logs.filter(log => log.level === 'ERROR' || log.level === 'error');
    const infoLogs = logs.filter(log => log.level === 'INFO' || log.level === 'info');
    const warningLogs = logs.filter(log => log.level === 'WARNING' || log.level === 'warning');
    
    const stats = {
      total: logs.length,
      error: errorLogs.length,
      info: infoLogs.length,
      warning: warningLogs.length
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
export const getLogActivity = async () => {
  try {
    // 使用日志列表来生成活动数据
    const logs = await getAllLogs();
    console.log('使用日志列表生成活动数据');
    
    // 创建24小时的空数据
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      信息: 0,
      错误: 0
    }));
    
    // 根据日志时间统计每小时的日志数量
    logs.forEach(log => {
      try {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        
        if (hour >= 0 && hour < 24) {
          if (log.level === 'ERROR' || log.level === 'error') {
            hourlyData[hour].错误 += 1;
          } else if (log.level === 'INFO' || log.level === 'info') {
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
      错误: 0
    }));
  }
};

/**
 * 获取日志来源数据
 * @returns {Promise} 返回日志来源数据
 */
export const getLogSources = async () => {
  try {
    // 使用日志列表来生成来源数据
    const logs = await getAllLogs();
    console.log('使用日志列表生成来源数据');
    
    // 统计不同来源的日志数量
    const sources = {};
    logs.forEach(log => {
      const source = log.source || '未知';
      if (!sources[source]) {
        sources[source] = 0;
      }
      sources[source]++;
    });
    
    // 按用户ID分组
    const userSources = {};
    logs.forEach(log => {
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
 * 导出日志
 * @param {Object} filters 过滤条件
 * @returns {Promise} 返回导出结果
 */
export const exportLogs = async (filters = {}) => {
  try {
    // 使用日志列表来生成CSV
    const logs = await getAllLogs();
    console.log('使用日志列表生成CSV');
    
    // 创建CSV内容
    const headers = 'ID,时间,级别,消息,来源,用户,IP地址\n';
    const rows = logs.map(log => 
      `${log.id},"${log.timestamp}","${log.level}","${log.message}","${log.source}","${log.user}","${log.ip}"`
    ).join('\n');
    
    return new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
  } catch (error) {
    console.error('导出日志失败:', error);
    const csvContent = 'timestamp,level,message,source,user,ip\n' +
      new Date().toISOString() + ',info,导出功能暂不可用,系统,system,127.0.0.1';
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
}; 