import axios from 'axios';

// 创建axios实例
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	timeout: 10000 // 10秒超时
});

// 请求拦截器
api.interceptors.request.use(
	config => {
		console.log(`API请求: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
		return config;
	},
	error => {
		console.error('API请求错误:', error);
		return Promise.reject(error);
	}
);

// 响应拦截器
api.interceptors.response.use(
	response => {
		console.log(`API响应: ${response.status} ${response.config.url}`);
		return response;
	},
	error => {
		if (error.response) {
			console.error(`API错误: ${error.response.status} ${error.response.config.url}`);
		} else if (error.request) {
			console.error('API错误: 无响应', error.request);
		} else {
			console.error('API错误:', error.message);
		}
		return Promise.reject(error);
	}
);

export default api;
