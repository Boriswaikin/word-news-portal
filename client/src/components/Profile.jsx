import { useAuth0 } from "@auth0/auth0-react";
import "../style/profile.css";

export default function Profile() {
  const { user } = useAuth0();

  return (
    <div className="profile">
      <div>
        <p>Name: {user.name}</p>
      </div>
      <div>
        <img src={user.picture} className="icon" width="70" alt="profile avatar" />
      </div>
      <div>
        <p>📧 Email: {user.email}</p>
      </div>
      <div>
        <p>🔑 Auth0Id: {user.sub}</p>
      </div>
      <div>
        <p>✅ Email verified: {user.email_verified?.toString()}</p>
      </div>
    </div>
  );
}
