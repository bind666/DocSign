import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: "https://docsign-md45.onrender.com/api",
    withCredentials: true,
});

// Save a signature (name, fileId, coordinates, page)
export const saveSignature = async (data) => {
    const res = await API.post("/signatures", data);
    return res.data;
};

// Get all signatures for a file
export const getSignaturesByFileId = async (fileId) => {
    const res = await API.get(`/signatures/${fileId}`);
    return res.data;
};

export const generateSignedPdf = async (fileId) => {
  const res = await API.get(`/signatures/signed/${fileId}`);
  return res.data; // includes signedUrl
};

export const getSignedDocuments = async () => {
    const res = await API.get("/signatures/signed-docs/list");
    return res.data;
};
