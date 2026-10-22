import api from './client.js';

export const uploadMainCV = async (file) => {
  const formData = new FormData();
  formData.append('cv', file);
  const response = await api.post('/cv/main', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getMainCV = async () => {
  const response = await api.get('/cv/main');
  return response.data;
};

export const deleteMainCV = async () => {
  const response = await api.delete('/cv/main');
  return response.data;
};

export const getMainCVDownloadUrl = () => {
  const token = localStorage.getItem('careertech_token');
  return `/api/cv/main/file?token=${token}`;
};
