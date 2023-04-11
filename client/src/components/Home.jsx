import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import useNews from "../hooks/useNews";
import { Outlet, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  const [news, setNews] = useNews();

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
        {news &&
        <ul className="newsList">
        {news.map((item,index)=>{
          return (
            <li key={index} className="todo-item">
              <Link to={`/news/${index}`}>{item.title}</Link>
              {/* <div className="itemName">{item.title}</div> */}
            </li>)})}
             </ul>}
     
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
