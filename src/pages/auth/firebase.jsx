// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDuN4d9ltnXk2jhqGpOfMJqk8BwnMHDuYQ",
  authDomain: "voicementor-74ab9.firebaseapp.com",
  projectId: "voicementor-74ab9",
  storageBucket: "voicementor-74ab9.firebasestorage.app",
  messagingSenderId: "136992486291",
  appId: "1:136992486291:web:6ede83e742f0e050596e66",
  measurementId: "G-VS0WF5R9DM",
  databaseURL: "https://console.firebase.google.com/u/0/project/voicementor-74ab9/database/voicementor-74ab9-default-rtdb/data/~2F",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // ✅ Add this line

export { app, auth, provider };
