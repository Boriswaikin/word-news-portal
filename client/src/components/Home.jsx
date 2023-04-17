import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {useNews,useHotNews} from "../hooks/useNews";
import { Outlet, Link } from "react-router-dom";
import 'boxicons';
import { useState ,useEffect} from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  const [news, setNews] = useNews()[0];
  const [tempNews, setTempNews] = useNews()[1];
  const [hotNews, setHotNews] = useHotNews();
  const [text, setText] = useState("");
  const { user, isLoading, logout } = useAuth0();
  const [category,setCategory]=useState('business');
  const [bookmarks, setBookmarks] = useState([]);
  const { accessToken } = useAuthToken();
  const to_date = new Date().toISOString().slice(0, 10);
  const today = new Date(to_date);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yyyy = yesterday.getFullYear().toString();
  const mm = (yesterday.getMonth() + 1).toString().padStart(2, '0');
  const dd = yesterday.getDate().toString().padStart(2, '0');
  const from_date = yyyy + '-' + mm + '-' + dd;
  const [fromDate,setFromDate]= useState(from_date);
  const [toDate,setToDate]= useState(to_date);

  useEffect(()=>{
    setNews(tempNews);
    if(text){
    setNews((prevItem)=> prevItem.filter((item)=>
    item.title.toLowerCase().includes(text.toLowerCase())));}
  },[text])

  useEffect(()=>{
  async function getNewsCategory(){
    // const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.REACT_APP_NEWS_ID}`);
    const res = await fetch(
      `https://newsapi.org/v2/everything?`+
      `q=${category}`+
      `&language=en`+
      `&sortBy=popularity`+
      `&from=${fromDate}&to=${toDate}`+
      `&apiKey=${process.env.REACT_APP_NEWS_ID}`);
    const data = await res.json();
    setNews(data.articles.slice(0,21));
    setTempNews(data.articles.slice(0,21));
  }
  getNewsCategory();

},[category,fromDate,toDate])

  async function getNewsByDate(from_Date,to_Date){
  
      const res = await fetch(
        `https://newsapi.org/v2/everything?`+
        `q=${category}`+
        `&language=en`+
        `&sortBy=popularity`+
        `&from=${from_Date}&to=${to_Date}`+
        `&apiKey=${process.env.REACT_APP_NEWS_ID}`)
      const data = await res.json();
      setNews(data.articles.slice(0,21));
      setFromDate(from_Date);
      setToDate(to_Date);
    }

async function insertBookmarks(itemTitle,itemCategory,itemPublishDate) {
  const data = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: itemTitle,
      category: itemCategory,
      publishDate: itemPublishDate,
    }),
  });
  if (data.ok) {
    const todo = await data.json();
    return todo;
  } else {
    return null;
  }
}

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
  }
}

useEffect(()=>{
  if (isAuthenticated){
  async function getBookmarks() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setBookmarks(data.map(item=>(
          {
          id: item.id,
          title: item.title,
          category: item.category,
          publishDate: item.publishDate}
        )));
    }
  }

  getBookmarks();
  }},[bookmarks.length]);


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
        <div className="search-panel">
          <div className="search-subPanel">
            <input
              type="text"
              name="search"
              id="search"
              className="search"
              placeholder="Search for the news!"
              onChange={(e) => {
                setText(e.target.value)}}
            />
          </div>
      {isAuthenticated && 
        <div className="search-date-panel">
          <div className="search-date-subPanel">
            <p>Date Range</p>
            <div className ="date-panel">
              <div className ="date-panel" >
                <p className="date-range">From</p>
                <input type="date" id="from-date" name="from-date" className="date"></input>
              </div>
              <div className ="date-panel">
                <p className="date-range">To</p>
                <input type="date" id="to-date" name="to-date" className="date"></input>
              </div>
            </div>
          </div>
        <button title="Search" className="search-news-by-date" onClick={
          ()=>{
            const from_date= document.getElementById("from-date").value;
            const to_date= document.getElementById("to-date").value;
            getNewsByDate(from_date,to_date)}}>Search</button>
            </div>}
        </div>
        <div className="category-wrapButton">
        <button className="category-Button category-business" title="Business" onClick={()=>
          {setCategory('business')}}>
            Business</button>
          <button className="category-Button category-entertainment" title="Entertainment" onClick={()=>
          {setCategory('entertainment')}}>
           Entertainment</button>
          <button className="category-Button category-health" title="Health" onClick={()=>
          {setCategory('health')}}>
           Health</button>
          <button className="category-Button category-science" title="Science" onClick={()=>
          {setCategory('science')}}>
            Science</button>
          <button className="category-Button category-sports" title="Sports" onClick={()=>
          {setCategory('sports')}}>
            Sports</button>
          <button className="category-Button category-technology" title="technology" onClick={()=>
          {setCategory('technology')}}>
          Technology</button>
        </div>
        {/* <select id="sel" onChange={
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
        </select> */}

        {news &&
        <ul className="newsList">
          <div className="category-news">
        {news.filter(item=>item.urlToImage!==null).map((item,index)=>{
          return (
              <li key={index} className="news-item">
                <img className="newsImage" src={item.urlToImage} alt="Logo"></img>
              <div className="news-subItem">
              <Link className="item-link" to={`/news/${index}`}>{item.title}</Link>
              <p className="item-date">{item.publishedAt}</p>
              <div className="item-button">
              <button className="item-subButton" title="bookmark" onClick={
                ()=>{
                if (!isAuthenticated){
                loginWithRedirect();}
                else{
                  const bookmarksTitle= bookmarks.map(item=>item.title);
                  if(!bookmarksTitle.includes(item.title)){
                  insertBookmarks(item.title,!category?"general":category,item.publishedAt.substring(0,10))
                  setBookmarks((prev)=>[...prev,{title:item.title,
                      category: !category?"business":category}])
                  }
                  else {
                    const filterBookmark= bookmarks.filter((element)=>
                    element.title===item.title);
                    const deleteID = parseInt(filterBookmark[0].id);
                    deleteBookmarks(deleteID);
                    setBookmarks((prev)=>prev.filter((element)=>element.title!==item.title))
                  }
                } 
                }}>
                {isAuthenticated && bookmarks.map(item=>item.title).includes(item.title)?<box-icon class ="bookmark-logo" color="slateblue" type="solid" name='bookmark-alt'></box-icon>:<box-icon class ="bookmark-logo" name='bookmark'></box-icon>}
              </button>
              <button className="item-subButton" title="Ask chatGPT" onClick={()=>console.log("Ask GPT")}>
                <box-icon class="chatGPT-logo" name='question-mark'></box-icon>
              </button>
              </div>
              </div>

            </li>)})}
            </div>
            <div className="top-news">
                  <h2 className="top-news-header">LATEST</h2>
                  <h2 className="top-news-header">HOT NEWS</h2>
                  {hotNews && hotNews.slice(0,5).map((item,index)=>{
          return (
              <li key={index} className="top-news-item">
                  <div className="top-news-subitem">
                    <p className="top-news-index">{index+1}</p>
                    <div className="top-news-info">
                    <p className="top-news-category">{item.source.name}</p>
                    <Link className="item-link top-news-link" to={`/news/${index}`}>{item.title}</Link>
                    </div>
                  </div>
                </li>)})}
            </div>
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
