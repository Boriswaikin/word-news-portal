import "../style/appLayout.css";

import {Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import 'boxicons';

export default function AppLayout({bookmarks}) {
  const { user, isLoading, logout } = useAuth0();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
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
      {/* <div>Welcome 👋 {user.name} </div> */}
    </div>
  );
}
