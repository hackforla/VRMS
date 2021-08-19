import { useState, useEffect } from "react";

export default function useProvideAuth() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [user, setUser] = useState();
  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

  async function checkUser() {
    try {
      const response = await fetch("/api/auth/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-customrequired-header": headerToSend
        },
      });
      const user = await response.json();
      setUser(user);
      setIsAdmin(user.accessLevel === 'admin');
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return { user, isAdmin };
}
