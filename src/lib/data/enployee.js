import api from '../api';

/**
 * Fetches all employees from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of employees.
 */
export async function getAllEmployees() {
	try {
		const res = await api.get('/api/employees');
		return res.data;
	} catch (err) {
		console.error('Error fetching employees:', err);
		throw err; // 重新抛出错误，让调用者处理
	}
}
