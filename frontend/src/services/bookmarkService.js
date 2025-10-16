import http from "./http";

export const add = async (storyId) => {
  const { data } = await http.post(`/api/bookmarks/${storyId}`);
  return data;
};

export const remove = async (storyId) => {
  const { data } = await http.delete(`/api/bookmarks/${storyId}`);
  return data;
};

export const listMine = async () => {
  const { data } = await http.get(`/api/bookmarks/me/list`);
  return data;
};

export const addNews = async ({ url, title, sourceName, imageUrl }) => {
  const { data } = await http.post(`/api/bookmarks/news`, { url, title, sourceName, imageUrl });
  return data;
};

export const removeNews = async (url) => {
  const { data } = await http.delete(`/api/bookmarks/news`, { params: { url } });
  return data;
};

export const listMyNews = async () => {
  const { data } = await http.get(`/api/bookmarks/news/me/list`);
  return data;
};


