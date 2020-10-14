import React, { useState, useEffect } from "react";

import "../sass/MagicLink.scss";

const HandleAuth = (props) => {
  const [isMagicLinkValid, setMagicLink] = useState(null);

  async function isValidToken() {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const api_token = params.get("token");

    try {
      const response = await fetch("/api/auth/verify-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": api_token,
        },
      });
      const body = await response;
      setMagicLink(response.status === 200);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    isValidToken();
  }, []);

  let text;
  if (isMagicLinkValid == true) {
    text = <p>Magic link is valid</p>;
  } else {
    text = <p>Magic link is NOT valid</p>;
  }

  return (
    <div className="flex-container">
      <div>{text}</div>
    </div>
  );
};

export default HandleAuth;
