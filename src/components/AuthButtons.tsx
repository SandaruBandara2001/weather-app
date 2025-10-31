import { useAuth0 } from "@auth0/auth0-react";
import "./AuthButtons.css";

export default function AuthButtons() {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  if (isLoading) return (
    <div className="auth-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  return isAuthenticated ? (
    <div className="auth-container">
      <div className="user-info">
        <div className="user-avatar">
          {user?.picture ? (
            <img src={user.picture} alt={user?.name} className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="user-details">
          <span className="user-name">{user?.name || 'User'}</span>
          <span className="user-email">{user?.email}</span>
        </div>
      </div>
      <button
        className="logout-btn"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        <svg className="logout-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M17 16L21 12M21 12L17 8M21 12H9M9 6H7C5.89543 6 5 6.89543 5 8V16C5 17.1046 5.89543 18 7 18H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Log out
      </button>
    </div>
  ) : (
    <button className="login-btn" onClick={() => loginWithRedirect()}>
      <svg className="login-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Log in
    </button>
  );
}