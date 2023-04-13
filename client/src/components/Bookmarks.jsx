import "../style/bookmarks.css";
import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { Outlet, Link,useLocation } from "react-router-dom";

export default function Bookmarks() {
  const { accessToken } = useAuthToken();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  const { user, isLoading, logout } = useAuth0();
  let {bookmarks}= useLocation().state;

  return (
    <div className="home">
      <div className="header">
      <Link  className="heading-link" to="http://localhost:3000/">
        <h2 >World News</h2>
      </Link>
            <nav className="menu">
          <ul className="menu-list">
            <li>
            {isAuthenticated?(
            <Link to="/bookmarks" state={{bookmarks:bookmarks}}>
               <box-icon name='bookmark-alt'></box-icon>
            </Link>):
            (<></>)
            }
            </li>
            <li>
            {isAuthenticated?(
            
            
            <Link to="/Profile">
               <box-icon class="user-logo" name='user'></box-icon>
            </Link>):
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
        </div>
        {/* <div>Welcome 👋 {user.name} </div> */}
      <div className="todo-list">
      <ul className="bookmark-list">
      {bookmarks && bookmarks.map((item,index) => {
          return (
            <li 
              key={index} className="bookmark-item">
                <Link to={`/news/${index}`} className="bookmark-link">{item.title}</Link>
                <p>{item.category}</p>
            </li>
            
          )})}
        </ul>
    </div>
    </div>
  );
}
