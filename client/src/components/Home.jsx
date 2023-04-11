import "../style/home.css";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  const [news,setNews]=useState([]);

  useEffect(()=>{
    async function getNews(){ 
      try {
        fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.REACT_APP_NEWS_ID}`)
        .then(response=>response.json())
        .then((data)=>{
          console.log(data.articles);
          setNews(data.articles)
          });
      }
      catch (err){
        console.log("fetch error");
      }
    }
    getNews();
  },[]);


  return (
    <div className="home">
      <h1>World News</h1>
      {/* <div className="btn-class"> */}
      {/* <button className="btn-primary" onClick={{}}>
            Home
      </button>
      <button className="btn-primary" onClick={{}}>
            Profile
      </button>
      <button className="btn-primary" onClick={{}}>
            Bookmarks 
      </button> */}
      {/* </div> */}
      <ul className="newsList">
        {news.map((item,index)=>{
          return (
            <li key={index} className="todo-item">
              <span className="itemName">{item.articles}</span>
            </li>)
        })}
      </ul>
      <div> 
        {!isAuthenticated ? (
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        )}
      </div>
      <div>
        <button className="btn-secondary" onClick={signUp}>
          Create Account
        </button>
      </div>
    </div>
  );
}
