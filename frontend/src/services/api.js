import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/resume';

export const analyzeResume = async (file, jobDescription) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getHistory = async () => {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data;
};

export const deleteAnalysis = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};