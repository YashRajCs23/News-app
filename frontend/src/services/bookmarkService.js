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


