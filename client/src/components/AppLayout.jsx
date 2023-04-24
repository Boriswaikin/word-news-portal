import "../style/appLayout.css";
import 'boxicons'
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="header">
        <Link  className="heading-link" to="/">
          <h2 >PressSphere</h2>
        </Link>
        <nav className="menu">
          <ul className="menu-list">
            <li>
              {
                isAuthenticated ? (
                  <Link to="/app/bookmarks" title="Bookmarks page" aria-label="Bookmarks page">
                    <box-icon class="user-logo" name='bookmark-alt'></box-icon>
                  </Link>) :
                  (<></>)
              }
            </li>
            <li>
              {
                isAuthenticated ? (
                  <Link to="/app/Profile"  title="Profile page" aria-label="Profile page">
                    <box-icon class="user-logo" name='user'></box-icon>
                  </Link>) :
                  (<></>)
              }
            </li>
            <li>
              {
                !isAuthenticated ? (
                  <button className="exit-button" onClick={loginWithRedirect}>
                    LOG IN
                  </button>) :
                  (<button className="exit-button" onClick={() => logout({ returnTo: window.location.origin })}>
                    LOG OUT
                  </button>)
              }
            </li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
