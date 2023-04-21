import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
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

  return [bookmarks, setBookmarks];
}
