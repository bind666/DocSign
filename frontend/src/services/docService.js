import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: "https://docsign-md45.onrender.com/api",
    withCredentials: true,
});

export const uploadDocument = async (formData) => {
    const res = await API.post("/docs/upload", formData);
    return res.data;
};

export const getUserDocuments = async () => {
    const res = await API.get("/docs/");
    return res.data;
};
