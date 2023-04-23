import "../style/profile.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { useState ,useEffect } from "react";

export default function Profile() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  const [ userInfo, setUserInfo ] = useState({});
  const [ edit, setEdit ] = useState(false);

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
      </div>

      { !edit ? (
        <div className="profile-fields">
          <div>
            <p>Username: {userInfo?.name}</p>
          </div>
          <div>
            <p>Email: {userInfo?.email}</p>
          </div>
          <div>
            <p>First name: {userInfo?.firstName}</p>
          </div>
          <div>
            <p>Last name: {userInfo?.lastName}</p>
          </div>
          <div>
            <p>Birthday: {userInfo?.birthday}</p>
          </div>
          <div>
            <p>Gender: {userInfo?.gender}</p>
          </div>
          <div>
            <p>Phone: {userInfo?.phone}</p>
          </div>
          <div>
            <p>Address: {userInfo?.address}</p>
          </div>
        </div> 
      ) : (<p>hello</p>)
      }
    </div>
  )
}
