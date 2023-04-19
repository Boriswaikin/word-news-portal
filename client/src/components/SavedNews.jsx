import "../style/newsDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import {useNews,useHotNews} from "../hooks/useNews";
import { Outlet, Link } from "react-router-dom";
import 'boxicons';
import { useState ,useEffect} from "react";
import { useAuthToken } from "../AuthTokenContext";
import AppLayout from "./AppLayout";

export default function SavedNews() {
  const {newsID} = useParams();
  const id = parseInt(newsID);
  const [news, setNews] = useNews()[0];
  const thisNews = news[id];
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
