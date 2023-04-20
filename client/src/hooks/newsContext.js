import React, { useContext, useState, useEffect } from "react";

// create a context
const NewsContext = React.createContext();

function NewsProvider({ children }) {
  // state to be provided
  const [news, setNews] = useState([]);
  const value = { news, setNews };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

// custom hook, access context
const useNews = () => useContext(NewsContext);

export { useNews, NewsProvider };
