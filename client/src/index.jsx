
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Bookmarks from "./components/Bookmarks";
import TodoDetail from "./components/TodoDetail";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import "./style/normalize.css";
import "./style/index.css";
import { NewsProvider } from "./hooks/newsContext";

const container = document.getElementById("root");

const requestedScopes = [
  "profile",
  "email",
  "read:todoitem",
  "read:user",
  "edit:todoitem",
  "edit:user",
  "delete:todoitem",
  "delete:user",
  "write:user",
  "write:todoitem",
];

// authentication required to access the app, otherwise redirect to home
function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider> 
        <BrowserRouter>
          <Routes>
            {/* pages that don't require authentication */}
            <Route path="/" element={<AppLayout />} >
              <Route index element={<Home />} />
              <Route path=":sourceID/:newsID" element={<NewsDetail />} />  
            </Route>
            <Route path="/verify-user" element={<VerifyUser />} />
            {/* pages that require authentication */}
            <Route path="app" element={
                <RequireAuth>
                  <AppLayout/>
                </RequireAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path=":sourceID/:newsID" element={<NewsDetail />} />
              <Route path="chatGPT/:newsID" element={<ChatGPT />} />
              <Route path="debugger" element={<AuthDebugger />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
