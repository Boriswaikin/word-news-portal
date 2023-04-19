import "../style/newsDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { useNews, useHotNews} from "../hooks/useNews";
import useBookmarks from "../hooks/useBookmarks";
import { Outlet, Link } from "react-router-dom";
import 'boxicons';
import { useState ,useEffect} from "react";
import { useAuthToken } from "../AuthTokenContext";
import AppLayout from "./AppLayout";

export default function NewsDetail() {
  const [news] = useNews()[0];
  const [hotNews] = useHotNews();
  const [bookmarks] = useBookmarks();
  
  const {sourceID, newsID} = useParams();
  const id = parseInt(newsID);

  let newsList;
  switch(sourceID){
    case "news":
      newsList = news;
      break;
    case "hotNews":
      newsList = hotNews;
      break;
    case "bookmarks":
      newsList = bookmarks;
      break;
    default:
  }
 
  const thisNews = newsList.filter((item)=>item.urlToImage!==null)[id];
  console.log(thisNews);

  return (
    <>
      <h1>{thisNews?.title}</h1>
      <div className="news-detail">
        <div>{`Author: ${thisNews?.author}`}</div>
        <div>{`Published: ${thisNews?.publishedAt.substring(0, 10)}`}</div>
      </div>
      <img src={thisNews?.urlToImage} alt="News_Image"></img>
      <article>{thisNews?.content} <a href={thisNews?.url}>[Read More]</a></article>
      
    </>
  )
}
