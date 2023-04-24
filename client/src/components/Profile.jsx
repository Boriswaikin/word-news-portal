import "../style/profile.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { useState ,useEffect } from "react";

export default function Profile() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  const [ userInfo, setUserInfo ] = useState({});
  const [ edit, setEdit ] = useState(false);

  const [ name, setName ] = useState("");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ birthday, setBirthday] = useState("");
  const [ gender, setGender ] = useState("");
  const [ phone, setPhone ] = useState("");
  const [ address, setAddress ] = useState("");

  useEffect(() => {
    async function getUserInfo() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else {
        console.log("get user info failed");
      }
    }

    if(accessToken){
      getUserInfo();
    }
  }, [accessToken]);

  return (
    <div className="profile">
      <div className="profile_panel">
        <div className="user_icon">
          <img src={user.picture} className="icon" width="70" alt="profile avatar" />
        </div>
        <button className="edit_button" title="Edit Profile" onClick={() => {
          if(edit && !name){
            alert("Please enter a username");
            return;
          }
          if(edit){
            fetch(`${process.env.REACT_APP_API_URL}/profile`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                name: name,
                firstName: firstName,
                lastName: lastName,
                birthday: birthday,
                gender: gender,
                phone: phone,
                address: address,
              }),
            }).then((response) => response.json())
              .then((data) => setUserInfo(data))
              .catch((error) => console.log(error));
          }
          setEdit(!edit);
        }}>
          {edit? "Save" : "Edit"}
        </button>
        {edit &&
        <button className="edit_button" onClick={() => setEdit(false) }>Cancel</button>}
      </div>

      { !edit ? (
        <div className="profile-fields">
          <p>Username: {userInfo?.name}</p>
          <p>Email: {userInfo?.email}</p>
          <p>First name: {userInfo?.firstName}</p>
          <p>Last name: {userInfo?.lastName}</p>
          <p>Birthday: {userInfo?.birthday}</p>
          <p>Gender: {userInfo?.gender}</p>
          <p>Phone: {userInfo?.phone}</p>
          <p>Address: {userInfo?.address}</p> 
        </div> 
      ) : (
        <div className="modify-fields">
          <div>
            <label htmlFor="name">Username:</label>
            <input type="text" name="name" id="name" placeholder={userInfo?.name} onChange={(e) => setName(e.target.value)} required/>
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="text" name="email" id="email" value={user.email} disabled/>
          </div>
          <div>
            <label htmlFor="firstName">First name:</label>
            <input type="text" name="firstName" id="firstName" placeholder={userInfo?.firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="lastName">Last name:</label>
            <input type="text" name="lastName" id="lastName" placeholder={userInfo?.lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="birthday">Birthday:</label>
            <input type="date" name="birthday" id="birthday" placeholder={userInfo?.birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>
          <div>
            <label htmlFor="gender">Gender:</label>
            <input type="text" name="gender" id="gender" placeholder={userInfo?.gender} onChange={(e) => setGender(e.target.value)} />
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <input type="tel" name="phone" id="phone" placeholder={userInfo?.phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input type="text" name="address" id="address" placeholder={userInfo?.address} onChange={(e) => setAddress(e.target.value)} />
          </div>
      </div> 
      )
      }
    </div>
  )
}
