import { createContext } from "react";
export const AuthContext = createContext({
  authState: { id: "", isOwner: false, signedIn: false },
  setAuthState: () => {},
});
