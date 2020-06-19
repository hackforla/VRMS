import React, { useEffect } from "react";
// import { Link } from 'react-router-dom';

import "../sass/MagicLink.scss";

const Success = (props) => {
  console.log("PROPS", props);
  // const [isLoading, setIsLoading] = useState(false);
  // const [event, setEvent] = useState([]);
  // const [isError, setIsError] = useState(null);
  // const [magicLink, setMagicLink] = useState('https://localhost:3000/api/happyURLfuntime');

  // async function fetchData() {
  //     try {
  //         const res = await fetch(`http://localhost:4000/api/events/${props.match.params.id}`);
  //         const resJson = await res.json();
  //         setEvent(resJson);
  //     } catch(error) {
  //         setIsError(error);
  //         alert(error);
  //     }
  // }

  // useEffect(() => {
  //     // fetchData();
  //     // let timer = setTimeout(() => {
  //     //     props.history.push('/');
  //     // }, 6000);

  //     // return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="flex-container">
      <div className="new">
        {/* <div class="rotated-success"></div> */}
        <div className="new-headers">
          <h3 className="last-row">Success!</h3>
          <h4 className="last-row">Soon, you'll be able to: </h4>
        </div>
        <div className="future-list">
          <p>👉 View your detailed, personalized journey...</p>
          <p>👉 Get matched with projects that need you...</p>
          <p>👉 Manage your own project!</p>
        </div>

        <div className="success-info">
          <p>
            Thanks for being a part of the alpha test! Your feedback is valued
            and appreciated.
          </p>
          <p>Have fun tonight!</p>
        </div>
      </div>
    </div>
  );
};

export default Success;
