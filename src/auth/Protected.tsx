import { withAuthenticationRequired } from "@auth0/auth0-react";

export function protect<T extends object>(C: React.ComponentType<T>) {
  return withAuthenticationRequired(C, {
    onRedirecting: () => <div style={{padding:24}}>Checking authentication…</div>,
  });
}
