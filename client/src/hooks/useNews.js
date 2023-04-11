import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useNews() {
  const [news, setNews] = useState();

  useEffect(() => {
    async function getNews() {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.REACT_APP_NEWS_ID}`
      );
      const data = await res.json();

      setNews(data.articles);
    }

    getNews();
  }, []);

  return [news, setNews];
}
