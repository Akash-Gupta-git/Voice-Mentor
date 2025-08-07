// import React, { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../../Backend/auth/firebase'; // Assuming your firebase.js is in src/firebase.js

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  // State for Navbar display
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userInitial, setUserInitial] = useState('');

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || 'No Email'); // Use user.email from Firebase
        setUserInitial((user.email ? user.email.charAt(0).toUpperCase() : 'U')); // Use initial from email
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        setUserInitial('');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [auth]);

  // Function to handle logout
  const logout = async () => {
    try {
      await signOut(auth);
      
      // State will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // The value provided to consumers of the context
  const value = {
    currentUser,
    isLoggedIn,
    userEmail,
    userInitial,
    logout,
    // We don't need a 'login' function here as Firebase's signInWithEmailAndPassword
    // or signInWithPopup will trigger onAuthStateChanged directly.
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children once auth state is determined */}
    </AuthContext.Provider>
  );
};
