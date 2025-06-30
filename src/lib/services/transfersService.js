import api from "../api";

export async function getAllPendingTransfers() {
  try {
    const res = await api(`/employee-departments/pending-transfers`);

    return res.data.data;
  } catch (error) {
    console.error("获取员工调动信息失败:", error);
    throw error;
  }
}

export async function getAllTransfers() {
  try {
    const res = await api.get("/employee-departments");
    return res.data.data;
  } catch (error) {
    console.error("获取员工调动信息失败:", error);
    throw error;
  }
}
