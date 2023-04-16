import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export function useNews() {
  const [news, setNews] = useState();
  const [tempNews, setTempNews] = useState();


  useEffect(() => {
    async function getNews() {
      
      const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${process.env.REACT_APP_NEWS_ID}`);
      const data = await res.json();
      setNews(data.articles);
      setTempNews(data.articles);
    }

    getNews();
  }, []);

  return [[news, setNews], [tempNews, setTempNews]];
}

export function useHotNews() {
  const [hotNews, setHotNews] = useState();

  useEffect(() => {
    async function getHotNews() {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines/sources?country=us&apiKey=${process.env.REACT_APP_NEWS_ID}`
      );
      const data = await res.json();
      setHotNews(data.sources);
    }

    getHotNews();
  }, []);

  return [hotNews, setHotNews];
}