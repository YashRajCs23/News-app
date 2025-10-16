// src/services/newsService.js
import http from "./http";

const base = "/api/news";

export const getNewsByCategory = async (category = "general") => {
  const { data } = await http.get(base, { params: { category } });
  return data.articles || data;
};

export const getNewsById = async (id) => {
  const { data } = await http.get(`${base}/${id}`);
  return data;
};

export const searchNews = async (query) => {
  const { data } = await http.get(`${base}/search`, { params: { q: query } });
  return data.articles || data;
};
