import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export function useNews() {
  const [news, setNews] = useState([]);
  const [tempNews, setTempNews] = useState([]);
  const to_date = new Date().toISOString().slice(0, 10);
  const today = new Date(to_date);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yyyy = yesterday.getFullYear().toString();
  const mm = (yesterday.getMonth() + 1).toString().padStart(2, "0");
  const dd = yesterday.getDate().toString().padStart(2, "0");
  const from_date = yyyy + "-" + mm + "-" + dd;

  useEffect(() => {
    async function getNews() {
      // const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${process.env.REACT_APP_NEWS_ID}`);
      const res = await fetch(
        `https://newsapi.org/v2/everything?` +
          `q=business` +
          `&language=en` +
          `&sortBy=popularity` +
          `&from=${from_date}&to=${to_date}` +
          `&apiKey=${process.env.REACT_APP_NEWS_ID}`
      );
      const data = await res.json();
      setNews(data.articles.slice(0, 21));
      setTempNews(data.articles.slice(0, 21));
    }

    getNews();
  }, []);

  return [
    [news, setNews],
    [tempNews, setTempNews],
  ];
}

export function useHotNews() {
  const [hotNews, setHotNews] = useState([]);

  useEffect(() => {
    async function getHotNews() {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines/?` +
          `country=us` +
          `&apiKey=${process.env.REACT_APP_NEWS_ID}`
      );
      const data = await res.json();
      setHotNews(data.articles);
    }

    getHotNews();
  }, []);

  return [hotNews, setHotNews];
}
