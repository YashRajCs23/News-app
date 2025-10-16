import http from "./http";

export const getStats = async () => {
  const { data } = await http.get("/api/admin/stats");
  return data;
};

export const getPendingStories = async () => {
  const { data } = await http.get("/api/admin/stories/pending");
  return data;
};

export const moderateStory = async (id, action) => {
  const { data } = await http.post(`/api/admin/stories/${id}/moderate`, { action });
  return data;
};

export const upsertCategory = async ({ name, slug }) => {
  const { data } = await http.post(`/api/admin/categories`, { name, slug });
  return data;
};

export const deleteCategory = async (slug) => {
  const { data } = await http.delete(`/api/admin/categories/${slug}`);
  return data;
};


