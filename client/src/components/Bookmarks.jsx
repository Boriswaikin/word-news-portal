import "../style/bookmarks.css";
import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { Outlet, Link,useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import AppLayout from "./AppLayout";

export default function Bookmarks() {
  const { accessToken } = useAuthToken();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  const { user, isLoading, logout } = useAuth0();
  const {bookmarks}= useLocation().state;
  const [newsInBookmark,setNewsInBookmark]=useState([]);

  useEffect(()=>{
    setNewsInBookmark(bookmarks);
  },[])

  async function deleteBookmarks(deleteID) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/` + deleteID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (data.ok) {
      await data.json();
      console.log("delete success");
      setNewsInBookmark((prev)=>prev.filter((element)=>element.id!==deleteID));
    }
  }

  return (
    <div className="home">
      <AppLayout bookmarks={bookmarks}></AppLayout>
      <div className="todo-list">
      <ul className="bookmark-list">
      {newsInBookmark && newsInBookmark.map((item,index) => {
          return (
            <li 
              key={index} className="bookmark-item">
                <Link to={`/news/${index}`} className="bookmark-link">{item.title}</Link>
                <p>{item.category}</p>
                <p className="bookmarks-publishDate">{item.publishDate}</p>
                <button className="delete-bookmarks" onClick={()=>deleteBookmarks(item.id)}>
                  <box-icon class="delete-bookmarks-icon" name='trash'></box-icon>
              </button>
            </li>
            
          )})}
        </ul>
    </div>
    </div>
  );
}
