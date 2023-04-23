import { useState, useEffect } from "react";

export function useHotNews() {
  const [hotNews, setHotNews] = useState([]);

  useEffect(() => {
    async function getHotNews() {
      console.log("Getting hot news");
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines/?` +
          `country=us` +
          `&apiKey=${process.env.REACT_APP_NEWS_ID}`
      );
      if (!res.ok) {
        console.log("Network response was not ok");
        return;
      }
      const data = await res.json();
      setHotNews(data.articles);
      console.log(data.articles);
    }

    getHotNews();
  }, []);

  return [hotNews, setHotNews];
}
