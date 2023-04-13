import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import useNews from "../hooks/useNews";
import { Outlet, Link } from "react-router-dom";
import 'boxicons';
import { useState ,useEffect} from "react";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  const [news, setNews] = useNews()[0];
  const [tempNews, setTempNews] = useNews()[1];
  const [text, setText] = useState("");
  const { user, isLoading, logout } = useAuth0();
  const [category,setCategory]=useState("");

  useEffect(()=>{
    setNews(tempNews);
    if(text){
    setNews((prevItem)=> prevItem.filter((item)=>
    item.title.toLowerCase().includes(text.toLowerCase())));}
  },[text])

  useEffect(()=>{
  async function getNewsCategory(){
    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.REACT_APP_NEWS_ID}`);
    const data = await res.json();
    setNews(data.articles);
    setTempNews(data.articles);
  }
  getNewsCategory();

},[category])


  return (
    <div className="home">
      {/* <h1>World News</h1> */} 
      <div className="header">
      <Link  className="heading-link" to="http://localhost:3000/">
        <h2 >World News</h2>
      </Link>
            <nav className="menu">
          <ul className="menu-list">
            <li>
            {isAuthenticated?(
            
            <Link to="/app/Profile">
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
      <div className="section-news">

       {/* <button className="category-Button" onClick={
        ()=>{getNewsCategory('business');}}>
        <p>business</p>        
        </button> */}
        <select id="sel" onChange={
          
          (e)=>{
            document.getElementById('search').value = ''
          setCategory(e.target.value)}}>
          <option value='general'>General</option>
          <option value='business'>Business</option>
          <option value='entertainment'>Entertainment</option>
          <option value='health'>Health</option>
          <option value='science'>Science</option>
          <option value='sports'>Sports</option>
          <option value='technology'>Technology</option>
        </select>
        <input
        type="text"
        name="search"
        id="search"
        className="search"
        placeholder="Search on the news!"
        onChange={(e) => {
          setText(e.target.value)}}
      />
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
      </div>
    </div>
    
  );
}
