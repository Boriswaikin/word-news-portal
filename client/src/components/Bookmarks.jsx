import "../style/bookmarks.css";
import "../style/home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { Outlet, Link,useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import AppLayout from "./AppLayout";
import useBookmarks from "../hooks/useBookmarks";

export default function Bookmarks() {
  const { accessToken } = useAuthToken();
  // const { isAuthenticated, loginWithRedirect } = useAuth0();
  // const signUp = () => loginWithRedirect({authorizationParams: {screen_hint: "signup"}});
  // const { user, isLoading, logout } = useAuth0();
  const [bookmarks,setBookmarks] = useBookmarks();
  const [edit,setEdit] = useState(false);
  const editForm = document.querySelector(".edit-panel");
  const [newTitle,setNewTitle] = useState("");
  const [newID,setNewID] = useState();

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
      setBookmarks((prev)=>prev.filter((element)=>element.id!==deleteID));
    }
  }

  async function updateBookmarks(updateID) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/` + updateID, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body:JSON.stringify({
        displayTitle: newTitle}),
    });
    if (data.ok) {
      await data.json();
      console.log("update success");
      setBookmarks((prev)=>prev.map(({id,displayTitle,...prev})=>
      ({...prev,displayTitle:id===updateID?newTitle:displayTitle})
      ));
    }
  }



  // async function deleteBookmarks(updateID) {

  //   const newTitle = e
  //   const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/` + updateID, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   if (data.ok) {
  //     await data.json();
  //     console.log("update success");
  //     setBookmarks((prev)=>prev.filter((element)=>element.id!==deleteID));
  //   }
  // }

  return (
    <div className="home">
      <div className="bookmark-panel">
      <ul className="bookmark-list">
      {bookmarks && bookmarks.map((item,index) => {
          return (
            <li 
              key={index} className="bookmark-item">
                <Link className="bookmark-link" to={`/news/${index}?data=${encodeURIComponent(JSON.stringify(item))}`}>{item.displayTitle}</Link>
                <p>{item.category}</p>
                <p className="bookmarks-publishDate">{item.publishDate}</p>
                <button className="delete-bookmarks" onClick={()=>{
                  setNewID(item.id);
                  setEdit(true);}}>
                  <box-icon class="delete-bookmarks-icon" name='edit'></box-icon>
                </button>
                <button className="delete-bookmarks" onClick={()=>deleteBookmarks(item.id)}>
                  <box-icon class="delete-bookmarks-icon" name='trash'></box-icon>
                </button>
            </li>
          )})}
        </ul>
        {edit && <section className="edit-form">
        <form className="edit-panel">
          <h3 className="edit-header">Edit Bookmark</h3>
          <h5 className="edit-subHeader">Name</h5>
          <input type="text" id="newBookmarks" name="newBookmarks"
          onChange={(e)=>{
            // console.log(e.target.value);
            setNewTitle(e.target.value)}}
          ></input>
          <div className="edit-button-wrapper">
          <button title="cancel" className="edit-button cancel" onClick={(e)=>{
            console.log(e.target.value);
            setEdit(false);
            }}>Cancel</button>
          <button title="save" className="edit-button save" onClick={()=>{
            updateBookmarks(newID);
            setEdit(false)}}>Save</button>
          </div>
          </form>
            </section>}
    </div>
    </div>
  );
}
