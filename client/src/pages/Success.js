import React from 'react';

import "../sass/MagicLink.scss";

const Success = (props) => {
  console.log('PROPS', props);

  return (
    <div className="flex-container">
      <div className="new">
        <div className="new-headers">
          <h3 className="last-row">Success!</h3>
          <h4 className="last-row">Soon, you'll be able to: </h4>
        </div>
        <div className="future-list">
          <p>  
            <span role="img" aria-label="step1">👉</span> View your detailed, personalized journey...
          </p>
          <p>
            <span role="img" aria-label="step2">👉</span> Get matched with projects that need you...
          </p>
          <p>
            <span role="img" aria-label="step3">👉</span> Manage your own project!
          </p>
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
