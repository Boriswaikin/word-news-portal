import "../style/profile.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useState ,useEffect } from "react";

export default function Profile() {
  const { user } = useAuth0();
  const[ userInfo, setUserInfo ] = useState({});

  return (
    <div className="profile">
      <div className="user_icon">
        <img src={user.picture} className="icon" width="70" alt="profile avatar" />
      </div>

      <div className="profile-fields">
        <div>
          <p>Username: {user.name}</p>
        </div>
        <div>
          <p>First name: {user.firstName}</p>
        </div>
        <div>
          <p>Last name: {user.lastName}</p>
        </div>
        <div>
          <p>Birthday: {user.birthday}</p>
        </div>
        <div>
          <p>Gender: {user.gender}</p>
        </div>
        <div>
          <p>Email: {user.email}</p>
        </div>
        <div>
          <p>Phone: {user.phone}</p>
        </div>
        <div>
          <p>Address: {user.address}</p>
        </div>
      </div>
    </div>
  );
}
