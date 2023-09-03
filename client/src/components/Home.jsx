import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useHotNews } from "../hooks/useHotNews";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useBookmark } from "../hooks/markContext";
import { useNews } from "../hooks/newsContext";

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { accessToken } = useAuthToken();

  const { news, setNews } = useNews();
  const [ hotNews ] = useHotNews();
  const { bookmarks, setBookmarks } = useBookmark();

  const [ text, setText ] = useState("");
  const [ category, setCategory ] = useState('business');
 

  const to_date = new Date().toISOString().slice(0, 10);
  const today = new Date(to_date);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yyyy = yesterday.getFullYear().toString();
  const mm = (yesterday.getMonth() + 1).toString().padStart(2, "0");
  const dd = yesterday.getDate().toString().padStart(2, "0");
  const from_date = yyyy + "-" + mm + "-" + dd;
  const [fromDate, setFromDate] = useState(from_date);
  const [toDate, setToDate] = useState(to_date);

  useEffect(() => {
    async function getNews() {
      const res = await fetch(
        `https://gnews.io/api/v4/search?` +
          `q=${category}` +
          `&lang=en` +
          `&country=us` + 
          `&sortBy=publishedAt` +
          `&from=${fromDate}&to=${toDate}` +
          `&apikey=` + `${process.env.REACT_APP_NEWS_ID}`
      );
      if(!res.ok) {
        console.log("fail to fetch news");
        return;
      }
      const data = await res.json();
      // filter out articles without images
      let trimmedData = data.articles.filter(
        (item) => item.image !== null
      );
      // trim the publishedAt date
      for (const item of trimmedData) {
        item.publishedAt = item.publishedAt.slice(0, 10);
      }
      trimmedData = trimmedData.slice(0, 21);
      setNews(trimmedData);
    }
    getNews();
  }, [category, fromDate, toDate]);

  // post news to database
  async function insertBookmarks(title, category, publishDate, content, image, author, url) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: title,
        category: category,
        publishDate: publishDate,
        displayTitle: title,
        content: content,
        image: image,
        author: author,
        url: url,
      }),
    });
    if (data.ok) {
      const { news } = await data.json();
      setBookmarks([...bookmarks, news]);
    } else{
      console.log("fail to insert news");
    }
  }

  async function deleteBookmarks(deleteID) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/news/` + deleteID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!data.ok) {
      console.log("fail to delete news");
    }
  }

  return (
    <div className="home">
      <div className="section-news">
        <div className="search-panel">
          <div className="search-subPanel">
            <input
              type="text"
              name="search"
              id="search"
              className="search"
              placeholder="Search for the news!"
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="search-date-panel">
            <div className="search-date-subPanel">
              <p className="date-header">Date Range</p>
              <div className="date-panel">
                  <p className="date-range">From</p>
                  <input
                    type="date"
                    id="from-date"
                    name="from-date"
                    className="date"
                    aria-label="Starting Date"
                  ></input>
                  <p className="date-range">To</p>
                  <input
                    type="date"
                    id="to-date"
                    name="to-date"
                    className="date"
                    aria-label="End Date"
                  ></input>
              </div>
            </div>
            <button title="Search" className="search-news-by-date" onClick={
              ()=>{
                const from_date= document.getElementById("from-date").value;
                const to_date= document.getElementById("to-date").value;
                const dateDiff=(today.getTime()-new Date(from_date).getTime())/(1000 * 60 * 60 * 24);
                if (new Date(from_date).getTime()>new Date(to_date).getTime()){
                  alert("Starting date cannot be after the End date")
                }
                else if(dateDiff>30||dateDiff<0||new Date(to_date).getTime()>new Date(today).getTime()){
                  alert("Input date must be within 30 days from now")
                }
                else{
                setFromDate(from_date);
                setToDate(to_date);}
                }
              }>
              Search
            </button>
          </div>
        </div>
        <div className="category-wrapButton">
          <button className="category-Button category-business" title="Business" 
                  onClick={() => setCategory('business')}>
            Business
          </button>
          <button className="category-Button category-entertainment" title="Entertainment" 
                  onClick={() => setCategory('entertainment')}>
            Entertainment
          </button>
          <button className="category-Button category-health" title="Health" 
                  onClick={() => setCategory('health')}>
            Health
          </button>
          <button className="category-Button category-science" title="Science" 
                  onClick={() => setCategory('science')}>
            Science
          </button>
          <button className="category-Button category-sports" title="Sports" 
                  onClick={() => setCategory('sports')}>
            Sports
          </button>
          <button className="category-Button category-technology" title="technology" 
                  onClick={() => setCategory('technology')}>
            Technology
          </button>
        </div>

        <ul className="newsList">
          <div className="category-news">
          { news.map((item,index) => {
            return item.title.toLowerCase().includes(text.toLowerCase()) ? 
           (
              <li key={index} className="news-item">
                <img className="newsImage" src={item.image} alt="Logo"></img>
                <div className="news-subItem">
                  <Link className="item-link" to={`details/${index}`} aria-label="To news detail">{item.title}</Link>
                  <div className="news-remarks">
                  <p className="item-date">{item.publishedAt}</p>
                  <div className="item-button">
                    <button className="item-subButton" title="bookmark" onClick={() =>
                      {
                        if (!isAuthenticated){
                          loginWithRedirect();
                        }
                        else{
                          const bookmarksTitle = bookmarks.map(item => item.title);
                          if(!bookmarksTitle.includes(item.title)){
                            insertBookmarks(item.title, category, item.publishedAt, item.content, item.image, "null", item.url);
                          }
                          else {
                            const filterBookmark = bookmarks.filter((element)=> element.title===item.title);
                            const deleteID = parseInt(filterBookmark[0].id);
                            deleteBookmarks(deleteID);
                            setBookmarks((prev)=>prev.filter((element)=>element.title!==item.title))
                          }
                        } 
                      }}>
                      { isAuthenticated && bookmarks.map(item=>item.title).includes(item.title)?<box-icon class ="bookmark-logo" color="slateblue" type="solid" name='bookmark-alt'></box-icon>:<box-icon class ="bookmark-logo" name='bookmark'></box-icon>}
                    </button>
                  </div>
                  </div>
                </div>
              </li>
            ) : <></>
          })}
          </div>
          <li className="top-news">
            <h2 className="top-news-header">LATEST</h2>
            <h2 className="top-news-header">HOT NEWS</h2>
            <ul className="top-news-list">
              { hotNews && hotNews.slice(0,5).map((item,index)=>{
                return (
                  <li key={index} className="top-news-item">
                    <div className="top-news-subitem">
                      <p className="top-news-index">{index+1}</p>
                      <div className="top-news-info">
                        <p className="top-news-category">{item.source.name}</p>
                        <Link className="item-link top-news-link" to={`hotNews/${index}`}>{item.title}</Link>
                      </div>
                    </div>
                  </li>
              )})}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
