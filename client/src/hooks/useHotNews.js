import { useState, useEffect } from "react";

export function useHotNews() {
  const [hotNews, setHotNews] = useState([]);

  useEffect(() => {
    async function getHotNews() {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines/?` +
          `country=us` +
          `&apiKey=${process.env.REACT_APP_NEWS_ID}`
      );
      if (!res.ok) {
        console.log("Network response was not ok");
      } else {
        const data = await res.json();
        setHotNews(data.articles);
      }
    }

    getHotNews();
  }, []);

  return [hotNews, setHotNews];
}
