import React, { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase";

const Authentication = ({ onAuthSuccess, onAuthLogout }) => {
  const [user, setUser] = useState(null);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      onAuthSuccess();  // Notify parent about successful login
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      onAuthLogout();  // Notify parent about logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt="Profile" width="50" />
          <button onClick={logOut}>Logout</button>
        </div>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Authentication;
