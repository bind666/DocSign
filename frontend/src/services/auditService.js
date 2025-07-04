import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: "https://docsign-md45.onrender.com/api",
    withCredentials: true,
});

export const getAuditTrail = async (fileId) => {
    const res = await API.get(`/audit/${fileId}`);
    return res.data;
};
