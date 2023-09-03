import { useState, useEffect } from "react";

export function useHotNews() {
  const [hotNews, setHotNews] = useState([]);

  useEffect(() => {
    async function getHotNews() {
      const res = await fetch(
        `https://gnews.io/api/v4/top-headlines?` +
          `category=general` +
          `&lang=en` +
          `&apikey=${process.env.REACT_APP_NEWS_ID}`
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