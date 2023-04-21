import "../style/newsDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { useNews } from "../hooks/newsContext";
import { useHotNews } from "../hooks/useHotNews";
import useBookmarks from "../hooks/useBookmarks";
import { useState ,useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";



export default function NewsDetail() {
  const { news } = useNews();
  const [ hotNews ] = useHotNews();
  const [ bookmarks ] = useBookmarks();
  const { accessToken } = useAuthToken();
  const [ newsDetail, setNewsDetail ] = useState([]);

  const { sourceID, newsID } = useParams();
  const id = parseInt(newsID);

  useEffect(() => {
    async function getNewsDetail(id) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/news/` + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const formatData = data.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          urlToImage: item.imageURL,
          author: item.author,
          url: item.articleURL,
        }));
        setNewsDetail(formatData);
      }
    }

    if(accessToken && bookmarks?.[id]){
      getNewsDetail(bookmarks[id].id);
    }
  }, [accessToken, bookmarks]);

  let thisNews;
  switch(sourceID){
    case "news":
      thisNews = news[id];
      break;
    case "hotNews":
      thisNews = hotNews[id];
      break;
    case "bookmarks":
      thisNews = newsDetail[0];
      break;
    default:
  }

  return (
    <>
      <h1>{thisNews?.title}</h1>
      <p>{`Author: ${thisNews?.author}`}</p>
      <img src={thisNews?.urlToImage} className="detail_image" alt="News_Image"></img>
      <article>{thisNews?.content} <a href={thisNews?.url}>[Read More]</a></article>
      
    </>
  )
}
