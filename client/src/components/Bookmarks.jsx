import "../style/bookmarks.css";
import "../style/home.css";
import { useAuthToken } from "../AuthTokenContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBookmark } from "../hooks/markContext";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();
  const { bookmarks, setBookmarks } = useBookmark();
  const [ edit, setEdit ] = useState(false);
  const [ newTitle, setNewTitle ] = useState("");
  const [ newID, setNewID ] = useState();

  console.log("bookmarks", bookmarks);

  async function deleteBookmarks(deleteID) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/news/` + deleteID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (data.ok) {
      await data.json();
      console.log("delete success");
      setBookmarks((prev) => prev.filter((element) => element.id !== deleteID));
    }
  }

  async function updateBookmarks(updateID) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/news/` + updateID, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        displayTitle: newTitle}),
    });
    if (data.ok) {
      await data.json();
      console.log("update success");
      setBookmarks((prev) => prev.map(({id , displayTitle, ...prev})=>
        ({...prev, id : id, displayTitle : id === updateID ? newTitle : displayTitle})
      ));
    }
  }

  return (
    <div className="home">
      <div className="bookmark-panel">
      <ul className="bookmark-list">
        <li className= "bookmark-header-wrapper">
          <h5 className="bookmark-header title">Title</h5>
          <h5 className="bookmark-header category">Category</h5>
          <h5 className="bookmark-header publishDate">Publish Date</h5>
        </li>
        { bookmarks && bookmarks.map((item,index) => {
          return (
            <li 
              key={index} className="bookmark-item">
                <Link to={`/bookmarks/${index}`} className="bookmark-link" aria-label="Bookmarks link">{item.displayTitle}</Link>
                <p className="bookmarks-category">{item.category}</p>
                <p className="bookmarks-publishDate">{item.publishDate}</p>
                <button title="edit bookmark" className="bookmarks-logo" aria-label="edit bookmark" onClick={()=>{
                  setNewID(item.id);
                  setEdit(true);}}>
                  <box-icon class="bookmarks-icon" color="blue" name='edit'></box-icon>
                </button>
                <button title="delete bookmark" className="bookmarks-logo" aria-label="delete bookmark" onClick={()=>deleteBookmarks(item.id)}>
                  <box-icon class="bookmarks-icon" color="red" name='trash'></box-icon>
                </button>
                <button title="Ask chatGPT" className="bookmarks-logo" aria-label="Ask ChatGpt" onClick={()=>navigate(`/app/chatGPT/${index}`)}>
                  <box-icon class="bookmarks-icon" color="green" name='message-rounded-detail'></box-icon>
                </button>
            </li>
          )})}
        </ul>
        { edit && <section className="edit-form">
          <form className="edit-panel">
            <h3 className="edit-header">Edit Bookmark</h3>
            <h5 className="edit-subHeader">Name</h5>
            <input type="text" id="newBookmarks" name="newBookmarks"
              onChange={(e)=>{
                setNewTitle(e.target.value)}}
              ></input>
            <div className="edit-button-wrapper">
              <button title="cancel" className="edit-button cancel" onClick={()=> setEdit(false)}>Cancel</button>
              <button title="save" className="edit-button save" onClick={()=>{
                updateBookmarks(newID);
                setEdit(false)
              }}>Save</button>
            </div>
          </form>
        </section>}
      </div>
    </div>
  );
}
