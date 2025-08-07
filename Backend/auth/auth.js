//////// fake auth
import { auth } from "./firebase";

export const loginUser = (email) => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", email);
};

export const logoutUser = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

////// This is Services/auth---------------
// services/auth.js
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User logged in:", result.user);
  } catch (error) {
    console.error("Google login error:", error);
  }
};
