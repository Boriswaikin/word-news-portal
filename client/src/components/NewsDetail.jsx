import "../style/newsDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { useNews, useHotNews} from "../hooks/useNews";
import useBookmarks from "../hooks/useBookmarks";
// import { Outlet, Link } from "react-router-dom";
// import 'boxicons';
import { useState ,useEffect} from "react";
import { useAuthToken } from "../AuthTokenContext";


export default function NewsDetail() {
  const [news] = useNews()[0];
  const [hotNews] = useHotNews();
  const [bookmarks] = useBookmarks();
  const {accessToken} = useAuthToken();
  const [newsDetail, setNewsDetail] = useState([]);

  useEffect(() => {
    async function getNewsDetail() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const trimmedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          urlToImage: item.imageURL,
          author: item.author,
          url: item.articleURL,
        }));
        setNewsDetail(trimmedData);
      }
    }

    getNewsDetail();

  }, [bookmarks, accessToken]);
  
  const {sourceID, newsID} = useParams();
  const id = parseInt(newsID);

  let thisNews;
  switch(sourceID){
    case "news":
      thisNews = news[id];
      break;
    case "hotNews":
      thisNews = hotNews[id];
      break;
    case "bookmarks":
      const detailList = newsDetail.filter((item) => item.title === bookmarks[id]?.title);
      thisNews = detailList[0];
      // if(bookmarks[id]){
      //   thisNews.publishedAt = bookmarks[id].publishDate;
      // }
      console.log(thisNews);
      break;
    default:
  }

  return (
    <>
      <h1>{thisNews?.title}</h1>
      <div className="news-detail">
        <div>{`Author: ${thisNews?.author}`}</div>
        <div>{`Published: ${thisNews?.publishedAt}`}</div>
      </div>
      <img src={thisNews?.urlToImage} alt="News_Image"></img>
      <article>{thisNews?.content} <a href={thisNews?.url}>[Read More]</a></article>
      
    </>
  )
}
