import React, { useContext, useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

const BookmarkContext = React.createContext();

function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const value = { bookmarks, setBookmarks };
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getBookmarks() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/news`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBookmarks(
          data.map((item) => ({
            id: item.id,
            title: item.title,
            displayTitle: item.displayTitle,
            category: item.category,
            publishDate: item.publishDate,
          }))
        );
      }
    }
    if (accessToken) {
      getBookmarks();
    }
  }, [accessToken]);

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

// custom hook, access context
const useBookmark = () => useContext(BookmarkContext);

export { useBookmark, BookmarkProvider };
