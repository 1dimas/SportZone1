
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getProfileByUserId = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
