import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getBookmarks() {
      // TODO: change to news
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
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
  }, []);

  return [bookmarks, setBookmarks];
}
