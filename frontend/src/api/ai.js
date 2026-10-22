import api from './client.js';

export const analyzeCV = async ({
  jobDescription,
  jobTitle,
  company,
  jobOpportunityId,
  useMainCV,
  customCVFile,
}) => {
  const formData = new FormData();
  formData.append('jobDescription', jobDescription);
  if (jobTitle) formData.append('jobTitle', jobTitle);
  if (company) formData.append('company', company);
  if (jobOpportunityId) formData.append('jobOpportunityId', jobOpportunityId);
  formData.append('useMainCV', useMainCV);

  if (customCVFile) {
    formData.append('customCV', customCVFile);
  }

  const response = await api.post('/ai/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getAnalysisHistory = async () => {
  const response = await api.get('/ai/history');
  return response.data;
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/ai/history/${id}`);
  return response.data;
};

export const deleteAnalysis = async (id) => {
  const response = await api.delete(`/ai/history/${id}`);
  return response.data;
};

export const getExportPdfUrl = (id) => {
  return `/api/ai/history/${id}/pdf`;
};
