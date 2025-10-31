// src/auth/AuthProvider.tsx
import { Auth0Provider } from "@auth0/auth0-react";

function onRedirectCallback() {
  window.history.replaceState({}, document.title, "/");
}

export default function AppAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
  );
}
