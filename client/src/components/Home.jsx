import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useHotNews } from "../hooks/useNews";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import AppLayout from "./AppLayout";
import useBookmarks from "../hooks/useBookmarks";
import { useNews } from "../hooks/newsContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  // const [[news, setNews], [tempNews, setTempNews]] = useNews();
  const [hotNews, setHotNews] = useHotNews();
  const [text, setText] = useState("");
  const [bookmarks, setBookmarks] = useBookmarks();
  const [category, setCategory] = useState("business");
  const { accessToken } = useAuthToken();

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

  const { news, setNews } = useNews();

  useEffect(() => {
    async function getNews() {
      const res = await fetch(
        `https://newsapi.org/v2/everything?` +
          `q=${category}` +
          `&language=en` +
          `&sortBy=popularity` +
          `&from=${fromDate}&to=${toDate}` +
          `&apiKey=${process.env.REACT_APP_NEWS_ID}`
      );
      const data = await res.json();
      // filter out articles without images
      let trimmedData = data.articles.filter(
        (item) => item.urlToImage !== null
      );
      // trim the publishedAt date
      for (const item of trimmedData) {
        // TODO: back to full string when rendering
        item.publishedAt = item.publishedAt.slice(0, 10);
      }
      trimmedData = trimmedData.slice(0, 21);
      setNews(trimmedData);
    }

    getNews();
  }, [category, fromDate, toDate]);

  // post news draft to database
  async function insertBookmarks(itemTitle, itemCategory, itemPublishDate) {
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
        displayTitle: itemTitle,
      }),
    });
    if (data.ok) {
      const todo = await data.json();
      return todo;
    } else {
      return null;
    }
  }

  // post news details to database
  async function insertDetails(
    newsTitle,
    newsContent,
    newsImage,
    newsAuthor,
    newsURL
  ) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: newsTitle,
        content: newsContent,
        imageURL: newsImage,
        author: newsAuthor,
        articleURL: newsURL,
      }),
    });
    if (!data.ok) {
      alert("insert details failed");
    }
  }

  // TODO: delete details from database

  async function deleteBookmarks(deleteID) {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/todos/` + deleteID,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (data.ok) {
      await data.json();
      console.log("delete success");
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
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </div>
          <div className="search-date-panel">
            <div className="search-date-subPanel">
              <p>Date Range</p>
              <div className="date-panel">
                <div className="date-panel">
                  <p className="date-range">From</p>
                  <input
                    type="date"
                    id="from-date"
                    name="from-date"
                    className="date"
                    aria-label="Starting Date"
                  ></input>
                </div>
                <div className="date-panel">
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
            </div>
            <button
              title="Search"
              className="search-news-by-date"
              onClick={() => {
                const from_date = document.getElementById("from-date").value;
                const to_date = document.getElementById("to-date").value;
                setFromDate(from_date);
                setToDate(to_date);
              }}
            >
              Search
            </button>
          </div>
        </div>
        <div className="category-wrapButton">
          <button
            className="category-Button category-business"
            title="Business"
            onClick={() => setCategory("business")}
          >
            Business
          </button>
          <button
            className="category-Button category-entertainment"
            title="Entertainment"
            onClick={() => setCategory("entertainment")}
          >
            Entertainment
          </button>
          <button
            className="category-Button category-health"
            title="Health"
            onClick={() => setCategory("health")}
          >
            Health
          </button>
          <button
            className="category-Button category-science"
            title="Science"
            onClick={() => setCategory("science")}
          >
            Science
          </button>
          <button
            className="category-Button category-sports"
            title="Sports"
            onClick={() => setCategory("sports")}
          >
            Sports
          </button>
          <button
            className="category-Button category-technology"
            title="technology"
            onClick={() => setCategory("technology")}
          >
            Technology
          </button>
        </div>

        {news && (
          <ul className="newsList">
            <div className="category-news">
              {news.map((item, index) => {
                return item.title.toLowerCase().includes(text.toLowerCase()) ? (
                  <li key={index} className="news-item">
                    <img
                      className="newsImage"
                      src={item.urlToImage}
                      alt="Logo"
                    ></img>
                    <div className="news-subItem">
                      <Link className="item-link" to={`news/${index}`}>
                        {item.title}
                      </Link>
                      <p className="item-date">{item.publishedAt}</p>
                      <div className="item-button">
                        <button
                          className="item-subButton"
                          title="bookmark"
                          onClick={() => {
                            if (!isAuthenticated) {
                              loginWithRedirect();
                            } else {
                              const bookmarksTitle = bookmarks.map(
                                (item) => item.title
                              );
                              if (!bookmarksTitle.includes(item.title)) {
                                insertBookmarks(
                                  item.title,
                                  category,
                                  item.publishedAt
                                );
                                insertDetails(
                                  item.title,
                                  item.content,
                                  item.urlToImage,
                                  item.author,
                                  item.url
                                );
                                setBookmarks((prev) => [
                                  ...prev,
                                  { title: item.title, category: category },
                                ]);
                              } else {
                                const filterBookmark = bookmarks.filter(
                                  (element) => element.title === item.title
                                );
                                const deleteID = parseInt(filterBookmark[0].id);
                                deleteBookmarks(deleteID);
                                //deleteDetails(deleteID);
                                setBookmarks((prev) =>
                                  prev.filter(
                                    (element) => element.title !== item.title
                                  )
                                );
                              }
                            }
                          }}
                        >
                          {isAuthenticated &&
                          bookmarks
                            .map((item) => item.title)
                            .includes(item.title) ? (
                            <box-icon
                              class="bookmark-logo"
                              color="slateblue"
                              type="solid"
                              name="bookmark-alt"
                            ></box-icon>
                          ) : (
                            <box-icon
                              class="bookmark-logo"
                              name="bookmark"
                            ></box-icon>
                          )}
                        </button>
                        <button
                          className="item-subButton"
                          title="Ask chatGPT"
                          onClick={() => navigate(`/app/chatGPT/${index}`)}
                        >
                          <box-icon
                            class="chatGPT-logo"
                            name="question-mark"
                          ></box-icon>
                        </button>
                      </div>
                    </div>
                  </li>
                ) : (
                  <></>
                );
              })}
            </div>
            <li className="top-news">
              <h2 className="top-news-header">LATEST</h2>
              <h2 className="top-news-header">HOT NEWS</h2>
              <ul>
                {hotNews &&
                  hotNews.slice(0, 5).map((item, index) => {
                    return (
                      <li key={index} className="top-news-item">
                        <div className="top-news-subitem">
                          <p className="top-news-index">{index + 1}</p>
                          <div className="top-news-info">
                            <p className="top-news-category">
                              {item.source.name}
                            </p>
                            <Link
                              className="item-link top-news-link"
                              to={`hotNews/${index}`}
                            >
                              {item.title}
                            </Link>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
