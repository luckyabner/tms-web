import api from '../api';

const employees = [
	{
		id: 1,
		name: '陶喆',
		password: '123456',
		gender: '无',
		phone: '12312341234',
		empType: '普通用户',
		hireDate: '2025-06-18',
		education: '未知',
		empPhoto: null,
		isDeleted: 0,
		school: null,
		status: '在职',
		createdAt: '2025-06-18 21:53:31',
		updatedAt: '2025-06-18 21:53:31',
	},
	{
		id: 2,
		name: '周杰伦',
		password: '123456',
		gender: '无',
		phone: '12323452345',
		empType: '普通用户',
		hireDate: '2025-06-17',
		education: '未知',
		empPhoto: null,
		isDeleted: 0,
		school: null,
		status: '在职',
		createdAt: '2025-06-18 23:54:13',
		updatedAt: '2025-06-18 23:54:13',
	},
];
/**
 * Fetches all employees from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of employees.
 */
export async function getAllEmployees() {
	try {
		const res = await api.get('/employees');
		return res.data.data || []; 
	} catch (err) {
		console.error('Error fetching employees:', err);
		throw err; // 重新抛出错误，让调用者处理
	}
}
