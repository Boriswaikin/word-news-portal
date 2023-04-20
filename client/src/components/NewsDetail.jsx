import "../style/newsDetail.css";
import { useNavigate, useParams ,useLocation} from "react-router-dom";
import { useNews, useHotNews} from "../hooks/useNews";
import useBookmarks from "../hooks/useBookmarks";
import { Outlet, Link } from "react-router-dom";
import 'boxicons';
import { useState ,useEffect} from "react";
import { useAuthToken } from "../AuthTokenContext";
import AppLayout from "./AppLayout";
import { PopupCancelledError } from "@auth0/auth0-spa-js";

export default function NewsDetail() {
  // const [news] = useNews()[0];
  // const [hotNews] = useHotNews();
  const [bookmarks] = useBookmarks();
  
  const {sourceID, newsID} = useParams();
  const id = parseInt(newsID);
  // const thisNews = useLocation().state.data;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const newsList = JSON.parse(decodeURIComponent(query.get('data')));

  let thisNews;
  switch(sourceID){
    case "news":
      thisNews = newsList;
      break;
    case "hotNews":
      thisNews = newsList;
      break;
    // case "bookmarks":
    //   thisNews = bookmarks.filter((item)=>item.urlToImage!==null)[id];
    //   break;
    default:
  }

  // const thisNews = news.filter((item)=>item.urlToImage!==null)[id];
  // console.log(thisNews);

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
