import http from "./http";

export const createStory = async (payload) => {
  // payload can be FormData when including image
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = isFormData ? {} : { "Content-Type": "application/json" };
  const data = isFormData ? payload : JSON.stringify(payload);
  const res = await http.post("/api/stories", data, { headers });
  return res.data;
};

export const getAllStories = async (params = {}) => {
  const res = await http.get("/api/stories", { params });
  return res.data;
};

export const getStoryById = async (id) => {
  const res = await http.get(`/api/stories/${id}`);
  return res.data;
};

export const updateStory = async (id, payload) => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = isFormData ? {} : { "Content-Type": "application/json" };
  const data = isFormData ? payload : JSON.stringify(payload);
  const res = await http.put(`/api/stories/${id}`, data, { headers });
  return res.data;
};

export const deleteStory = async (id) => {
  const res = await http.delete(`/api/stories/${id}`);
  return res.data;
};
