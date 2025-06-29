import api from "../api";

export async function getEmployeeAISummery(employeeId) {
  try {
    const res = await api.get(`/ai-analyses/employees/${employeeId}`);
    return res.data.data[0] || "";
  } catch (error) {
    console.error("Error fetching AI summary:", error);
    throw error;
  }
}

export async function createAISummary(type, id, result) {
  try {
    await api.post("/ai-analyses", {
      type,
      empId: type === "员工" ? id : undefined,
      deptId: type === "部门" ? id : undefined,
      analyseResult: result,
    });
  } catch (err) {
    console.error("Error creating AI summary:", err);
    throw err;
  }
}

export async function updateAISummary(id, result) {
  try {
    await api.put(`/ai-analyses/${id}`, {
      analyseResult: result,
    });
  } catch (err) {
    console.error("Error updating AI summary:", err);
    throw err;
  }
}
