import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import useNews from "../hooks/useNews";
import { Outlet, Link } from "react-router-dom";
import 'boxicons';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  const [news, setNews] = useNews();

  const { user, isLoading, logout } = useAuth0();

  return (
    <div className="home">
      {/* <h1>World News</h1> */} 
      <div className="header">
      <Link  className="heading-link" to="/">
        <h2 >World News</h2>
      </Link>
            <nav className="menu">
          <ul className="menu-list">
            <li>
            {isAuthenticated?(<Link to="/app/Profile">Profile</Link>):
            (<></>)
            }
            </li>
            <li>
              {!isAuthenticated?(<button
                className="exit-button"
                onClick={loginWithRedirect}
              >
                SignIn
              </button>):
              (<button
                className="exit-button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                LogOut
              </button>)
              }
            </li>
          </ul>
          
        </nav>
        {/* <div>Welcome 👋 {user.name} </div> */}
      </div>
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
            <li key={index} className="news-item">
              <Link to={`/news/${index}`}>{item.title}</Link>
              <div className="item-button">
              <button className="item-subButton" onClick={loginWithRedirect}>
                <box-icon class="bookmark-logo" name='star'></box-icon>
              </button>
              <button className="item-subButton" onClick={()=>console.log("Ask GPT")}>
                <box-icon class="chatGPT-logo" name='question-mark'></box-icon>
              </button>
              </div>
              {/* <div className="itemName">{item.title}</div> */}
            </li>)})}
             </ul>}
     
      {/* <div> 
        {!isAuthenticated ? (
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        )}
      </div> */}
      {/* <div>
        <button className="btn-secondary" onClick={signUp}>
          Create Account
        </button>
      </div> */}
      <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    </div>
    
  );
}
