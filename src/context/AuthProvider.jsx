import { useState } from "react";
import AuthContext from "./AuthContext";

// Demo account so you can test without signing up.
// It owns the jsonplaceholder posts whose userId is 1.
const SEED_USERS = [
  { id: 1, name: "Demo User", email: "demo@example.com", password: "demo123" },
];

// Never keep the password in the "logged in" object
function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function AuthProvider({ children }) {
  const [users, setUsers] = useState(SEED_USERS);
  const [currentUser, setCurrentUser] = useState(null);

  function signUp({ name, email, password }) {
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const newUser = { id: Date.now(), name, email, password };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(toPublicUser(newUser)); // log in straight after signing up
    return { ok: true };
  }

  function signIn({ email, password }) {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user || user.password !== password) {
      return { ok: false, error: "Invalid email or password." };
    }

    setCurrentUser(toPublicUser(user));
    return { ok: true };
  }

  function signOut() {
    setCurrentUser(null);
  }

  function getAuthorName(userId) {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : `User ${userId}`;
  }

  const value = {
    currentUser,
    isAuthenticated: currentUser !== null,
    signUp,
    signIn,
    signOut,
    getAuthorName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;