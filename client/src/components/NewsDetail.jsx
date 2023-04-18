import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import {useNews,useHotNews} from "../hooks/useNews";
import { Outlet, Link } from "react-router-dom";
import 'boxicons';
import { useState ,useEffect} from "react";
import { useAuthToken } from "../AuthTokenContext";
import AppLayout from "./AppLayout";

export default function NewsDetail() {
  const {newsID} = useParams();
  const id = parseInt(newsID);
  const [news, setNews] = useNews()[0];
  const thisNews = news[id];
  console.log(thisNews);

  return (
    <>
    <AppLayout></AppLayout>
      <h1>{thisNews?.title}</h1>
      <div>{`Author: ${thisNews?.author}`}</div>
      <div>{`Published: ${thisNews?.publishedAt.substring(0, 10)}`}</div>
      <img src={thisNews?.urlToImage} alt="News_Image"></img>
      <article>{`Content: ${thisNews?.content}`} <a href={thisNews?.url}>[Read More]</a></article>
      
    </>
  )
}
